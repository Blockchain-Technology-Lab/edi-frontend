const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// === CONFIG ===
const config = {
  basePath: "/blockchainlab/demo",
  outputDir: "upload/demo"
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

    ensureDirectoryExists("output")
    cleanDirectory(config.outputDir)

    execSync(`yarn build`, { stdio: "inherit" })

    console.log(`Build completed for ${config.basePath}`)
  } catch (error) {
    console.error(` Build failed for basePath: ${config.basePath}`, error)
  }
}

// === Execution ===
try {
  backupFiles()
  build(config)
  console.log("Demo build completed.")
} catch (error) {
  console.error("An error occurred:", error)
} finally {
  restoreFiles()
  console.log("Configuration files restored to original state.")
}
