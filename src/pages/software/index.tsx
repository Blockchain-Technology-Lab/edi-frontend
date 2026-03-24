import {
  DoughnutTopCard,
  DistributionCard,
  LayerTopCard,
  MetricsCard,
  DoughnutCard,
  SystemSelector,
  RadioGroup
} from '@/components'
import { useSoftwareCsv } from '@/hooks'
import {
  DOUGHNUT_CARD,
  generateDoughnutPaths,
  getSoftwareCsvFileName,
  getSoftwareDoughnutCsvFileNames,
  SOFTWARE_CARD,
  SOFTWARE_CSV,
  SOFTWARE_DOUGHNUT_LEDGER_NAMES,
  SOFTWARE_METRICS,
  SOFTWARE_LEDGERS,
  getOrderedSystemsForLayer
} from '@/utils'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { softwareContributorRoute } from '@/router'
import { methodologySoftwareTo } from '@/routes/routePaths'

// Constants
const WEIGHT_ITEMS = [
  { label: 'Commits', value: 'commits' },
  { label: 'Merge commits', value: 'merge' },
  { label: 'Lines changed', value: 'lines' }
]

const ENTITY_ITEMS = [
  { label: 'Author', value: 'author' },
  { label: 'Committer', value: 'committer' }
]

const COMMITS_ITEMS = [
  { label: '100', value: '100' },
  { label: '250', value: '250' },
  { label: '500', value: '500' },
  { label: '1000', value: '1000' }
]

const DOUGHNUT_WEIGHT_ITEMS = [
  { label: 'Commits', value: 'commits' },
  { label: 'Merge commits', value: 'merge' },
  { label: 'Lines changed', value: 'lines' }
]

const DOUGHNUT_ENTITY_ITEMS = [
  { label: 'Author', value: 'author' },
  { label: 'Committer', value: 'committer' }
]

// Default selections
const DEFAULT_COMMITS_INDEX = 2 // "500"
const DEFAULT_ENTITY_INDEX = 0 // "Author"
const DEFAULT_WEIGHT_INDEX = 0 // "Commits"
const SYSTEMS_STORAGE_KEY = 'software_selectedSystems'
const DEFAULT_SOFTWARE_SYSTEMS = SOFTWARE_LEDGERS.map((l) => l.ledger)

function initialSelectedSystems(): Set<string> {
  try {
    const saved = localStorage.getItem(SYSTEMS_STORAGE_KEY)
    return saved
      ? new Set(JSON.parse(saved))
      : new Set(DEFAULT_SOFTWARE_SYSTEMS)
  } catch {
    return new Set(DEFAULT_SOFTWARE_SYSTEMS)
  }
}

function persistSelectedSystems(systems: Set<string>) {
  localStorage.setItem(SYSTEMS_STORAGE_KEY, JSON.stringify([...systems]))
}

// Custom hook for scroll-to-contributor functionality
function useContributorScroll() {
  const contributorRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/software/contributor') {
      // Double requestAnimationFrame ensures layout is painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          contributorRef.current?.scrollIntoView({ behavior: 'smooth' })
        })
      })
    }
  }, [location.pathname])

  const handleContributorScrollClick = () => {
    if (location.pathname === softwareContributorRoute.to) {
      // Double requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          contributorRef.current?.scrollIntoView({ behavior: 'smooth' })
        })
      })
    } else {
      navigate({ to: softwareContributorRoute.to })
    }
  }

  return { contributorRef, handleContributorScrollClick }
}

export function Software() {
  const [selectedCommits, setSelectedCommits] = useState(
    COMMITS_ITEMS[DEFAULT_COMMITS_INDEX]
  )
  const [selectedEntity, setSelectedEntity] = useState(
    ENTITY_ITEMS[DEFAULT_ENTITY_INDEX]
  )
  const [selectedWeight, setSelectedWeight] = useState(
    WEIGHT_ITEMS[DEFAULT_WEIGHT_INDEX]
  )
  const [selectedDoughnutEntity, setSelectedDoughnutEntity] = useState(
    DOUGHNUT_ENTITY_ITEMS[DEFAULT_ENTITY_INDEX]
  )
  const [selectedDoughnutWeight, setSelectedDoughnutWeight] = useState(
    DOUGHNUT_WEIGHT_ITEMS[DEFAULT_WEIGHT_INDEX]
  )

  const { contributorRef, handleContributorScrollClick } =
    useContributorScroll()

  const filename = useMemo(
    () =>
      getSoftwareCsvFileName(
        selectedWeight.value,
        selectedEntity.value,
        selectedCommits.value
      ),
    [selectedWeight, selectedEntity, selectedCommits]
  )

  const doughnutFilenames = useMemo(
    () =>
      getSoftwareDoughnutCsvFileNames(
        selectedDoughnutWeight.value,
        selectedDoughnutEntity.value
      ),
    [selectedDoughnutWeight, selectedDoughnutEntity]
  )

  const doughnutPaths = generateDoughnutPaths(doughnutFilenames)
  const csvPath = `${SOFTWARE_CSV + filename}`
  const { data, loading, error } = useSoftwareCsv(csvPath)

  // Extract unique systems from actual data and merge with constants
  const softwareSystems = useMemo((): string[] => {
    const orderedSystems = getOrderedSystemsForLayer(
      'software',
      data.map((d) => d.ledger)
    )
    const fallback = DEFAULT_SOFTWARE_SYSTEMS
    return orderedSystems.length > 0 ? orderedSystems : fallback
  }, [data])

  const [selectedSystems, setSelectedSystems] = useState<Set<string>>(
    initialSelectedSystems
  )

  const filteredData = useMemo(
    () =>
      data.filter(
        (entry) => !entry.ledger || selectedSystems.has(entry.ledger)
      ),
    [data, selectedSystems]
  )

  const handleSelectionChange = (selected: Set<string>) => {
    setSelectedSystems(selected)
    persistSelectedSystems(selected)
  }

  const handleSystemToggle = (system: string) => {
    const next = new Set(selectedSystems)
    next.has(system) ? next.delete(system) : next.add(system)
    setSelectedSystems(next)
    persistSelectedSystems(next)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* 3/4th - LayerTopCard */}
        <div className="lg:col-span-3">
          <LayerTopCard
            title="Software Layer"
            description={
              <>
                These graphs represent the historical decentralisation of
                software development for various blockchain implementations.
                Each metric value is calculated based on the distribution of
                some contribution type (e.g. number of commits or lines changed)
                across contributors over a sample of commits.
              </>
            }
            imageSrc={SOFTWARE_CARD}
            methodologyPath={methodologySoftwareTo}
            githubUrl="https://github.com/Blockchain-Technology-Lab/software-decentralization"
          />
        </div>

        {/* 1/4th - Doughnut Link Card */}
        <DistributionCard
          title="Contributor Distribution"
          imageSrc={DOUGHNUT_CARD}
          onClick={handleContributorScrollClick}
        />
      </div>

      <SystemSelector
        systems={softwareSystems}
        selectedSystems={selectedSystems}
        onSelectionChange={handleSelectionChange}
        label="Platforms"
      />

      <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 rounded-box">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4 h-full items-stretch">
            <div className="flex-1 h-full">
              <RadioGroup
                label="Contribution Type"
                items={WEIGHT_ITEMS}
                selectedItem={selectedWeight}
                onChange={setSelectedWeight}
                fullHeight={true}
                stacked={true}
              />
            </div>
            <div className="flex-1 h-full">
              <RadioGroup
                label="Contributor Type"
                items={ENTITY_ITEMS}
                selectedItem={selectedEntity}
                onChange={setSelectedEntity}
                fullHeight={true}
                stacked={true}
              />
            </div>
            <div className="flex-1 h-full">
              <RadioGroup
                label="Commits per Sample Window"
                items={COMMITS_ITEMS}
                selectedItem={selectedCommits}
                onChange={setSelectedCommits}
                fullHeight={true}
                stacked={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {!error &&
          SOFTWARE_METRICS.map((metric) => (
            <MetricsCard
              key={metric.metric}
              metric={metric}
              data={filteredData}
              loading={loading}
              type="software"
              timeUnit="month"
              selectedSystems={selectedSystems}
              onSystemToggle={handleSystemToggle}
            />
          ))}
      </div>
      <div ref={contributorRef}>
        <DoughnutTopCard
          title={'Contributor Distribution'}
          description={
            'These graphs represent the all-time distribution of contributors for various blockchain implementations.'
          }
          imageSrc={DOUGHNUT_CARD}
          methodologyPath={methodologySoftwareTo}
        />
      </div>

      <div className="card lg:card-side bg-base-200 shadow-lg border border-base-300 rounded-box">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-2 h-full">
            <div className="flex-1 h-full">
              <RadioGroup
                label="Contribution Type"
                items={DOUGHNUT_WEIGHT_ITEMS}
                selectedItem={selectedDoughnutWeight}
                onChange={setSelectedDoughnutWeight}
                fullHeight={true}
                stacked={true}
              />
            </div>
            <div className="flex-1">
              <RadioGroup
                label="Contributor Type"
                items={DOUGHNUT_ENTITY_ITEMS}
                selectedItem={selectedDoughnutEntity}
                onChange={setSelectedDoughnutEntity}
                fullHeight={true}
                stacked={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {SOFTWARE_DOUGHNUT_LEDGER_NAMES.map((repoItem) => (
          <DoughnutCard
            type={'software'}
            title={repoItem.name}
            key={repoItem.name}
            githubUrl={repoItem.url}
            path={doughnutPaths[repoItem.name]}
            fileName={repoItem.repo}
            showInfo={true}
          />
        ))}
      </div>
    </div>
  )
}
