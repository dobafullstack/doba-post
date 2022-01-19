import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
} from '@chakra-ui/react';
import React from 'react';
import {
    GetListPostDocument,
    GetListPostQuery,
    Post,
    useDeletePostMutation,
} from '../../graphql/generated/graphql';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPostId: string;
}

export default function DeletePostModal({ isOpen, onClose, selectedPostId }: IProps) {
    const [deletePost, { loading }] = useDeletePostMutation();
    const toast = useToast();

    const onDelete = async () => {
        try {
            const response = await deletePost({
                variables: { id: selectedPostId },
                update(cache, { data }) {
                    const posts = cache.readQuery<GetListPostQuery>({
                        query: GetListPostDocument,
                    });

                    const newPosts = posts?.getListPost.filter(
                        (post) => post._id !== data?.deletePost.post?._id
                    );

                    cache.writeQuery<GetListPostQuery>({
                        query: GetListPostDocument,
                        data: { getListPost: newPosts as Post[] },
                    });
                },
            });

            if (response.data?.deletePost.success) {
                toast({
                    title: 'Delete Post',
                    description: response.data.deletePost.message,
                    status: 'success',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Delete Post',
                    description: response.data?.deletePost.message,
                    status: 'error',
                    isClosable: true,
                });
            }
        } catch (error: any) {
            toast({
                title: 'Delete Post',
                description: error.message,
                status: 'error',
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Do you want to delete this?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody></ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            bg="red.500"
                            color="white"
                            _hover={{ bg: 'red.600' }}
                            isLoading={loading}
                            onClick={() => onDelete()}
                        >
                            Yes
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
