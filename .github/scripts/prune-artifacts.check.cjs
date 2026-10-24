const { test } = require('node:test')
const assert = require('node:assert/strict')
const { planArtifactDeletions } = require('./prune-artifacts.cjs')

const ci = '.github/workflows/ci.yml'
const pages = '.github/workflows/deploy-pages.yml'
const run = (id, path, conclusion, created_at, status = 'completed') => ({
  id,
  path,
  conclusion,
  created_at,
  status,
})
const artifact = (id, runId) => ({
  id,
  name: `artifact-${id}`,
  workflow_run: { id: runId },
})

test('keeps two newest successes and the latest failed run per workflow', () => {
  const runs = [
    run(1, ci, 'success', '2026-10-20T10:00:00Z'),
    run(2, ci, 'failure', '2026-10-21T10:00:00Z'),
    run(3, ci, 'success', '2026-10-22T10:00:00Z'),
    run(4, ci, 'success', '2026-10-23T10:00:00Z'),
    run(5, ci, 'failure', '2026-10-24T10:00:00Z'),
    run(6, pages, 'success', '2026-10-22T11:00:00Z'),
    run(7, pages, 'success', '2026-10-23T11:00:00Z'),
    run(8, pages, 'success', '2026-10-24T11:00:00Z'),
  ]
  const artifacts = runs.map((value) => artifact(value.id + 100, value.id))
  assert.deepEqual(
    planArtifactDeletions(runs, artifacts)
      .map((value) => value.id)
      .sort((a, b) => a - b),
    [101, 102, 106],
  )
})

test('keeps the latest successful run without preserving a third success', () => {
  const runs = [
    run(1, ci, 'success', '2026-10-20T10:00:00Z'),
    run(2, ci, 'success', '2026-10-21T10:00:00Z'),
    run(3, ci, 'success', '2026-10-22T10:00:00Z'),
  ]
  assert.deepEqual(
    planArtifactDeletions(
      runs,
      runs.map((value) => artifact(value.id, value.id)),
    ).map((value) => value.id),
    [1],
  )
})

test('never deletes active, unrelated, or unlinked artifacts', () => {
  const runs = [
    run(1, ci, 'failure', '2026-10-20T10:00:00Z'),
    run(2, ci, 'success', '2026-10-21T10:00:00Z'),
    run(3, ci, 'success', '2026-10-22T10:00:00Z'),
    run(4, ci, null, '2026-10-23T10:00:00Z', 'in_progress'),
    run(5, ci, 'failure', '2026-10-24T10:00:00Z'),
    run(6, '.github/workflows/security.yml', 'failure', '2026-10-20T10:00:00Z'),
  ]
  const artifacts = runs.map((value) => artifact(value.id, value.id))
  artifacts.push({ id: 7, name: 'unlinked', workflow_run: null })
  artifacts.push(artifact(8, 999))
  assert.deepEqual(
    planArtifactDeletions(runs, artifacts).map((value) => value.id),
    [1],
  )
})
