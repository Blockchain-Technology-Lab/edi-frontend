const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const configs = [
  {
    basePath: "/blockchainlab/edi-dashboard",
    outputDir: "dist/groups"
  },
  { basePath: "/edi-dashboard", outputDir: "dist/blockchainlab" }
]

const FILES_TO_MODIFY = ["next.config.mjs", "src/utils/paths.ts"]

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
  let nextConfig = fs.readFileSync("next.config.mjs", "utf8")
  nextConfig = nextConfig.replace(
    /basePath:\s*["'].*?["']/g,
    `basePath: "${basePath}"`
  )
  nextConfig = nextConfig.replace(
    /distDir:\s*["'].*?["']/g,
    `distDir: "${outputDir}"`
  )
  fs.writeFileSync("next.config.mjs", nextConfig)

  // Update src/utils/paths.ts
  let pathsConfig = fs.readFileSync("src/utils/paths.ts", "utf8")
  pathsConfig = pathsConfig.replace(
    /basePath\s*=\s*["'].*?["']/g,
    `basePath = "${basePath}"`
  )
  fs.writeFileSync("src/utils/paths.ts", pathsConfig)
}

function build(config) {
  console.log(`Building for basePath: ${config.basePath}`)
  updateConfig(config.basePath, config.outputDir)

  // Ensure the output directory exists
  ensureDirectoryExists("output")

  // Clean the specific output directory
  cleanDirectory(config.outputDir)

  // Run the build
  execSync(`yarn build`, { stdio: "inherit" })

  console.log(`Build completed for ${config.basePath}`)
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
