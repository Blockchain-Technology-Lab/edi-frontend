const fs = require("fs");
const path = require("path");
const { execSync, spawnSync } = require("child_process");
const readline = require("readline");

// === CONFIG ===
const config = {
  basePath: "/blockchainlab/demo",
  outputDir: "upload/demo",
  afsDeployPath: "/afs/inf.ed.ac.uk/group/project/blockchainlab/html/demo"
};

const FILES_TO_MODIFY = [
  "next.config.mjs",
  "src/utils/paths.ts",
  "src/components/ui/HomepageTitleCard.tsx"
];

let originalContents = {};

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function cleanDirectory(directory) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
  ensureDirectoryExists(directory);
}

function backupFiles() {
  FILES_TO_MODIFY.forEach((file) => {
    originalContents[file] = fs.readFileSync(file, "utf8");
  });
}

function restoreFiles() {
  FILES_TO_MODIFY.forEach((file) => {
    fs.writeFileSync(file, originalContents[file]);
  });
}

function updateConfig(basePath, outputDir) {
  updateFile("next.config.mjs", [
    [/basePath:\s*["'].*?["']/g, `basePath: "${basePath}"`],
    [/distDir:\s*["'].*?["']/g, `distDir: "${outputDir}"`]
  ]);

  updateFile("src/utils/paths.ts", [
    [/basePath\s*=\s*["'].*?["']/g, `basePath = "${basePath}"`]
  ]);

  updateFile("src/components/ui/HomepageTitleCard.tsx", [
    [/basePath\s*=\s*["'][^"']*["']/g, `basePath = "${basePath}"`]
  ]);
}

function updateFile(filePath, replacements) {
  let fileContent = fs.readFileSync(filePath, "utf8");
  replacements.forEach(([regex, replacement]) => {
    fileContent = fileContent.replace(regex, replacement);
  });
  fs.writeFileSync(filePath, fileContent);
}

function buildProject(outputDir) {
  console.log(`Building project...`);
  try {
    ensureDirectoryExists("upload");
    cleanDirectory(outputDir);

    execSync(`yarn build`, { stdio: "inherit" });

    console.log(`Build completed.`);
  } catch (error) {
    console.error(`Build failed:`, error);
    process.exit(1);
  }
}

function deployToAFS(localDir, afsDir, skipOutputFolder = false) {
  console.log("\nDeploying to AFS...");
  try {
    if (skipOutputFolder) {
      console.log(`Copying files from ${localDir} to ${afsDir} (skipping 'output/' folder)...`);

      // Use rsync to exclude output directory
      execSync(`rsync -av --exclude 'output/' ${localDir}/ ${afsDir}/`, { stdio: "inherit" });

    } else {
      console.log(`Copying files from ${localDir} to ${afsDir} (including everything)...`);

      // Standard cp if no exclusion
      execSync(`cp -R ${localDir}/* ${afsDir}/`, { stdio: "inherit" });
    }

    console.log("Deployment to AFS successful.");
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

async function prompt(question, defaultValue = "") {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim() === "" ? defaultValue : answer.trim());
    });
  });
}

async function loginToAFS() {
  const username = await prompt("Enter your AFS username (default: zjan@INF.ED.AC.UK): ", "zjan@INF.ED.AC.UK");

  console.log(`Running kinit for ${username}...`);
  const kinit = spawnSync("kinit", [username], { stdio: "inherit" });

  if (kinit.status !== 0) {
    console.error("kinit failed.");
    process.exit(1);
  }

  console.log("Running aklog...");
  const aklog = spawnSync("aklog", { stdio: "inherit" });

  if (aklog.status !== 0) {
    console.error("aklog failed.");
    process.exit(1);
  }

  console.log("AFS login successful.\n");
}

// === Main Execution ===
(async () => {
  const shouldDeploy = process.argv.includes("--deploy");
  const skipOutputFolder = process.argv.includes("--no-output");

  try {
    if (shouldDeploy) {
      await loginToAFS();
    }

    console.log("Backing up configuration files...");
    backupFiles();

    console.log("Updating configuration for build...");
    updateConfig(config.basePath, config.outputDir);

    console.log("Running build...");
    buildProject(config.outputDir);

    console.log("Restoring configuration files...");
    restoreFiles();

    if (shouldDeploy) {
      console.log("Deploying to AFS...");
      deployToAFS(config.outputDir, config.afsDeployPath, skipOutputFolder);
    }

    console.log("\nDemo build script completed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
})();
