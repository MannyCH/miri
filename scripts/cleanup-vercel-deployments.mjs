#!/usr/bin/env node
/**
 * Deletes old Vercel deployments, keeping:
 *   - The latest 3 production deployments (main branch)
 *   - The latest 1 deployment per active open PR branch
 *   - Any deployment marked as a rollback candidate
 *
 * Usage:
 *   VERCEL_TOKEN=xxx node scripts/cleanup-vercel-deployments.mjs [--dry-run]
 *
 * Get your token: https://vercel.com/account/tokens
 */

const TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = 'team_STGXqO2I0SpYOQHFaYMi0td9';
const PROJECT_ID = 'prj_OaDTkWItrMFXtIstmMj6ruSmh7KA';
const DRY_RUN = process.argv.includes('--dry-run');

const KEEP_PRODUCTION = 3;

if (!TOKEN) {
  console.error('Error: VERCEL_TOKEN env var is required.');
  console.error('Get one at: https://vercel.com/account/tokens');
  process.exit(1);
}

async function vercel(path, options = {}) {
  const url = `https://api.vercel.com${path}${path.includes('?') ? '&' : '?'}teamId=${TEAM_ID}`;
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vercel API ${res.status}: ${text}`);
  }
  return options.method === 'DELETE' ? null : res.json();
}

async function fetchAllDeployments() {
  const all = [];
  let until;
  while (true) {
    const qs = `projectId=${PROJECT_ID}&limit=100${until ? `&until=${until}` : ''}`;
    const data = await vercel(`/v6/deployments?${qs}`);
    all.push(...data.deployments);
    if (!data.pagination?.next || data.deployments.length === 0) break;
    until = data.pagination.next;
  }
  return all;
}

async function main() {
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no deletes)' : 'LIVE'}\n`);

  const deployments = await fetchAllDeployments();
  console.log(`Found ${deployments.length} total deployments`);

  const toKeep = new Set();

  const uid = d => d.uid ?? d.id;

  // Keep rollback candidates
  deployments.forEach(d => { if (d.isRollbackCandidate) toKeep.add(uid(d)); });

  // Keep latest N production deployments
  const production = deployments
    .filter(d => d.target === 'production' && d.state === 'READY')
    .sort((a, b) => b.created - a.created);
  production.slice(0, KEEP_PRODUCTION).forEach(d => toKeep.add(uid(d)));

  // Keep latest 1 per branch for non-production deployments
  const seenBranch = new Map();
  deployments
    .filter(d => d.state === 'READY')
    .sort((a, b) => b.created - a.created)
    .forEach(d => {
      const branch = d.meta?.githubCommitRef;
      if (branch && !seenBranch.has(branch)) {
        seenBranch.set(branch, uid(d));
        toKeep.add(uid(d));
      }
    });

  const toDelete = deployments.filter(d => !toKeep.has(uid(d)));

  console.log(`Keeping ${toKeep.size} deployments`);
  console.log(`Deleting ${toDelete.length} deployments\n`);

  if (toDelete.length === 0) {
    console.log('Nothing to delete.');
    return;
  }

  for (const d of toDelete) {
    const branch = d.meta?.githubCommitRef ?? '?';
    const msg = d.meta?.githubCommitMessage?.split('\n')[0] ?? '';
    const date = new Date(d.created).toISOString().slice(0, 10);
    console.log(`${DRY_RUN ? '[DRY]' : '[DEL]'} ${uid(d)} | ${date} | ${branch} | ${msg.slice(0, 60)}`);
    if (!DRY_RUN) {
      try {
        await vercel(`/v13/deployments/${uid(d)}`, { method: 'DELETE' });
        await new Promise(r => setTimeout(r, 400));
      } catch (err) {
        console.error(`  Failed: ${err.message}`);
      }
    }
  }

  console.log('\nDone.');
}

main().catch(err => { console.error(err); process.exit(1); });
