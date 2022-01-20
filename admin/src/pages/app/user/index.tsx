import { Box } from '@chakra-ui/react';
import React from 'react';
import Loading from '../../../components/Common/Loading';
import AddNewUser from '../../../components/User/AddNewModel';
import ListItem from '../../../components/User/ListItem';
import { useGetListUserQuery, User } from '../../../graphql/generated/graphql';

export default function index() {
    const { loading, data } = useGetListUserQuery();

    return (
        <>
            <AddNewUser />
            {loading ? (
                <Box w="100%" h="100%">
                    <Loading minH="100%" />
                </Box>
            ) : (
                <Box>
                    {data.getListUser.map((item) => (
                        <ListItem item={item as User} key={item._id} loading={loading} />
                    ))}
                </Box>
            )}
        </>
    );
}
