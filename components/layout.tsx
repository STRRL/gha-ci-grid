import { Navbar } from "@nextui-org/react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavbarLogin from "./navbar-login";

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
