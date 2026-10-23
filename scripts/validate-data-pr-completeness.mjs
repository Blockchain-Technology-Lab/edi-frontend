#!/usr/bin/env node
/**
 * validate-data-pr-completeness.mjs
 *
 * Some public/output/ files are produced together by the same crawl, just
 * split across layer directories (e.g. a ledger's network and geography
 * data). This warns - it never fails the build - when a PR touches one
 * side of such a pair without the other, so the PR author can confirm
 * whether that's intentional before merging.
 *
 * Usage: node scripts/validate-data-pr-completeness.mjs [baseRef] [headRef]
 * Defaults to comparing origin/main against HEAD, for local runs.
 *
 * Writes a markdown report to data-completeness-report.md (empty if no
 * issues) for the calling workflow to post as a PR comment.
 */

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

function changedFiles(base, head) {
  const range = `${base}...${head}`
  const out = execSync(`git diff --name-only ${range}`, { encoding: 'utf8' })
  return out.split('\n').filter(Boolean)
}

// Builds the regex + filename-builder for one file in a layer, from a
// template like 'countries_{ledger}.csv'.
function pattern(dir, template) {
  const regexSource = `^public/output/${dir}/${template.replace('{ledger}', '(.+)')}$`
  return {
    regex: new RegExp(regexSource),
    build: (ledger) => `public/output/${dir}/${template.replace('{ledger}', ledger)}`
  }
}

// Each rule lists the layers that should move together for the same
// ledger. Add a new entry here (plus its patterns) to cover another pair.
const RULES = [
  {
    name: 'network + geography',
    layers: [
      {
        label: 'geography',
        patterns: [
          pattern('geography', 'countries_{ledger}.csv'),
          pattern('geography', 'output_countries_{ledger}.csv')
        ]
      },
      {
        label: 'network',
        patterns: [
          pattern('network', 'clustered_organizations_{ledger}.csv'),
          pattern('network', 'output_organizations_{ledger}.csv')
        ]
      }
    ]
  }
]

function findIncompleteLedgers(files, rule) {
  // ledger -> set of "layerLabel#patternIndex" keys touched by this PR
  const touched = new Map()

  for (const layer of rule.layers) {
    layer.patterns.forEach((p, patternIndex) => {
      for (const file of files) {
        const match = file.match(p.regex)
        if (!match) continue
        const ledger = match[1]
        if (!touched.has(ledger)) touched.set(ledger, new Set())
        touched.get(ledger).add(`${layer.label}#${patternIndex}`)
      }
    })
  }

  const incomplete = []
  for (const [ledger, keys] of touched) {
    const missing = []
    for (const layer of rule.layers) {
      layer.patterns.forEach((p, patternIndex) => {
        if (!keys.has(`${layer.label}#${patternIndex}`)) {
          missing.push(p.build(ledger))
        }
      })
    }
    if (missing.length > 0) incomplete.push({ ledger, missing })
  }

  return incomplete
}

function buildReport(findings) {
  if (findings.length === 0) return ''

  const lines = [
    '### ⚠️ Data completeness check',
    '',
    "This PR changes some, but not all, of the files that normally update together:",
    ''
  ]

  for (const { rule, ledger, missing } of findings) {
    lines.push(`- **${ledger}** (${rule}) - missing from this PR:`)
    for (const file of missing) lines.push(`  - \`${file}\``)
  }

  lines.push(
    '',
    "This is a warning only and doesn't block merging - ignore it if the partial update is intentional."
  )

  return lines.join('\n')
}

const [baseRefArg, headRefArg] = process.argv.slice(2)
const baseRef = baseRefArg ?? 'origin/main'
const headRef = headRefArg ?? 'HEAD'

const files = changedFiles(baseRef, headRef).filter((f) =>
  f.startsWith('public/output/')
)

const findings = RULES.flatMap((rule) =>
  findIncompleteLedgers(files, rule).map((f) => ({ rule: rule.name, ...f }))
)

const report = buildReport(findings)
writeFileSync('data-completeness-report.md', report)

if (report) {
  console.log(report)
} else {
  console.log('✓ No data completeness issues found.')
}

// Never fails the build - this check is informational only.
process.exit(0)
