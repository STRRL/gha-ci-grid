import style from './styles.module.css';
import moment from 'moment';
import { columnCommitReducer, columnDateReducer, columnMinuteReducer, fetchCell, fetchColumns, fetchRows, ReducedCommitColumn, ReducedDateColumn, ReducedMinuteColumn } from './aggregate';
import { useEffect, useState } from 'react';
export type JobsGridProps = {
    workflowRuns: WorkflowRun[] | null
}

export type WorkflowRun = {
    created_at: string,
    head_commit: {
        id: string
    },
    run_attempts: number,
    job_runs: JobRun[],
}

export type JobRun = {
    name: string,
    html_url: string,
    conclusion: string
}

export type Column = {
    created_at: Date,
    commit: string,
    run_attempts: number,
}
export type Cell = {
    link: string
    conclusion: string
}

const JobsGrid = ({ workflowRuns }: JobsGridProps) => {
    const [columns, setColumns] = useState<Column[]>([])
    const [rows, setRows] = useState<string[]>([])
    const [reducedDateColumns, setReducedDateColumns] = useState<ReducedDateColumn[]>([])
    const [reducedMinuteColumns, setReducedMinuteColumns] = useState<ReducedMinuteColumn[]>([])
    const [reducedCommitColumns, setReducedCommitColumns] = useState<ReducedCommitColumn[]>([])

    useEffect(() => {
        if (workflowRuns) {
            const rows = fetchRows(workflowRuns)
            const columns = fetchColumns(workflowRuns)
            const reducedDateColumns = columnDateReducer(columns)
            const reducedMinuteColumns = columnMinuteReducer(columns)
            const reducedCommitColumns = columnCommitReducer(columns)
            setColumns(columns)
            setRows(rows)
            setReducedDateColumns(reducedDateColumns)
            setReducedMinuteColumns(reducedMinuteColumns)
            setReducedCommitColumns(reducedCommitColumns)
        }
    }, [workflowRuns])

    return (
        <div style={{
            overflowX: "scroll",
        }}>
            <table>
                <tr>
                    <th rowSpan={3}
                        style={{
                            position: 'sticky'
                        }}
                    >Job Name</th>
                    {
                        reducedDateColumns.map((column, index) => {
                            return (
                                <th colSpan={column.span} key={index} className={[style['head-cell']].join(' ')}>
                                    {moment(column.date).format('YYYY-MM-DD')}
                                </th>
                            )
                        })
                    }
                </tr>
                <tr>
                    {
                        reducedMinuteColumns.map((column, index) => {
                            return (
                                <th colSpan={column.span} key={index} className={[style['head-cell']].join(' ')}>
                                    {moment(column.minute).format('HH:mm')}
                                </th>
                            )
                        })
                    }
                </tr>
                <tr>
                    {
                        reducedCommitColumns.map((column, index) => {
                            return (
                                <th colSpan={column.span} key={index} className={[style['head-cell']].join(' ')}>
                                    {column.commit.substring(0, 8)}
                                </th>
                            )
                        })
                    }
                </tr>
                <tbody>
                    {
                        rows.map((row, index) => {
                            return (
                                <tr key={index}>
                                    <td style={{
                                        width: 'auto',
                                        whiteSpace: 'nowrap',
                                    }}
                                    >
                                        {row}
                                    </td>
                                    {
                                        columns.map((column, index) => {
                                            const cell = fetchCell(workflowRuns || [], column, row);
                                            if (cell) {
                                                return (
                                                    <td key={index}>
                                                        <div className={[style.cell, style[`execution-${cell.conclusion}`]].join(' ')}>
                                                            <a href={cell.link} target='_blank' rel="noreferrer">{cell.conclusion}</a>
                                                        </div>
                                                    </td>
                                                )
                                            } else {
                                                return (
                                                    <td key={index}>
                                                        <div className={[style.cell, style[`execution-null`]].join(' ')}>
                                                        </div>
                                                    </td>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div >
    )
}

export default JobsGrid;
