import { Button, Container, Input, Row, Spacer, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookie, useStartTyping } from "react-use";

const Welcome = () => {
    const placeholderConnectWithGithub = "Please Connect with GitHub"
    const placeholderExample = "STRRL/chaos-mesh.dev or https://github.com/STRRL/chaos-mesh.dev"

    const [token,] = useCookie("token")
    const [disabled, setDisabled] = useState(true)
    const [project, setProject] = useState("")

    useEffect(() => {
        if (token) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [token])

    const router = useRouter()


    const parseProject = (project: string) => {
        const repo = project.replace("https://github.com/", "")
        const [owner, repoName] = repo.split("/")
        return {
            owner,
            repo: repoName
        }
    }

    const redirectToProject = () => {
        if (project === "") {
            router.push("/gh/STRRL/chaos-mesh.dev")
            return
        }
        const { owner, repo } = parseProject(project)
        router.push(`/gh/${owner}/${repo}`)
    }

    return (
        <Container>
            <Row
                justify="center"
                align="center"
                style={{
                    minHeight: '650px'
                }}
            >
                <Input
                    bordered
                    size="xl"
                    style={{
                        display: "flex",
                        width: "100%",
                        minWidth: "900px"
                    }}
                    value={project}
                    onChange={e => { setProject(e.target.value) }}
                    onKeyDown={
                        e => {
                            if (e.key === "Enter") {
                                redirectToProject()
                            }
                        }
                    }
                    disabled={disabled}
                    placeholder={disabled ? placeholderConnectWithGithub : placeholderExample}
                    contentRightStyling={false}
                    contentRight={
                        <Button
                            disabled={disabled}
                            onClick={redirectToProject}
                            style={{
                                marginRight: '10px'
                            }}>Analysis GitHub Actions</Button>
                    }
                >
                </Input>
            </Row>
        </Container>
    )
}

export default Welcome
