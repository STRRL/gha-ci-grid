import { Button, Col, Container, Input, Row, styled, Table, Text } from "@nextui-org/react"
import { useQueries, useQuery } from "@tanstack/react-query"
import GithubUserClient from "components/github-oauth-client/github-user-client"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import { useCookie } from "react-use"

const WorkflowSummary = () => {
    type Workflow = {
        id: number,
        name: string,
        html_url: string,
        created_at: string,
        path: string,
        node_id: string,
    }

    type WorkflowRun = {
        id: number,
        conclusion: string | null,
        created_at: string | null,
    }

    type WorkflowRunStatistics = {
        lastRun: Date,
        all: number,
        success: number,
        failure: number,
        flakeRate: number,
    } & Workflow

    const router = useRouter()
    const owner = useMemo(() => router.query.owner as string, [router.query.owner])
    const repo = useMemo(() => router.query.repo as string, [router.query.repo])

    console.log(owner, repo)
    const [token] = useCookie("token")
    const ghClient = useMemo(() => new GithubUserClient(token!), [token])

    const queryListWorkflowsWithOwnerRepo = useQuery({
        queryKey: ["workflowsForRepo", { owner, repo }],
        queryFn: () => ghClient.listWorkflowsWithOwnerRepo(owner, repo),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        console.log(queryListWorkflowsWithOwnerRepo.data)
    }, [queryListWorkflowsWithOwnerRepo.data])

    const thirtyDaysAgo = useMemo(() => {
        const d = new Date()
        d.setDate(d.getDate() - 30)
        return d
    }, [])

    const queryListWorkflowRunsWithOwnerRepoWorkflowIDSince = useQueries({
        queries: (queryListWorkflowsWithOwnerRepo.data?.workflows || []).map((workflow: Workflow) => {
            return {
                queryKey: ["listWorkflowRunsWithOwnerRepoWorkflowIDSince", owner, repo, workflow.id, thirtyDaysAgo],
                queryFn: () => {
                    return ghClient.listWorkflowRunsWithOwnerRepoWorkflowIDSince(owner, repo, workflow.id, thirtyDaysAgo).then(response => {
                        return {
                            workflow: workflow,
                            response: response
                        }
                    }
                    )
                },
                refetchOnWindowFocus: false
            }
        })
    })

    const workflowRunsStatistics = useMemo<Array<WorkflowRunStatistics>>(() => {
        const summaries = queryListWorkflowRunsWithOwnerRepoWorkflowIDSince.map(it => it.data).map(
            it => {
                const all = it?.response.length || 0
                const success = it?.response.filter((run: WorkflowRun) => run.conclusion === "success").length || 0
                const failure = it?.response.filter((run: WorkflowRun) => run.conclusion === "failure").length || 0

                const result: WorkflowRunStatistics | null = it ? {
                    lastRun: it?.response.reduce((acc, cur) => { if (cur.created_at && new Date(cur.created_at) > acc) return new Date(cur.created_at); return acc }, new Date(0)),
                    all: all,
                    success: success,
                    failure: failure,
                    flakeRate: failure / all,
                    ...it?.workflow
                } : null
                return result
            }
        ).filter(it => it !== null) as Array<WorkflowRunStatistics>

        const sorted = summaries.sort((a, b) => {
            if (Number.isNaN(a.flakeRate)) {
                return 1
            }
            if (Number.isNaN(b.flakeRate)) {
                return -1
            }
            return b.flakeRate - a.flakeRate
        })
        console.log(sorted)
        return sorted
    }, [queryListWorkflowRunsWithOwnerRepoWorkflowIDSince])

    const loadingState = useMemo(() => {
        return queryListWorkflowRunsWithOwnerRepoWorkflowIDSince.map(item => item.isFetched).every(it => it) ? "idle" : "loading"
    }, [queryListWorkflowRunsWithOwnerRepoWorkflowIDSince])

    return (
        <>
            <Container>
                <Row>
                    <Text h1 span>
                        GitHub Actions Workflow Summary for {`${owner}/${repo}`}
                    </Text>
                </Row>
                <Row style={{ minHeight: '120px' }}>
                    <Col>
                        <Table style={{
                            display: "flex",
                        }}>
                            <Table.Header>
                                <Table.Column>Workflow Name</Table.Column>
                                <Table.Column>Latest Run At</Table.Column>
                                <Table.Column>Summary (30 Days) <Text span color="green">succeed</Text>/<Text span color="red">failed</Text>/<Text span >all</Text></Table.Column>
                                <Table.Column>Flake Rate</Table.Column>
                            </Table.Header>
                            <Table.Body
                                css={{
                                    minHeight: "300px",
                                }}
                                items={workflowRunsStatistics}
                                loadingState={loadingState}
                            >
                                {(item) => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>
                                            <Text>
                                                <Link href={`/gha/${owner}/${repo}/${item.id}/jobs`}>{item.name}</Link>
                                            </Text>
                                            <Text >
                                                <Link href={item.html_url.replace("blob/master/.github", "actions")}>{item.path}</Link>
                                            </Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {item.lastRun.toLocaleString()}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text span color="green">{item.success}</Text>/<Text span color="red">{item.failure}</Text>/<Text span >{item.all}</Text>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Text color={Number.isNaN(item.flakeRate) ? "black" : item.flakeRate > 0.10 ? "red" : "green"}>{Number.isNaN(item.flakeRate) ? "-" : `${(item.flakeRate * 100).toFixed(2)}%`}</Text>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </Col>
                </Row>
                <Row>
                </Row>
            </Container>
        </>
    )
}

export default WorkflowSummary
