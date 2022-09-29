import { Button, Link, Navbar, User } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookie } from "react-use";
import GithubUserClient from "./github-oauth-client/github-user-client";

const NavbarLogin = () => {
    const [connected, setConnected] = useState(false)
    const [user, setUser] = useState({
        name: "",
        avatarUrl: "",
        login: "",
        link: ""
    })
    const [token, _, deleteToken] = useCookie("token")
    const router = useRouter()

    useEffect(() => {
        if (token) {
            setConnected(true);
            const ghClient = new GithubUserClient(token!)
            ghClient.getUser().then(data => {
                setUser({
                    name: data.name!,
                    avatarUrl: data.avatar_url,
                    login: data.login,
                    link: `https://github.com/${data.login}`
                })
            }).catch((e) => {
                if (e.status == 401) {
                    deleteToken()
                    router.push("/")
                }
            })
        } else {
            setConnected(false);
        }
    }, [token])

    if (connected) {
        return (
            <Navbar.Content>
                <Navbar.Item >
                    <Button auto flat
                        onClick={() => {
                            deleteToken()
                            router.reload()
                        }}
                    >
                        Disconnect from GitHub
                    </Button>
                </Navbar.Item>
                <Navbar.Item >
                    <User
                        name={user.name}
                        src={user.avatarUrl}
                    >
                        <User.Link href={user.link}>@{user.login}</User.Link>
                    </User>
                </Navbar.Item>
            </Navbar.Content >
        )
    } else {
        return (
            <Navbar.Content>
                <Navbar.Item >
                    <Button auto flat onClick={() => {
                        window.open("/api/gh/oauth-login", '_self')
                    }}>
                        Connet with GitHub
                    </Button>
                </Navbar.Item>
            </Navbar.Content>)

    }

}


export default NavbarLogin;