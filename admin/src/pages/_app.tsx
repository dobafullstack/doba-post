import { ApolloProvider } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/quicksand';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import React, { ReactElement, ReactNode } from 'react';
import { ToastProvider } from 'react-toast-notifications';
import '../assets/css/loading.css';
import { useApollo } from '../graphql/apolloClient';
import AppLayout from '../Layout/AppLayout';
import theme from '../theme';

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const client = useApollo(pageProps);
    const getLayout = Component.getLayout ?? ((page) => <AppLayout>{page}</AppLayout>);

    return (
        <ApolloProvider client={client}>
            <ChakraProvider resetCSS theme={theme}>
                {getLayout(
                    <ToastProvider autoDismiss autoDismissTimeout={6000} placement="bottom-left">
                        <Component {...pageProps} />
                    </ToastProvider>
                )}
            </ChakraProvider>
        </ApolloProvider>
    );
}

export default MyApp;
