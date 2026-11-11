import fs from 'fs'
import { execSync, spawnSync } from 'child_process'
import readline from 'readline'
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// === CONFIG ===
const config = {
  basePath: '/blockchainlab/demo',
  outputDir: 'upload/demo',
  afsDeployPath: '/afs/inf.ed.ac.uk/group/project/blockchainlab/html/demo'
}

const FILES_TO_MODIFY = ['src/utils/paths.ts', 'vite.config.ts']

let originalContents = {}
let didRestore = false

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
    originalContents[file] = fs.readFileSync(file, 'utf8')
  })
}

function restoreFiles() {
  FILES_TO_MODIFY.forEach((file) => {
    if (originalContents[file] !== undefined) {
      fs.writeFileSync(file, originalContents[file])
    }
  })
}

function updateConfig(basePath) {
  updateFile('src/utils/paths.ts', [
    [/basePath\s*=\s*["'].*?["']/g, `basePath = "${basePath}"`]
  ])

  updateFile('vite.config.ts', [
    [/const base\s*=\s*['"`][^'"`]*['"`]/, `const base = "${basePath}"`]
  ])
}

function updateFile(filePath, replacements) {
  let fileContent = fs.readFileSync(filePath, 'utf8')
  replacements.forEach(([regex, replacement]) => {
    // Fail loudly if the code no longer matches, instead of building with the wrong config
    if (fileContent.search(regex) === -1) {
      throw new Error(`Pattern ${regex} not found in ${filePath}`)
    }
    fileContent = fileContent.replace(regex, replacement)
  })
  fs.writeFileSync(filePath, fileContent)
  console.log(chalk.green(`Updated ${filePath} successfully.`))
}

function buildProject(outputDir) {
  console.log(chalk.cyan(`Building project...`))
  ensureDirectoryExists('upload')
  cleanDirectory(outputDir)

  // Pass outDir explicitly so the build always lands where we clean and deploy from
  execSync(`npm run build -- --outDir ${outputDir}`, { stdio: 'inherit' })
  removeDSStore(outputDir)
  restorePublicMtimes(outputDir)
  console.log(chalk.green(`Build completed.`))
}

function restorePublicMtimes(outputDir) {
  const publicDir = 'public'
  for (const relPath of fs.readdirSync(publicDir, { recursive: true })) {
    const srcPath = `${publicDir}/${relPath}`
    const destPath = `${outputDir}/${relPath}`
    if (!fs.statSync(srcPath).isFile() || !fs.existsSync(destPath)) continue

    const srcStat = fs.statSync(srcPath)
    const destStat = fs.statSync(destPath)
    const unchanged =
      srcStat.size === destStat.size &&
      fs.readFileSync(srcPath).equals(fs.readFileSync(destPath))
    if (unchanged) {
      fs.utimesSync(destPath, srcStat.atime, srcStat.mtime)
    }
  }
}

function removeDSStore(directory) {
  for (const file of fs.readdirSync(directory, { recursive: true })) {
    if (file.endsWith('.DS_Store')) {
      fs.rmSync(`${directory}/${file}`)
    }
  }
}

function copyHtaccessFile(outputDir) {
  console.log(chalk.cyan(`Copying .htaccess file...`))
  // Throw rather than exit, so the caller restores the config files
  fs.copyFileSync('htaccess/.htaccess.demo', `${outputDir}/.htaccess`)
  console.log(chalk.green(`.htaccess file copied successfully.`))
}

function deployToAFS(localDir, afsDir) {
  console.log(chalk.green('\nDeploying to AFS...'))
  execSync(
    `rsync -rltv --delete --exclude '.DS_Store' ${localDir}/ ${afsDir}/`,
    {
      stdio: 'inherit'
    }
  )
  console.log(chalk.green('Deployment to AFS successful.'))
}

async function prompt(question, defaultValue = '') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim() === '' ? defaultValue : answer.trim())
    })
  })
}

async function loginToAFS() {
  const username = await prompt(
    'Enter your AFS username (default: zjan@INF.ED.AC.UK): ',
    'zjan@INF.ED.AC.UK'
  )
  console.log(chalk.green(`Running kinit for ${username}...`))
  if (spawnSync('kinit', [username], { stdio: 'inherit' }).status !== 0) {
    console.error('kinit failed.')
    process.exit(1)
  }
  spawnSync('kswitch', ['-p', username], { stdio: 'inherit' })
  console.log(chalk.green('Running aklog...'))
  if (spawnSync('aklog', { stdio: 'inherit' }).status !== 0) {
    console.error('aklog failed.')
    process.exit(1)
  }
  console.log(chalk.green('AFS login successful.\n'))
}

function safeRestoreAndExit(code = 1) {
  if (!didRestore) {
    console.log(chalk.green(`Restoring configuration files before exiting...`))
    restoreFiles()
    didRestore = true
  }
  process.exit(code)
}

// === Main Execution ===
;(async () => {
  const argv = yargs(hideBin(process.argv))
    .option('deploy', { type: 'boolean', default: false })
    .parseSync()

  const shouldDeploy = argv.deploy

  // Always restore the config files if the script is interrupted or killed
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(signal, () => {
      console.error(chalk.yellow(`\nInterrupted (${signal}). Cleaning up...`))
      safeRestoreAndExit(1)
    })
  }

  process.on('uncaughtException', (err) => {
    console.error('\nUncaught Exception:', err)
    safeRestoreAndExit(1)
  })

  process.on('unhandledRejection', (reason) => {
    console.error('\nUnhandled Rejection:', reason)
    safeRestoreAndExit(1)
  })

  try {
    if (shouldDeploy) {
      await loginToAFS()
    }

    console.log(chalk.blueBright('Backing up configuration files...'))
    backupFiles()

    console.log(chalk.blueBright('Updating configuration for build...'))
    updateConfig(config.basePath)

    console.log(chalk.blueBright('Running build...'))
    buildProject(config.outputDir)

    console.log(chalk.blueBright('Copying .htaccess file...'))
    copyHtaccessFile(config.outputDir)

    console.log(chalk.blueBright('Restoring original configuration...'))
    restoreFiles()
    didRestore = true

    if (shouldDeploy) {
      console.log(chalk.blueBright('Deploying...'))
      deployToAFS(config.outputDir, config.afsDeployPath)
    }

    console.log(chalk.green('\nDemo build script completed successfully.'))
  } catch (error) {
    console.error(chalk.red('\nAn error occurred during the build process.'))
    console.error(error.message || error)
    safeRestoreAndExit(1)
  }
})()
