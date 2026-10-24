const BUILD_WORKFLOWS = new Set([
  '.github/workflows/ci.yml',
  '.github/workflows/deploy-pages.yml',
])

function planArtifactDeletions(runs, artifacts) {
  const buildRuns = runs.filter((run) => BUILD_WORKFLOWS.has(run.path))
  const knownRuns = new Map(buildRuns.map((run) => [run.id, run]))
  const keep = new Set()

  for (const path of BUILD_WORKFLOWS) {
    const ordered = buildRuns
      .filter((run) => run.path === path)
      .sort(
        (a, b) =>
          Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id,
      )
    if (ordered.length > 0) keep.add(ordered[0].id)
    for (const run of ordered
      .filter((run) => run.conclusion === 'success')
      .slice(0, 2)) {
      keep.add(run.id)
    }
    for (const run of ordered.filter((run) => run.status !== 'completed')) {
      keep.add(run.id)
    }
  }

  return artifacts.filter((artifact) => {
    const runId = artifact.workflow_run?.id
    return knownRuns.has(runId) && !keep.has(runId) && !artifact.expired
  })
}

module.exports = { planArtifactDeletions }
