import { DeleteIcon } from '@chakra-ui/icons';
import {
    Badge, Flex,
    Icon, Skeleton,
    Text, useDisclosure
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { User } from '../../graphql/generated/graphql';
import formatDate from '../../helpers/formatDate';
import DeleteUserModal from './DeleteUserModal';

interface Props {
    item: User;
    loading: boolean;
}

export default function ListItem({ item, loading }: Props): ReactElement {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Skeleton isLoaded={!loading} rounded="xl">
                <Flex
                    bg="white"
                    w="100%"
                    justify="space-between"
                    shadow="lg"
                    mb={4}
                    minH="70px"
                    align="center"
                    rounded="xl"
                    px={10}
                    transition="all 0.5s"
                >
                    <Text>{item.username}</Text>
                    <Text>{item.email}</Text>
                    <Badge bgColor={item.role === 'admin' ? 'green.500' : 'blue.500'} color="white">
                        {item.role === 'admin' ? 'Admin' : 'Client'}
                    </Badge>
                    <Text>{formatDate(item.createdAt)}</Text>
                    <Icon
                        as={DeleteIcon}
                        color="red.500"
                        cursor="pointer"
                        _hover={{ color: 'red.600' }}
                        onClick={onOpen}
                    />
                </Flex>
            </Skeleton>
            <DeleteUserModal selectedUserId={item._id} isOpen={isOpen} onClose={onClose} />
        </>
    );
}
