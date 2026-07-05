#!/usr/bin/env bash
# Installs IPFS, uploads a dataset folder, and prints a ready-to-send
# email with the CID and dataset details. Safe to re-run at any time -
# every step checks what's already done before acting.

set -euo pipefail

CONTACT_EMAIL="edi@ed.ac.uk"
PROJECT_NAME="Edinburgh Blockchain EDI Dashboard"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

INSTALL_DIR="$HOME/.ipfs-tutorial"
BIN_DIR="$INSTALL_DIR/bin"
IPFS_BIN="$BIN_DIR/ipfs"
DAEMON_LOG="$INSTALL_DIR/daemon.log"
DAEMON_PID_FILE="$INSTALL_DIR/daemon.pid"

mkdir -p "$BIN_DIR"

# ---------------------------------------------------------------------------
# Step 0: OS detection
# ---------------------------------------------------------------------------
case "$(uname -s 2>/dev/null || echo unknown)" in
  Darwin) OS_TYPE="mac" ;;
  Linux) OS_TYPE="linux" ;;
  MINGW*|MSYS*|CYGWIN*) OS_TYPE="windows" ;;
  *) OS_TYPE="unknown" ;;
esac

if [ "$OS_TYPE" = "windows" ] || [ "$OS_TYPE" = "unknown" ]; then
  cat <<EOF
This script supports macOS and Linux only.

Please use the IPFS Desktop app instead - see "Option C: IPFS Desktop
(GUI)" on the upload step of the tutorial, or install directly from:
https://docs.ipfs.tech/install/ipfs-desktop/
EOF
  exit 1
fi

for dep in curl tar du find; do
  if ! command -v "$dep" >/dev/null 2>&1; then
    echo "Error: required command '$dep' not found. Please install it and re-run this script."
    exit 1
  fi
done

# ---------------------------------------------------------------------------
# Step 1: Install IPFS (Kubo), user-local, no sudo
# ---------------------------------------------------------------------------
install_ipfs() {
  if [ -x "$IPFS_BIN" ]; then
    echo "IPFS is already installed."
    return
  fi

  if [ "$OS_TYPE" = "mac" ] && command -v brew >/dev/null 2>&1; then
    echo "Installing IPFS via Homebrew ..."
    brew install ipfs
    local brew_ipfs
    brew_ipfs="$(brew --prefix ipfs 2>/dev/null)/bin/ipfs"
    [ -x "$brew_ipfs" ] || brew_ipfs="$(command -v ipfs)"
    ln -sf "$brew_ipfs" "$IPFS_BIN"
    return
  fi

  echo "Downloading IPFS (Kubo) ..."
  local arch
  case "$(uname -m)" in
    x86_64|amd64) arch="amd64" ;;
    arm64|aarch64) arch="arm64" ;;
    *) echo "Error: unsupported CPU architecture $(uname -m)"; exit 1 ;;
  esac

  local kubo_os="linux"
  [ "$OS_TYPE" = "mac" ] && kubo_os="darwin"

  local version
  version="$(curl -fsSL https://dist.ipfs.tech/kubo/versions | grep -Ev -- '-rc|-beta|-dev' | tail -n1)"
  if [ -z "$version" ]; then
    echo "Error: couldn't determine the latest IPFS version - check your internet connection and try again."
    exit 1
  fi

  local tarball="kubo_${version}_${kubo_os}-${arch}.tar.gz"
  local url="https://dist.ipfs.tech/kubo/${version}/${tarball}"
  local tmp_dir
  tmp_dir="$(mktemp -d)"

  echo "Fetching $url ..."
  if ! curl -fsSL "$url" -o "$tmp_dir/$tarball"; then
    echo "Error: failed to download IPFS - check your internet connection and try again."
    rm -rf "$tmp_dir"
    exit 1
  fi
  tar -xzf "$tmp_dir/$tarball" -C "$tmp_dir"
  cp "$tmp_dir/kubo/ipfs" "$IPFS_BIN"
  chmod +x "$IPFS_BIN"
  rm -rf "$tmp_dir"

  echo "IPFS installed to $IPFS_BIN"
}

install_ipfs

# ---------------------------------------------------------------------------
# Step 2: ipfs init (idempotent)
# ---------------------------------------------------------------------------
if [ -d "$HOME/.ipfs" ]; then
  echo "IPFS repo already initialized."
else
  echo "Initializing IPFS ..."
  "$IPFS_BIN" init
fi

# ---------------------------------------------------------------------------
# Step 3: start the daemon in the background if not already running
#
# Note: `ipfs id` / `ipfs add` / `ipfs pin ls` all succeed even with NO
# daemon running (Kubo falls back to reading the repo directly), so they
# can't be used to detect a live daemon. We check the API HTTP port
# instead, which only responds while a daemon actually holds the repo.
# ---------------------------------------------------------------------------
API_ADDR="127.0.0.1:5001"

daemon_is_running() {
  curl -fsS -m 2 -X POST "http://$API_ADDR/api/v0/id" >/dev/null 2>&1
}

if daemon_is_running; then
  echo "IPFS daemon is already running."
else
  echo "Starting IPFS daemon in the background ..."
  nohup "$IPFS_BIN" daemon > "$DAEMON_LOG" 2>&1 &
  disown
  echo $! > "$DAEMON_PID_FILE"

  echo -n "Waiting for daemon to come online"
  for _ in $(seq 1 60); do
    if daemon_is_running; then
      echo " done."
      break
    fi
    echo -n "."
    sleep 1
  done

  if ! daemon_is_running; then
    echo
    echo "Error: IPFS daemon did not start. Check $DAEMON_LOG for details."
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Step 4: ask for the dataset folder
# ---------------------------------------------------------------------------
DATASET_DIR=""
while [ -z "$DATASET_DIR" ]; do
  read -rp "Enter the path to your dataset folder: " input_dir
  input_dir="${input_dir/#\~/$HOME}"
  if [ -d "$input_dir" ]; then
    DATASET_DIR="$input_dir"
  else
    echo "That folder doesn't exist - please check the path and try again."
  fi
done

# ---------------------------------------------------------------------------
# Step 5: metadata.json - generate interactively if missing
# ---------------------------------------------------------------------------
METADATA_FILE="$DATASET_DIR/metadata.json"

json_escape() {
  if command -v python3 >/dev/null 2>&1; then
    python3 -c 'import json,sys; print(json.dumps(sys.argv[1]))' "$1"
  else
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    printf '"%s"' "$s"
  fi
}

if [ -f "$METADATA_FILE" ]; then
  echo "Found existing metadata.json in your dataset folder - using it."
else
  echo
  echo "A few quick questions about this dataset (used in the email we'll prepare for you):"
  read -rp "What's the name of your project or blockchain? " META_PROJECT
  read -rp "Which network is this data from? (e.g. mainnet, testnet) " META_NETWORK
  read -rp "What version of your node software were you running when you collected this? (e.g. 3.2.1) " META_NODE_VERSION
  read -rp "What date was this data collected? (YYYY-MM-DD) " META_COLLECTION_DATE
  read -rp "What version number would you give this dataset? (e.g. 1.0) " META_DATASET_VERSION
  read -rp "In a sentence or two, what does this dataset contain? " META_DESCRIPTION

  cat > "$METADATA_FILE" <<EOF
{
  "project": $(json_escape "$META_PROJECT"),
  "network": $(json_escape "$META_NETWORK"),
  "node_version": $(json_escape "$META_NODE_VERSION"),
  "collection_date": $(json_escape "$META_COLLECTION_DATE"),
  "dataset_version": $(json_escape "$META_DATASET_VERSION"),
  "description": $(json_escape "$META_DESCRIPTION")
}
EOF
  echo "Saved metadata.json into your dataset folder."
fi

read_field() {
  local key="$1"
  if command -v python3 >/dev/null 2>&1; then
    python3 -c "import json,sys; d=json.load(open(sys.argv[1])); print(d.get(sys.argv[2],''))" "$METADATA_FILE" "$key"
  else
    grep -o "\"$key\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" "$METADATA_FILE" | sed -E 's/.*:[[:space:]]*"(.*)"/\1/'
  fi
}

# ---------------------------------------------------------------------------
# Step 6: upload the dataset
# ---------------------------------------------------------------------------
echo
echo "Uploading your dataset - this may take a while for large datasets ..."
CID="$("$IPFS_BIN" add -rQ "$DATASET_DIR" | tail -n1)"
echo "Upload complete. CID: $CID"

SIZE="$(du -sh "$DATASET_DIR" | awk '{print $1}')"

# ---------------------------------------------------------------------------
# Step 7: optional checksum
# ---------------------------------------------------------------------------
CHECKSUM=""
read -rp "Compute a checksum too? Not required - the CID already verifies your data. (y/N) " compute_checksum
if [[ "$compute_checksum" =~ ^[Yy]$ ]]; then
  echo "Computing checksum ..."
  hash_cmd="sha256sum"
  [ "$OS_TYPE" = "mac" ] && hash_cmd="shasum -a 256"
  CHECKSUM="$(find "$DATASET_DIR" -type f -exec $hash_cmd {} \; | sort -k 2 | $hash_cmd | awk '{print $1}')"
fi

# ---------------------------------------------------------------------------
# Step 8: print the ready-to-send email
# ---------------------------------------------------------------------------
cat <<EOF

======================================================================
Copy everything below and email it to: $CONTACT_EMAIL
======================================================================
Project: $(read_field project)
Organization: (please fill in your organization name)

Dataset:
$(read_field description)
Version $(read_field dataset_version)

CID:
$CID

Size:
$SIZE
EOF

if [ -n "$CHECKSUM" ]; then
  echo "SHA256 checksum: $CHECKSUM"
fi

cat <<EOF

Notes:
Collected using node version $(read_field node_version) on network $(read_field network), dated $(read_field collection_date).
======================================================================

Reminder: please keep this computer and IPFS running until we confirm
we've retrieved your dataset.
EOF
