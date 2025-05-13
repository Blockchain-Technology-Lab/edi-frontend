const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const configs = [
  {
    basePath: "/blockchainlab/edi-dashboard",
    outputDir: "upload/groups"
  },
  { basePath: "/edi-dashboard", outputDir: "upload/blockchainlab" }
]

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

    // Ensure the output directory exists
    ensureDirectoryExists("upload")

    // Clean the specific output directory
    cleanDirectory(config.outputDir)

    // Run the build
    execSync(`yarn build`, { stdio: "inherit" })

    console.log(`Build completed for ${config.basePath}`)
  } catch (error) {
    console.error(`Build failed for basePath: ${config.basePath}`, error)
  }
}

// Main execution
try {
  // Backup original file contents
  backupFiles()

  // Run builds
  configs.forEach(build)

  console.log("All builds completed.")
} catch (error) {
  console.error("An error occurred:", error)
} finally {
  // Restore original file contents
  restoreFiles()
  console.log("Configuration files restored to original state.")
}
