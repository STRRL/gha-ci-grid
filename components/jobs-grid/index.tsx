export type JobsGridProps = {
    rows: JobRows[] | null
}

export type JobRows = {
    name: string,
    children: JobRowsByDate[] | null
}

export type JobRowsByDate = {
    date: Date,
    children: JobRowsByMinutes[] | null
}

export type JobRowsByMinutes = {
    timeByMinutes: Date,
    children: JobRowsByCommit[] | null
}

export type JobRowsByCommit = {
    commit: string,
    children: JobRow[] | null
}
export type JobRow = {
    runAttempt: number,
    conclusion: 'success' | 'failure' | 'pending',
    link: string
}

const JobsGrid = ({ }: JobsGridProps) => {
    return (
        <div></div>
    )
}

export default JobsGrid;
