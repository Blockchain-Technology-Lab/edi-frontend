import {
  DoughnutTopCard,
  LayerTopCard,
  MetricsCard,
  DoughnutCard,
  SystemSelector,
  RadioGroup
} from '@/components'
import {
  useContributorSectionNavigation,
  usePersistedSystemSelection,
  useSoftwareCsvAll
} from '@/hooks'
import {
  DOUGHNUT_CARD,
  generateDoughnutPaths,
  getSoftwareClientDoughnutCsvFileName,
  getSoftwareCsvFileName,
  getSoftwareDoughnutCsvFileNames,
  SOFTWARE_CLIENT_DOUGHNUT_LEDGERS,
  SOFTWARE_DOUGHNUT_LEDGER_NAMES,
  SOFTWARE_METRICS,
  SOFTWARE_LEDGERS,
  getOrderedSystemsForLayer
} from '@/utils'
import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { softwareClientRoute, softwareContributorRoute } from '@/router'
import { LAYER_CONFIG } from '@/config/layers'

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

export function Software() {
  const location = useLocation()
  const navigate = useNavigate()
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
    useContributorSectionNavigation({
      currentPath: location.pathname,
      contributorPath: softwareContributorRoute.to,
      navigateToContributor: () => navigate({ to: softwareContributorRoute.to })
    })

  const {
    contributorRef: clientRef,
    handleContributorScrollClick: handleClientScrollClick
  } = useContributorSectionNavigation({
    currentPath: location.pathname,
    contributorPath: softwareClientRoute.to,
    navigateToContributor: () => navigate({ to: softwareClientRoute.to })
  })

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
  const { data, loading, error } = useSoftwareCsvAll(filename)

  // Extract unique systems from actual data and merge with constants
  const softwareSystems = useMemo((): string[] => {
    const orderedSystems = getOrderedSystemsForLayer(
      'software',
      data.map((d) => d.ledger)
    )
    const fallback = DEFAULT_SOFTWARE_SYSTEMS
    return orderedSystems.length > 0 ? orderedSystems : fallback
  }, [data])

  const { selectedSystems, handleSelectionChange, handleSystemToggle } =
    usePersistedSystemSelection(SYSTEMS_STORAGE_KEY, DEFAULT_SOFTWARE_SYSTEMS)

  const filteredData = useMemo(
    () =>
      data.filter(
        (entry) => !entry.ledger || selectedSystems.has(entry.ledger)
      ),
    [data, selectedSystems]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* 3/4th - LayerTopCard */}
        <div className="lg:col-span-3">
          <LayerTopCard
            title="Software Layer"
            description={
              <>
                These graphs represent the historical decentralisation of software
                development for various blockchains. Metrics
                are calculated from the distribution of a chosen contribution
                type (e.g. number of commits or lines changed) across
                contributors, as identified by their GitHub or GitLab accounts.
                For blockchains with multiple independent clients,
                contributions are aggregated across all available clients (see Methodology for details).
              </>
            }
            imageSrc={LAYER_CONFIG.software.cardImage}
            methodologyPath={LAYER_CONFIG.software.methodologyPath}
            githubUrl={LAYER_CONFIG.software.github}
          />
        </div>

        {/* 1/4th - Doughnut Link Card */}
        <div className="card border border-base-300 shadow-sm bg-base-100 overflow-hidden h-full flex flex-col divide-y divide-base-300">
          <button
            type="button"
            onClick={handleContributorScrollClick}
            className="flex-1 min-h-0 p-4 text-left cursor-pointer group hover:bg-base-200/50 transition-colors duration-200 flex items-center justify-between gap-3"
          >
            <div>
              <h2 className="text-sm font-semibold text-base-content leading-tight">
                Contributor Distribution
              </h2>
              <p className="text-xs text-primary/70 mt-1 font-medium group-hover:text-primary transition-colors">
                View distribution ↓
              </p>
            </div>
            <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden">
              <img
                src={DOUGHNUT_CARD}
                alt=""
                className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-300"
              />
            </div>
          </button>
          <button
            type="button"
            onClick={handleClientScrollClick}
            className="flex-1 min-h-0 p-4 text-left cursor-pointer group hover:bg-base-200/50 transition-colors duration-200 flex items-center justify-between gap-3"
          >
            <div>
              <h2 className="text-sm font-semibold text-base-content leading-tight">
                Client Distribution
              </h2>
              <p className="text-xs text-primary/70 mt-1 font-medium group-hover:text-primary transition-colors">
                View distribution ↓
              </p>
            </div>
            <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden">
              <img
                src={DOUGHNUT_CARD}
                alt=""
                className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity duration-300"
              />
            </div>
          </button>
        </div>
      </div>

      <SystemSelector
        systems={softwareSystems}
        selectedSystems={selectedSystems}
        onSelectionChange={handleSelectionChange}
        label="Platforms"
        layer="software"
      />

      <div className="card border border-base-300 shadow-sm bg-base-100 overflow-hidden">
        <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
          <h3 className="text-sm font-semibold text-base-content">Options</h3>
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
            <div className="pb-5 border-b border-base-300 sm:pb-0 sm:border-b-0 sm:pr-6 sm:border-r sm:border-base-300">
              <RadioGroup
                label="Contribution Type"
                items={WEIGHT_ITEMS}
                selectedItem={selectedWeight}
                onChange={setSelectedWeight}
                stacked={true}
              />
            </div>
            <div className="pt-5 border-b border-base-300 sm:pt-0 sm:border-b-0 sm:px-6 sm:border-x sm:border-base-300">
              <RadioGroup
                label="Contributor Type"
                items={ENTITY_ITEMS}
                selectedItem={selectedEntity}
                onChange={setSelectedEntity}
                stacked={true}
              />
            </div>
            <div className="pt-5 sm:pt-0 sm:pl-6">
              <RadioGroup
                label="Commits per Sample Window"
                items={COMMITS_ITEMS}
                selectedItem={selectedCommits}
                onChange={setSelectedCommits}
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
          methodologyPath={LAYER_CONFIG.software.methodologyPath}
        >
          <div className="px-4 py-2.5 bg-base-200/50 border-b border-base-300">
            <h3 className="text-sm font-semibold text-base-content">Options</h3>
          </div>
          <div className="p-4 sm:p-5 flex-1">
            <div className="flex flex-col sm:flex-row gap-0">
              <div className="pb-5 border-b border-base-300 sm:pb-0 sm:border-b-0 sm:pr-6 sm:border-r sm:border-base-300">
                <RadioGroup
                  label="Contribution Type"
                  items={DOUGHNUT_WEIGHT_ITEMS}
                  selectedItem={selectedDoughnutWeight}
                  onChange={setSelectedDoughnutWeight}
                  stacked={true}
                />
              </div>
              <div className="pt-5 sm:pt-0 sm:pl-6">
                <RadioGroup
                  label="Contributor Type"
                  items={DOUGHNUT_ENTITY_ITEMS}
                  selectedItem={selectedDoughnutEntity}
                  onChange={setSelectedDoughnutEntity}
                  stacked={true}
                />
              </div>
            </div>
          </div>
        </DoughnutTopCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {SOFTWARE_DOUGHNUT_LEDGER_NAMES.map((repoItem) => (
          <DoughnutCard
            type={'software'}
            title={repoItem.name}
            key={repoItem.repo}
            path={doughnutPaths[repoItem.repo]}
            fileName={repoItem.repo}
            showInfo={true}
          />
        ))}
      </div>

      <div ref={clientRef}>
        <DoughnutTopCard
          title={'Client Distribution'}
          description={
            'These graphs represent the distribution of software client implementations used by nodes across various blockchain networks, based on the latest snapshot for each system.'
          }
          imageSrc={DOUGHNUT_CARD}
          methodologyPath={LAYER_CONFIG.software.methodologyPath}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {SOFTWARE_CLIENT_DOUGHNUT_LEDGERS.map((ledger) => (
          <DoughnutCard
            type={'software'}
            title={ledger.displayName}
            key={ledger.ledger}
            path={getSoftwareClientDoughnutCsvFileName(ledger.ledger)}
            fileName={ledger.ledger}
            othersThreshold={10}
          />
        ))}
      </div>
    </div>
  )
}
