import fs from "fs";
import { execSync, spawnSync } from "child_process";
import readline from "readline";
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// === CONFIG ===
const configs = [
  {
    basePath: "/blockchainlab/edi-dashboard",
    outputDir: "upload/groups",
    afsDeployPath: "/afs/inf.ed.ac.uk/group/project/blockchainlab/html/edi-dashboard",
  },
  {
    basePath: "/edi-dashboard",
    outputDir: "upload/blockchainlab",
    afsDeployPath: "/afs/inf.ed.ac.uk/group/project/blockchainlab/htmlblockchainlab/edi-dashboard",
  },
];

const FILES_TO_MODIFY = ["src/utils/paths.ts", "vite.config.ts"];
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
  updateFile("src/utils/paths.ts", [
    [/basePath\s*=\s*["'].*?["']/g, `basePath = "${basePath}"`],
  ]);

  updateFile("vite.config.ts", [
    [/const base\s*=\s*['"`][^'"`]*['"`]/, `const base = "${basePath}"`],
    [/outDir:\s*['"`][^'"`]*['"`]/, `outDir: "${outputDir}"`],
  ]);
}

function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");
  for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log(chalk.green(`✔ Updated ${filePath}`));
}

function buildProject(outputDir) {
  console.log(chalk.cyan(`Building project into '${outputDir}'...`));
  ensureDirectoryExists("upload");
  cleanDirectory(outputDir);
  execSync("npm run build", { stdio: "inherit" });
  console.log(chalk.green(`Build completed for '${outputDir}'`));
}

function deployToAFS(localDir, afsDir, skipOutputFolder = false) {
  console.log(chalk.green("\n Deploying to AFS..."));
  try {
    const command = skipOutputFolder
      ? `rsync -av --exclude 'output/' ${localDir}/ ${afsDir}/`
      : `cp -R ${localDir}/* ${afsDir}/`;
    execSync(command, { stdio: "inherit" });
    console.log(chalk.green(" Deployment to AFS successful."));
  } catch (error) {
    console.error(chalk.red(" Deployment failed:"), error);
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
  const username = await prompt("Enter AFS username (default: zjan@INF.ED.AC.UK): ", "zjan@INF.ED.AC.UK");
  console.log(chalk.green(` Running kinit for ${username}...`));
  if (spawnSync("kinit", [username], { stdio: "inherit" }).status !== 0) {
    console.error(" kinit failed.");
    process.exit(1);
  }
  console.log(chalk.green(" Running aklog..."));
  if (spawnSync("aklog", { stdio: "inherit" }).status !== 0) {
    console.error(" aklog failed.");
    process.exit(1);
  }
  console.log(chalk.green(" AFS login successful.\n"));
}

function safeRestoreAndExit(code = 1) {
  if (!didRestore) {
    console.log(chalk.yellow(" Restoring modified files..."));
    restoreFiles();
    didRestore = true;
  }
  process.exit(code);
}

// === Main ===
(async () => {
  const argv = yargs(hideBin(process.argv))
    .option("deploy", { type: "boolean", default: false })
    .option("no-output", { type: "boolean", default: false })
    .parseSync();

  const shouldDeploy = argv.deploy;
  const skipOutputFolder = argv["no-output"];

  process.on("SIGINT", () => {
    console.error(chalk.red("\n Interrupted."));
    safeRestoreAndExit(1);
  });

  process.on("uncaughtException", (err) => {
    console.error("\nUncaught Exception:", err);
    safeRestoreAndExit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("\nUnhandled Rejection:", reason);
    safeRestoreAndExit(1);
  });

  try {
    if (shouldDeploy) await loginToAFS();

    for (const config of configs) {
      console.log(chalk.blueBright("\n Backing up and preparing build..."));
      backupFiles();

      updateConfig(config.basePath, config.outputDir);
      buildProject(config.outputDir);

      console.log(chalk.blueBright(" Restoring original config..."));
      restoreFiles();
      didRestore = true;

      if (shouldDeploy) {
        deployToAFS(config.outputDir, config.afsDeployPath, skipOutputFolder);
      }
    }

    console.log(chalk.green("\n All builds and deployments completed successfully."));
  } catch (err) {
    console.error(chalk.red("\n Build error occurred."));
    console.error(err.message || err);
    safeRestoreAndExit(1);
  }
})();
