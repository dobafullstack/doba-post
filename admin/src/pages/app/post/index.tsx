import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import Loading from '../../../components/Common/Loading';
import AddNewPostModal from '../../../components/Post/AddNewModel';
import ListItem from '../../../components/Post/ListItem';
import { addApolloState, initializeApollo } from '../../../graphql/apolloClient';
import { GetListPostDocument, Post, useGetListPostQuery } from '../../../graphql/generated/graphql';

const school = (): ReactElement => {
    const { data, loading, error } = useGetListPostQuery();
    const router = useRouter();

    if (error) router.push('/404');

    return (
        <>
            <AddNewPostModal />
            {loading ? (
                <Box w="100%" h="100%">
                    <Loading minH="100%" />
                </Box>
            ) : (
                <Box>
                    {data.getListPost.map((item) => (
                        <ListItem item={item as Post} key={item._id} loading={loading}/>
                    ))}
                </Box>
            )}
        </>
    );
};

export const getStaticProps = async () => {
    const apolloClient = initializeApollo();

    await apolloClient.query({
        query: GetListPostDocument,
    });

    return addApolloState(apolloClient, {
        props: {},
    });
};

export default school;
