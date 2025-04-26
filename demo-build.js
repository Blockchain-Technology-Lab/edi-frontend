const fs = require("fs")
const path = require("path")
const { execSync, spawnSync} = require("child_process")
const readline = require("readline")


// === CONFIG ===
const config = {
  basePath: "/blockchainlab/demo",
  outputDir: "upload/demo",
  afsDeployPath: "/afs/inf.ed.ac.uk/group/project/blockchainlab/html/demo"
}

const FILES_TO_MODIFY = [
  "next.config.mjs",
  "src/utils/paths.ts",
  "src/components/ui/HomepageTitleCard.tsx"
]

let originalContents = {}

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}

function cleanDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true, force: true })
  }
  ensureDirectoryExists(directory)
}

function backupFiles() {
  FILES_TO_MODIFY.forEach((file) => {
    originalContents[file] = fs.readFileSync(file, "utf8")
  })
}

function restoreFiles() {
  FILES_TO_MODIFY.forEach((file) => {
    fs.writeFileSync(file, originalContents[file])
  })
}

function updateConfig(basePath, outputDir) {
  // Update next.config.mjs
  updateFile("next.config.mjs", [
    [/basePath:\s*["'].*?["']/g, `basePath: "${basePath}"`],
    [/distDir:\s*["'].*?["']/g, `distDir: "${outputDir}"`]
  ])

  // Update src/utils/paths.ts
  updateFile("src/utils/paths.ts", [
    [/basePath\s*=\s*["'].*?["']/g, `basePath = "${basePath}"`]
  ])

  // Update src/components/ui/HomepageTitleCard.tsx
  updateFile("src/components/ui/HomepageTitleCard.tsx", [
    [/basePath\s*=\s*["'][^"']*["']/g, `basePath = "${basePath}"`]
  ])
}

function updateFile(filePath, replacements) {
  let fileContent = fs.readFileSync(filePath, "utf8")
  replacements.forEach(([regex, replacement]) => {
    fileContent = fileContent.replace(regex, replacement)
  })
  fs.writeFileSync(filePath, fileContent)
}

function build(config) {
  console.log(`Building for basePath: ${config.basePath}`)
  try {
    updateConfig(config.basePath, config.outputDir)

    ensureDirectoryExists("upload")
    cleanDirectory(config.outputDir)

    execSync(`yarn build`, { stdio: "inherit" })

    console.log(`Build completed for ${config.basePath}`)
  } catch (error) {
    console.error(` Build failed for basePath: ${config.basePath}`, error)
  }
}
function deployToAFS(localDir, afsDir) {
  console.log("\nDeploying to AFS...");

  try {
    console.log(`Copying files from ${localDir} to ${afsDir}...`);
    execSync(`cp -R ${localDir}/* ${afsDir}/`, { stdio: "inherit" });

    console.log("Deployment to AFS successful.");
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}


async function prompt(question, defaultValue = "") {
  const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      if (answer.trim() === "") {
        resolve(defaultValue);
      } else {
        resolve(answer.trim());
      }
    });
  });
}


async function loginToAFS() {
  const username = await prompt("Enter your AFS username (default: zjan@INF.ED.AC.UK): ", "zjan@INF.ED.AC.UK");

  console.log(`Running kinit for ${username}...`);
  const kinit = spawnSync("kinit", [username], { stdio: "inherit" })

  if (kinit.status !== 0) {
    console.error("kinit failed.")
    process.exit(1)
  }

  console.log("Running aklog...")
  const aklog = spawnSync("aklog", { stdio: "inherit" })

  if (aklog.status !== 0) {
    console.error("aklog failed.")
    process.exit(1)
  }

  console.log("AFS login successful.")
}


// === Execution ===
(async () => {
  const shouldDeploy = process.argv.includes("--deploy")

  try {
    if (shouldDeploy) {
      await loginToAFS()
    }

    backupFiles()
    build(config)

    if (shouldDeploy) {
      deployToAFS(config.outputDir, config.afsDeployPath)
    }

    console.log("\nDemo build script completed successfully.")
  } catch (error) {
    console.error("An error occurred:", error)
  } finally {
    restoreFiles()
    console.log("Configuration files restored to original state.")
  }
})()
