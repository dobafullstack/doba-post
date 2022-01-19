import { Box, Button, Divider, Flex, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Loading from '../../../components/Common/Loading';
import UpdatePostModal from '../../../components/Post/EditModal';
import { Post, useGetPostQuery } from '../../../graphql/generated/graphql';
import formatDate from '../../../helpers/formatDate';

export default function DetailPost() {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { id } = router.query;
    const { data, loading } = useGetPostQuery({
        variables: { id: id as string },
    });

    if (loading) return <Loading />;

    return (
        <>
            <Box>
                <Heading as="h1">{data?.getPost?.title}</Heading>
                <Divider my={4}/>
                <Flex justify="space-between" mt={2} color="gray.400">
                    <Text>Posted by {data?.getPost?.user.username}</Text>
                    <Text>{formatDate(data?.getPost?.createdAt)}</Text>
                </Flex>
                <Text mt={5}>{data?.getPost?.content}</Text>    
            </Box>
            <Flex mt={5} gap={5} justify="flex-end">
                <Button bg="blue.500" _hover={{bg: 'blue.600'}} color="white" onClick={onOpen}>Edit</Button>
                <Button bg="green.500" _hover={{bg: 'green.600'}} color="white">Approve</Button>
            </Flex>
            <UpdatePostModal isOpen={isOpen} onClose={onClose} post={data.getPost as Post}/>
        </>
    );
}
