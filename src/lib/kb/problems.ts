// #4471 split into the problems it holds, counted the desk's way: every report under the cause of
// its tenant (causes.ts, as CauseTable counts), plus the reports the desk read as a one-day move
// (desk-notes.json → oneDayMove). Those stay counted where they are filed, so they appear twice.
import { groupByCause, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'shift';

export type ProblemGroup = {
  problem: Problem | 'unplaced';
  reports: number;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
};

function summary(problem: ProblemGroup['problem'], rs: Report[]): ProblemGroup {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    problem,
    reports: rs.length,
    tenants: new Set(rs.map((r) => r.tenant)).size,
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
  };
}

export function splitTicket(
  rows: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { rows: number; unique: number; groups: ProblemGroup[] } {
  const merged = uniqueById(rows).filter((r) => r.mergedInto === ticket);
  const shift = merged.filter((r) => oneDayMove.includes(r.id));
  return {
    rows: rows.filter((r) => r.mergedInto === ticket).length,
    unique: merged.length,
    groups: [
      ...groupByCause(merged, tenantOf).map((g) => summary(g.cause, g.reports)),
      ...(shift.length ? [summary('shift', shift)] : []),
    ],
  };
}
