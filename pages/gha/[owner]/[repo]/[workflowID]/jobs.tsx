import { Container, Row, Table } from "@nextui-org/react";
import GithubUserClient from "components/github-oauth-client/github-user-client";
import JobExecutions from "components/job-exections";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookie } from "react-use";

const JobsSummary = () => {
    const router = useRouter();
    const owner = router.query.owner as string;
    const repo = router.query.repo as string;
    const workflowID = parseInt(router.query.workflowID as string);

    const [token] = useCookie("token");
    const ghClient = new GithubUserClient(token!);

    type JobRun = {
        run_attempt?: number,
        conclusion: string | null,
    }
    // key is job name, value is execution historyies
    const [jobs, setJobs] = useState(new Map<string, Array<JobRun>>())

    useEffect(() => {

        const loadData = async () => {
            const newJobs = new Map<string, Array<JobRun>>()
            const workflowRuns = await ghClient.listWorkflowRunsForWorkflow(owner, repo, workflowID)
            for (const workflowRun of workflowRuns) {
                const jobsForWorkflowRun = await ghClient.listJobsWithWorkflowRun(owner, repo, workflowRun.id)
                for (const job of jobsForWorkflowRun) {
                    const jobName = job.name
                    const jobHistory = newJobs.get(jobName)
                    if (jobHistory) {
                        jobHistory.push(job)
                    } else {
                        newJobs.set(jobName, [job])
                    }
                }
            }
            setJobs(newJobs)
        }
        if (owner && repo && workflowID) {
            loadData()
        }
    }, [owner, repo, workflowID])

    return (
        <>
            <Container>
                    <Table>
                        <Table.Header>
                            <Table.Column>Job Name</Table.Column>
                            <Table.Column>Executions</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {
                                Array.from(jobs.entries()).map(([jobName, jobHistory]) => {
                                    return (
                                        <Table.Row>
                                            <Table.Cell>{jobName}</Table.Cell>
                                            <Table.Cell>
                                                <JobExecutions
                                                    exectuions={jobHistory}
                                                ></JobExecutions>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table>
            </Container>

            {owner}/{repo} {workflowID}
        </>
    )


}

export default JobsSummary;