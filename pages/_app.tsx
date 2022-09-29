import type { AppProps } from 'next/app'
import { NextUIProvider } from '@nextui-org/react';
import Layout from 'components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NextUIProvider>
  )
}

export default MyApp
