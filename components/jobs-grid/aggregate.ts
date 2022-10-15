import { Cell, Column, WorkflowRun } from ".";

export function fetchColumns(workflowRuns: WorkflowRun[]): Column[] {
    const temp: Map<Column, {}> = new Map();
    for (const run of workflowRuns) {
        const c: Column = {
            commit: run.head_commit.id,
            run_attempts: run.run_attempts,
            created_at: new Date(run.created_at)
        }
        temp.set(c, {});
    }
    return Array.from(temp.keys()).sort((a, b) => { return b.created_at.getTime() - a.created_at.getTime() });
}

export type ReducedDateColumn = {
    date: Date,
    span: number
}
export function columnDateReducer(columns: Column[]): ReducedDateColumn[] {
    return columns.reduce<ReducedDateColumn[]>((acc, curr, idx) => {
        if (idx === 0) {
            acc.push({
                date: curr.created_at,
                span: 1
            });
            return acc;
        }

        const last = acc[acc.length - 1];

        // is the same day 
        if (last.date.toDateString() === curr.created_at.toDateString()) {
            last.span++;
            return acc;
        }
        acc.push({
            date: curr.created_at,
            span: 1
        });
        return acc;
    }, []);
}

export type ReducedMinuteColumn = {
    minute: Date,
    span: number
}

export function columnMinuteReducer(columns: Column[]): ReducedMinuteColumn[] {
    return columns.reduce<ReducedMinuteColumn[]>((acc, curr, idx) => {
        if (idx === 0) {
            acc.push({
                minute: curr.created_at,
                span: 1
            });
            return acc;
        }
        const last = acc[acc.length - 1];
        // is the same minute
        if (
            last.minute.getFullYear() === curr.created_at.getFullYear() &&
            last.minute.getMonth() === curr.created_at.getMonth() &&
            last.minute.getDate() === curr.created_at.getDate() &&
            last.minute.getHours() === curr.created_at.getHours() &&
            last.minute.getMinutes() === curr.created_at.getMinutes()) {
            last.span++;
            return acc;
        }

        acc.push({
            minute: curr.created_at,
            span: 1
        });
        return acc;
    }, []);
}

export type ReducedCommitColumn = {
    commit: string,
    span: number
}
export function columnCommitReducer(columns: Column[]): ReducedCommitColumn[] {
    return columns.reduce<ReducedCommitColumn[]>((acc, curr, idx) => {
        if (idx === 0) {
            acc.push({
                commit: curr.commit,
                span: 1
            });
            return acc;
        }
        const last = acc[acc.length - 1];
        // is the same minute
        if (last.commit === curr.commit) {
            last.span++;
            return acc;
        }

        acc.push({
            commit: curr.commit,
            span: 1
        });
        return acc;
    }, []);
}

export function fetchRows(workflowRuns: WorkflowRun[]): string[] {
    const temp: Map<string, {}> = new Map();
    for (const workflowRun of workflowRuns) {
        for (const jobRun of workflowRun.job_runs) {
            temp.set(jobRun.name, {});
        }
    }
    return Array.from(temp.keys()).sort();
}

export function fetchCell(workflowRuns: WorkflowRun[], column: Column, row: string,): Cell | null {
    const workflowRun = workflowRuns.find((item) => {
        return new Date(item.created_at).getTime() === column.created_at.getTime() && item.head_commit.id === column.commit && item.run_attempts === column.run_attempts
    })
    if (workflowRun) {
        const jobRun = workflowRun.job_runs.find((item) => item.name === row);
        if (jobRun) {
            return {
                link: jobRun.html_url,
                conclusion: jobRun.conclusion
            }
        }
    }
    return null
}
