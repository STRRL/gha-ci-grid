import { Container, Row, Table } from "@nextui-org/react";
import GithubUserClient from "components/github-oauth-client/github-user-client";
import JobExecutions from "components/job-exections";
import JobsGrid, { WorkflowRun } from "components/jobs-grid";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookie } from "react-use";

const JobsSummary = () => {
    const router = useRouter();
    const owner = router.query.owner as string;
    const repo = router.query.repo as string;
    const workflowID = parseInt(router.query.workflowID as string);

    const [token] = useCookie("token");
    const [ghClient, setGhClient] = useState<GithubUserClient>();

    useEffect(() => {
        if (token) {
            setGhClient(new GithubUserClient(token));
        }
    }, [token]);

    const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([])

    useEffect(() => {
        const loadData = async () => {
            if (!ghClient) {
                return
            }
            const result: WorkflowRun[] = [];
            const workflowRuns = await ghClient.listWorkflowRunsForWorkflow(owner, repo, workflowID)
            for (const workflowRun of workflowRuns) {
                const jobRuns = await ghClient.listJobsWithWorkflowRun(owner, repo, workflowRun.id)
                result.push(
                    {
                        created_at: workflowRun.created_at,
                        head_commit: {
                            id: workflowRun.head_commit!.id
                        },
                        run_attempts: workflowRun.run_attempt!,
                        job_runs: jobRuns.map(item => {
                            return {
                                run_id: item.run_id,
                                run_attempt: item.run_attempt,
                                conclusion: item.conclusion!,
                                html_url: item.html_url!,
                                name: item.name,
                            }
                        })
                    }
                )
            }
            setWorkflowRuns(result)
        }
        if (owner && repo && workflowID) {
            loadData()
        }
    }, [owner, repo, workflowID])

    return (
        <>
            <Container>
                <JobsGrid
                    workflowRuns={workflowRuns}
                ></JobsGrid>
            </Container>
        </>
    )


}

export default JobsSummary;
