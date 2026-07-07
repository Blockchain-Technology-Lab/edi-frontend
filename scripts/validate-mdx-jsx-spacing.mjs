#!/usr/bin/env node
/**
 * validate-mdx-jsx-spacing.mjs
 *
 * Prevents fragile JSX whitespace patterns in MDX, specifically:
 *   </Tag>{' '}
 *
 * That pattern is often auto-inserted by formatters and leads to noisy diffs.
 * We enforce a project rule to avoid it repo-wide.
 */

import { readdirSync, statSync, readFileSync } from 'fs'
import { resolve, join, relative, dirname } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = join(ROOT, 'src')

function collectMdxFiles(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      out.push(...collectMdxFiles(full))
      continue
    }
    if (name.endsWith('.mdx')) out.push(full)
  }
  return out
}

function getLineFromIndex(content, index) {
  let line = 1
  for (let i = 0; i < index; i++) {
    if (content.charCodeAt(i) === 10) line++
  }
  return line
}

const files = collectMdxFiles(SRC_DIR)
const offenderRegex = /<\/([A-Za-z][\w:-]*)>\s*\{\s*' '\s*\}/g
const violations = []

for (const filePath of files) {
  const content = readFileSync(filePath, 'utf8')
  let match
  while ((match = offenderRegex.exec(content)) !== null) {
    const line = getLineFromIndex(content, match.index)
    violations.push({
      file: relative(ROOT, filePath),
      line,
      snippet: match[0]
    })
  }
}

if (violations.length > 0) {
  console.log(chalk.red.bold(`\n✗ MDX JSX whitespace check failed (${violations.length} issue(s))\n`))
  for (const v of violations) {
    console.log(chalk.red(`- ${v.file}:${v.line}`))
    console.log(chalk.red(`  Found: ${v.snippet}`))
  }

  console.log(
    chalk.yellow(
      '\nRule: avoid explicit JSX spaces in MDX like </Tag>{\' \'}. ' +
      'Prefer inline punctuation/text or a non-breaking space if needed.'
    )
  )
  process.exit(1)
}

console.log(chalk.green(`✓ MDX JSX whitespace check passed (${files.length} file(s) scanned)`))
