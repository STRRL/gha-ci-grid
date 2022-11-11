import { Container } from "@nextui-org/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import GithubUserClient from "components/github-oauth-client/github-user-client";
import JobsGrid from "components/jobs-grid";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useCookie } from "react-use";

const JobsSummary = () => {
    const router = useRouter();
    const owner = useMemo(() => router.query.owner as string, [router.query.owner]);
    const repo = useMemo(() => router.query.repo as string, [router.query.repo]);
    const workflowID = useMemo(() => parseInt(router.query.workflowID as string), [router.query.workflowID]);
    const [token] = useCookie("token");
    const ghClient = useMemo(() => new GithubUserClient(token!), [token]);

    const queryListWorkflowRunsForWorkflow = useQuery({
        refetchOnWindowFocus: false,
        queryKey: ["workflowRunsForWorkflow", { owner, repo, workflowID }],
        queryFn: () => ghClient.listWorkflowRunsForWorkflow(owner, repo, workflowID),
    })

    const queryListJobsWithWorkflowRun = useQueries({
        queries: (queryListWorkflowRunsForWorkflow.data || []).map((workflowRun) => {
            return {
                queryKey: ["jobsForWorkflowRun", { owner, repo, workflowRunID: workflowRun.id }],
                queryFn: () => {
                    return ghClient.listJobsWithWorkflowRun(owner, repo, workflowRun.id).then(jobRuns => {
                        return { workflowRun, jobRuns }
                    })
                },
                refetchOnWindowFocus: false,
            }
        }),
    });

    const workflowRuns = useMemo(() => {
       return queryListJobsWithWorkflowRun.filter(item => item.isFetched).map(item => item.data!).map(({ workflowRun, jobRuns }) => {
            return {
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
        })

    }, [queryListJobsWithWorkflowRun])

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
