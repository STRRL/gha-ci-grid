import { Navbar } from "@nextui-org/react"
import NavbarLogin from "./navbar-login"
import Head from 'next/head';
import { useCookie } from "react-use";
import { useEffect } from "react";
import { useRouter } from 'next/router'

const Layout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>GHA CI Grid</title>
                <meta name="description" content="Analysis executions of GitHub Actions" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar isBordered variant="sticky">
                <Navbar.Content>
                </Navbar.Content>
                <NavbarLogin></NavbarLogin>
            </Navbar>
            <main>
                {children}
            </main>
        </>
    )
}

export default Layout