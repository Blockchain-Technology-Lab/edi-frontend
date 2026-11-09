import fs from 'fs'
import { execSync, spawnSync } from 'child_process'
import readline from 'readline'
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// === CONFIG ===
const configs = [
  {
    basePath: '/blockchainlab/edi-dashboard',
    outputDir: 'upload/groups',
    htaccessFile: 'htaccess/.htaccess.groups',
    afsDeployPath:
      '/afs/inf.ed.ac.uk/group/project/blockchainlab/html/edi-dashboard'
  },
  {
    basePath: '/edi-dashboard',
    outputDir: 'upload/blockchainlab',
    htaccessFile: 'htaccess/.htaccess.btl',
    afsDeployPath:
      '/afs/inf.ed.ac.uk/group/project/blockchainlab/htmlblockchainlab/edi-dashboard'
  }
]

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
  let content = fs.readFileSync(filePath, 'utf8')
  for (const [regex, replacement] of replacements) {
    // Fail loudly if the code no longer matches, instead of building with the wrong config
    if (content.search(regex) === -1) {
      throw new Error(`Pattern ${regex} not found in ${filePath}`)
    }
    content = content.replace(regex, replacement)
  }
  fs.writeFileSync(filePath, content)
  console.log(chalk.green(`✔ Updated ${filePath}`))
}

function buildProject(outputDir) {
  console.log(chalk.cyan(`Building project into '${outputDir}'...`))
  ensureDirectoryExists('upload')
  cleanDirectory(outputDir)
  // Pass outDir explicitly so the build always lands where we clean and deploy from
  execSync(`npm run build -- --outDir ${outputDir}`, { stdio: 'inherit' })
  removeDSStore(outputDir)
  console.log(chalk.green(`Build completed for '${outputDir}'`))
}

function removeDSStore(directory) {
  for (const file of fs.readdirSync(directory, { recursive: true })) {
    if (file.endsWith('.DS_Store')) {
      fs.rmSync(`${directory}/${file}`)
    }
  }
}

function copyHtaccessFile(htaccessFile, outputDir) {
  console.log(
    chalk.cyan(`Copying ${htaccessFile} to ${outputDir}/.htaccess...`)
  )
  // Throw rather than exit, so the caller restores the config files
  fs.copyFileSync(htaccessFile, `${outputDir}/.htaccess`)
}

function deployToAFS(localDir, afsDir) {
  console.log(chalk.green(`\n Deploying ${localDir} to ${afsDir}...`))
  // The trailing "/" on localDir copies dotfiles (.htaccess) too.
  // -c compares file contents, not timestamps: every build gives all files a new
  // timestamp, so a time-based check would re-copy everything on each deploy.
  // --delete removes files no longer in the build (old hashed JS/CSS, renamed data),
  // so the AFS folder always matches the build exactly.
  execSync(
    `rsync -rlcv --delete --exclude '.DS_Store' ${localDir}/ ${afsDir}/`,
    {
      stdio: 'inherit'
    }
  )
  console.log(chalk.green(' Deployment to AFS successful.'))
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
    'Enter AFS username (default: zjan@INF.ED.AC.UK): ',
    'zjan@INF.ED.AC.UK'
  )
  console.log(chalk.green(` Running kinit for ${username}...`))
  if (spawnSync('kinit', [username], { stdio: 'inherit' }).status !== 0) {
    console.error(' kinit failed.')
    process.exit(1)
  }
  spawnSync('kswitch', ['-p', username], { stdio: 'inherit' })
  console.log(chalk.green(' Running aklog...'))
  if (spawnSync('aklog', { stdio: 'inherit' }).status !== 0) {
    console.error(' aklog failed.')
    process.exit(1)
  }
  console.log(chalk.green(' AFS login successful.\n'))
}

function safeRestoreAndExit(code = 1) {
  if (!didRestore) {
    console.log(chalk.yellow(' Restoring modified files...'))
    restoreFiles()
    didRestore = true
  }
  process.exit(code)
}

// === Main ===
;(async () => {
  const argv = yargs(hideBin(process.argv))
    .option('deploy', { type: 'boolean', default: false })
    .parseSync()

  const shouldDeploy = argv.deploy

  // Always restore the config files if the script is interrupted or killed
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(signal, () => {
      console.error(chalk.red(`\n Interrupted (${signal}).`))
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
    if (shouldDeploy) await loginToAFS()

    for (const config of configs) {
      console.log(chalk.blueBright('\n Backing up and preparing build...'))
      backupFiles()
      // Reset for each build, so a failure in the second build still restores the files
      didRestore = false

      updateConfig(config.basePath)
      buildProject(config.outputDir)
      copyHtaccessFile(config.htaccessFile, config.outputDir)

      console.log(chalk.blueBright(' Restoring original config...'))
      restoreFiles()
      didRestore = true

      if (shouldDeploy) {
        deployToAFS(config.outputDir, config.afsDeployPath)
      }
    }

    console.log(
      chalk.green('\n All builds and deployments completed successfully.')
    )
  } catch (err) {
    console.error(chalk.red('\n Build error occurred.'))
    console.error(err.message || err)
    safeRestoreAndExit(1)
  }
})()
