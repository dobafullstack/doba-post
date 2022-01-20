import {
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    Text,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import Loading from '../../../components/Common/Loading';
import UpdatePostModal from '../../../components/Post/EditModal';
import {
    GetListPostDocument,
    GetListPostQuery,
    Post,
    useGetPostQuery,
    useUpdatePostMutation
} from '../../../graphql/generated/graphql';
import formatDate from '../../../helpers/formatDate';

export default function DetailPost() {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [updatePost, { loading: updatePostLoading }] = useUpdatePostMutation();
    const { id } = router.query;
    const { data, loading } = useGetPostQuery({
        variables: { id: id as string },
    });
    const toast = useToast();

    const onApprove = async () => {
        try {
            const response = await updatePost({
                variables: { updatePostInput: { id: id as string, active: true } },
                update(cache, { data }) {
                    const posts = cache.readQuery<GetListPostQuery>({
                        query: GetListPostDocument,
                    });

                    const index = posts?.getListPost.findIndex((p) => p._id === id);

                    if (index && index > -1) {
                        const newPosts = posts?.getListPost.map((p, i) => {
                            if (i === index) {
                                return data?.updatePost.post;
                            }
                            return p;
                        });

                        cache.writeQuery<GetListPostQuery>({
                            query: GetListPostDocument,
                            data: { getListPost: newPosts as Post[] },
                        });
                    }
                },
            });

            if (response.data?.updatePost.success) {
                toast({
                    title: 'Update Post',
                    description: response.data.updatePost.message,
                    status: 'success',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Update Post',
                    description: response.data?.updatePost.message,
                    status: 'error',
                    isClosable: true,
                });
            }
        } catch (error: any) {
            toast({
                title: 'Update Post',
                description: error.message,
                status: 'error',
                isClosable: true,
            });
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <Box>
                <Heading as="h1">{data?.getPost?.title}</Heading>
                <Divider my={4} />
                <Flex justify="space-between" mt={2} color="gray.400">
                    <Text>Posted by {data?.getPost?.user.username}</Text>
                    <Text>{formatDate(data?.getPost?.createdAt)}</Text>
                </Flex>
                <Text mt={5}>{data?.getPost?.content}</Text>
            </Box>
            <Flex mt={5} gap={5} justify="flex-end">
                <Button bg="blue.500" _hover={{ bg: 'blue.600' }} color="white" onClick={onOpen}>
                    Edit
                </Button>
                {!data.getPost.active && <Button
                    bg="green.500"
                    _hover={{ bg: 'green.600' }}
                    color="white"
                    isLoading={updatePostLoading}
                    onClick={() => onApprove()}
                >
                    Approve
                </Button>}
            </Flex>
            <UpdatePostModal isOpen={isOpen} onClose={onClose} post={data.getPost as Post} />
        </>
    );
}
