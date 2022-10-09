import { Button, Col, Container, Input, Row, styled, Table, Text } from "@nextui-org/react"
import GithubUserClient from "components/github-oauth-client/github-user-client"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { useCookie } from "react-use"

const WorkflowSummary = () => {
    type Workflow = {
        id: number,
        name: string,
        html_url: string,
        created_at: string,
        path: string,
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
    const owner = router.query.owner as string
    const repo = router.query.repo as string

    const [token] = useCookie("token")
    const ghClient = new GithubUserClient(token!);
    const [loadingState, setLoadingState] = useState<'loading' | 'sorting' | 'loadingMore' | 'error' | 'idle' | 'filtering'>('loadingMore')
    const [workflows, setWorkflows] = useState<Array<Workflow>>([])
    const [workflowRunsStatistics, setWorkflowRunsStatistics] = useState(new Array<WorkflowRunStatistics>())

    useEffect(() => {
        if (owner && repo) {
            ghClient.listWorkflowsWithOwnerRepo(owner, repo).then(data => {
                setWorkflows(data.workflows)
            })
        }
    }, [owner, repo])

    useEffect(() => {
        const temp = new Array<WorkflowRunStatistics>()
        setLoadingState('loadingMore')
        Promise.all(workflows.map(
            workflow => {
                // 30 days ago
                const sevenDaysAgo = new Date()
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30)
                return ghClient.ListWorkflowRunsWithOwnerRepoWorkflowIDSince(owner, repo, workflow.id, sevenDaysAgo).then(
                    data => {
                        const all = data.length
                        const success = data.filter(item => item.conclusion === "success").length
                        const failure = data.filter(item => item.conclusion === "failure").length
                        const statistics: WorkflowRunStatistics = {
                            lastRun: data.reduce((acc, cur) => { if (cur.created_at && new Date(cur.created_at) > acc) return new Date(cur.created_at); return acc }, new Date(0)),
                            all: all,
                            success: success,
                            failure: failure,
                            flakeRate: failure / all,
                            ...workflow,
                        }
                        temp.push(statistics)
                    }
                )
            }
        )).then(() => {
            setWorkflowRunsStatistics(temp.sort((a, b) => {
                if (Number.isNaN(a.flakeRate)) {
                    return 1
                }
                if (Number.isNaN(b.flakeRate)) {
                    return -1
                }
                return b.flakeRate - a.flakeRate
            }));
            setLoadingState('idle')
        })
    }, [workflows])

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
