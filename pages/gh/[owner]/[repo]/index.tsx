import { Col, Container, Row, Table, Text } from "@nextui-org/react"
import NavbarItem from "@nextui-org/react/types/navbar/navbar-item"
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

    type WorkflowRunStastics = {

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
    const [workflows, setWowkrlfows] = useState<Array<Workflow>>([])
    const [workflowRunsStatistics, setWorkflowRunsStatistics] = useState(new Array<WorkflowRunStastics>())

    useEffect(() => {
        if (owner && repo) {
            ghClient.listWorkflowsWithOwnerRepo(owner, repo).then(data => {
                setWowkrlfows(data.workflows)
            })
        }
    }, [owner, repo])

    useEffect(() => {
        const temp = new Array<WorkflowRunStastics>()
        workflows.forEach(workflow => {
            ghClient.listGiHubActionRunsWithOwnerRepoWorklfowID(owner, repo, workflow.id).then(
                data => {
                    setLoadingState('loadingMore')
                    const all = data.length
                    const success = data.filter(item => item.conclusion === "success").length
                    const failure = data.filter(item => item.conclusion === "failure").length
                    const statistics: WorkflowRunStastics = {
                        lastRun: data.reduce((acc, cur) => { if (cur.created_at && new Date(cur.created_at) > acc) return new Date(cur.created_at); return acc }, new Date(0)),
                        all: all,
                        success: success,
                        failure: failure,
                        flakeRate: failure / all,
                        ...workflow,
                    }
                    console.log(workflow.id, statistics)
                    temp.push(statistics)
                    setLoadingState('idle')
                }
            )
        })
        setWorkflowRunsStatistics(temp);
    }, [workflows])

    return (
        <>
            <Container>
                <Row>
                    <Text h1 span>
                        GitHub Actions Workflow Summary for {`${owner}/${repo}`}
                    </Text>
                </Row>
                <Row>
                    <Col>
                        <Table>
                            <Table.Header>
                                <Table.Column>Workflow Name</Table.Column>
                                <Table.Column>Latest Run At</Table.Column>
                                <Table.Column>Summary <Text span color="green">succeed</Text>/<Text span color="red">failed</Text>/<Text span >all</Text></Table.Column>
                                <Table.Column>Flake Rate</Table.Column>
                            </Table.Header>
                            <Table.Body items={workflowRunsStatistics.sort((a, b) => a.name.localeCompare(b.name))}
                                loadingState={loadingState}
                            >
                                {(item) => (
                                    <Table.Row key={item.id}>
                                        <Table.Cell>
                                            <Text>
                                                {item.name}
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
                                            <Text color={item.flakeRate > 0.10 ? "red" : "green"}>{(item.flakeRate * 100).toFixed(2)}%</Text>
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