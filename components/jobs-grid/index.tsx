import style from './styles.module.css';
import moment from 'moment';
export type JobsGridProps = {
    rows: JobRow[] | null
    columns: JobColumnsByDates[] | null
}

export type JobRow = {
    name: string,
    id?: string,
    link?: string,
    executions?: JobExecution[]
}

export type JobExecution = {
    id: string,
    runAttempt: number,
    conclusion: 'success' | 'failure' | 'pending',
    link: string
}

export type JobColumnsByDates = {
    date: Date,
    children: ByMinutes[] | null
}

export type ByMinutes = {
    timeByMinutes: Date,
    children: ByCommit[] | null
}

export type ByCommit = {
    commit: string,
}


const JobsGrid = ({ rows, columns }: JobsGridProps) => {
    return (
        <div
            className={style['content-box']}
        >
            <div
                className={style['left-part']}
            >
                <div
                    className={style['top-row']}
                >
                </div>
                <div>
                    {rows?.map((row, index) => (
                        <div key={`row-name-index-${index}`} className={style['job-name']}>
                            {row.name}
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={style['right-part']}
            >
                <div
                    className={style['top-row']}
                >
                    <div className={style['table-header']}>
                        {columns?.map((column, index) => (
                            <div key={`column-day-${index}`} >
                                <div className={style['text-center']}>
                                    {(moment(column.date)).format('YYYY-MM-DD')}
                                </div>
                                <div>
                                    {column.children?.map((column_by_min, index) => (
                                        <div key={`column-minutes-${index}`}>
                                            <div className={style['text-center']}>
                                                {(moment(column_by_min.timeByMinutes)).format('HH:mm')}
                                            </div>
                                            <div className={style['execution-container']}>
                                                {column_by_min.children?.map((column_by_commit, index) => (
                                                    <div key={`column-commit-${index}`} className={style.cell}>
                                                        {column_by_commit.commit}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    {rows?.map((row, index) => (
                        <div key={`row-content-index-${index}`} >
                            <div className={style['execution-container']}>
                                {row.executions?.map((execution, index) => (
                                    <div key={`row-execution-index-${index}`}
                                        className={[style.cell, style['execution-' + (execution ? execution.conclusion : 'null')]].join(' ')}
                                    >
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default JobsGrid;
