import fs from "fs";
import path from "path";
import { execSync, spawnSync } from "child_process";
import readline from "readline";
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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
let didRestore = false;

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
    if (originalContents[file]) {
      fs.writeFileSync(file, originalContents[file]);
    }
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
  console.log(chalk.cyan(`Building project...`));
  ensureDirectoryExists("upload");
  cleanDirectory(outputDir);

  execSync(`yarn build`, { stdio: "inherit" });
  console.log(chalk.green(`Build completed.`));
}

function deployToAFS(localDir, afsDir, skipOutputFolder = false) {
  console.log(chalk.green("\nDeploying to AFS..."));
  try {

  const command = skipOutputFolder
    ? `rsync -av --exclude 'output/' ${localDir}/ ${afsDir}/`
    : `cp -R ${localDir}/* ${afsDir}/`;

  execSync(command, { stdio: "inherit" });
  
  console.log(chalk.green("Deployment to AFS successful."));
  } catch (error) {
    console.error(chalk.red("Deployment failed:", error));
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
  console.log(chalk.green(`Running kinit for ${username}...`));
  if (spawnSync("kinit", [username], { stdio: "inherit" }).status !== 0) {
    console.error("kinit failed.");
    process.exit(1);
  }
  console.log(chalk.green("Running aklog..."));
  if (spawnSync("aklog", { stdio: "inherit" }).status !== 0) {
    console.error("aklog failed.");
    process.exit(1);
  }
  console.log(chalk.green("AFS login successful.\n"));
}


function safeRestoreAndExit(code = 1) {
  if (!didRestore) {
    console.log(chalk.green(`Restoring configuration files before exiting...`));
    restoreFiles();
    didRestore = true;
  }
  process.exit(code);
}

// === Main Execution ===
(async () => {
  const argv = yargs(hideBin(process.argv))
    .option("deploy", { type: "boolean", default: false })
    .option("no-output", { type: "boolean", default: false })
    .parseSync();

  const shouldDeploy = argv.deploy;
  const skipOutputFolder = argv["no-output"];
  //const shouldDeploy = process.argv.includes("--deploy");
  //const skipOutputFolder = process.argv.includes("--no-output");

  // Always restore on process exit (e.g., Ctrl+C)
  process.on("SIGINT", () => {
    console.error(chalk.yellow("\nInterrupted (SIGINT). Cleaning up..."));
    safeRestoreAndExit(1);
  });

  process.on("uncaughtException", (err) => {
    console.error("\nUncaught Exception:", err);
    safeRestoreAndExit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("\nUnhandled Rejection:", reason);
    safeRestoreAndExit(1);
  });

  try {
    if (shouldDeploy) {
      await loginToAFS();
    }

    console.log(chalk.blueBright("Backing up configuration files..."));
    backupFiles();

    console.log(chalk.blueBright("Updating configuration for build..."));
    updateConfig(config.basePath, config.outputDir);

    console.log(chalk.blueBright("Running build..."));
    buildProject(config.outputDir);

    console.log(chalk.blueBright("Restoring original configuration..."));
    restoreFiles();
    didRestore = true;

    if (shouldDeploy) {
      console.log(chalk.blueBright("Deploying..."));
      deployToAFS(config.outputDir, config.afsDeployPath, skipOutputFolder);
    }

    console.log(chalk.green("\nDemo build script completed successfully."));
  } catch (error) {
    console.error(chalk.red("\nAn error occurred during the build process."));
    console.error(error.message || error);
    safeRestoreAndExit(1);
    //process.exit(1);
  }
})();
