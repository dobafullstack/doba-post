import React, { ReactElement } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import {
    Button,
    Icon,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Box,
    Flex,
} from '@chakra-ui/react';

interface Props {
    children?: React.ReactNode;
    label?: string;
    formId?: string;
    loading?: boolean;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export default function AddNewDrawer({
    children,
    label = 'Modal title',
    formId,
    loading = false,
    isOpen,
    onOpen,
    onClose,
}: Props): ReactElement {
    return (
        <>
            <Flex
                justify="center"
                align="center"
                onClick={onOpen}
                w="50px"
                h="50px"
                bg="primary.100"
                cursor="pointer"
                color="white"
                rounded="full"
                mb={5}
                _hover={{
                    backgroundColor: 'primary.200',
                }}
            >
                <Icon as={AiOutlinePlus} />
            </Flex>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>{label}</DrawerHeader>

                    <DrawerBody>{children}</DrawerBody>

                    <DrawerFooter>
                        <Button
                            form={formId}
                            type="submit"
                            color="white"
                            rounded="full"
                            w="100%"
                            isLoading={loading}
                            bg="primary.100"
                            _hover={{
                                backgroundColor: 'primary.200',
                            }}
                        >
                            Save
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
