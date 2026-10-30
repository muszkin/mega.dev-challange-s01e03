<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitTicket, type Problem } from '#lib/kb/problems';

  // issues: where each problem is tracked now.
  let { ticket, issues }: { ticket: number; issues: Record<Problem, string> } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
  const shift = $derived(split.groups.find((g) => g.problem === 'shift')?.reports ?? 0);
</script>

<p class="sum">
  <strong>{split.unique}</strong> reports in #{ticket} ({split.rows} export rows, {split.rows - split.unique} duplicates) ·
  <strong>{split.groups.length}</strong> problems
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>GitHub issue</th></tr>
  </thead>
  <tbody>
    {#each split.groups as g (g.problem)}
      <tr class:unplaced={g.problem === 'unplaced'}>
        <td><code>{g.problem}</code></td>
        <td>{g.reports}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if g.problem === 'unplaced'}no tenant on file — read these by hand{:else}<a href={issues[g.problem]}>{issues[g.problem].replace(/^.*\/issues\//, 'issue ')}</a>{/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if shift}
  <p class="note">The {shift} <code>shift</code> reports are also counted under their tenant's cause, where the desk files them.</p>
{/if}

<style>
  .sum { font-size: 1.1rem; }
  .unplaced td { background: var(--warn-bg); color: var(--warn); }
  .note { color: var(--muted); font-size: 0.85em; }
</style>
