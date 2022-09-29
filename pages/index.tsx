import type { NextPage } from 'next'
import Head from 'next/head'

import { Button, Link, Navbar, User } from "@nextui-org/react";
import NavbarLogin from 'components/navbar-login';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>GHA CI Grid</title>
        <meta name="description" content="Analysis executions of GitHub Actions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <Navbar isBordered variant="sticky">
          <Navbar.Content>
          </Navbar.Content>
          <NavbarLogin></NavbarLogin>
        </Navbar>
      </main>
    </div>
  )
}

export default Home
