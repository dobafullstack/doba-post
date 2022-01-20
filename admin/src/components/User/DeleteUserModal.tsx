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
    GetListUserDocument,
    GetListUserQuery,
    useDeleteUserMutation,
    User,
} from '../../graphql/generated/graphql';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    selectedUserId: string;
}

export default function DeleteUserModal({ isOpen, onClose, selectedUserId }: IProps) {
    const [deleteUser, { loading }] = useDeleteUserMutation();
    const toast = useToast();

    const onDelete = async () => {
        try {
            const response = await deleteUser({
                variables: { id: selectedUserId },
                update(cache) {
                    const users = cache.readQuery<GetListUserQuery>({
                        query: GetListUserDocument,
                    });

                    const newUsers = users?.getListUser.filter(
                        (user) => user._id !== selectedUserId
                    );

                    cache.writeQuery<GetListUserQuery>({
                        query: GetListUserDocument,
                        data: { getListUser: newUsers as User[] },
                    });
                },
            });

            if (response.data?.deleteUser.success) {
                toast({
                    title: 'Delete User',
                    description: response.data.deleteUser.message,
                    status: 'success',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Delete User',
                    description: response.data?.deleteUser.message,
                    status: 'error',
                    isClosable: true,
                });
            }
        } catch (error: any) {
            toast({
                title: 'Delete User',
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
