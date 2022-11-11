import { NextUIProvider } from '@nextui-org/react';
import Layout from 'components/layout';
import type { AppProps } from 'next/app';

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NextUIProvider>
    </QueryClientProvider>
  )
}

export default MyApp
