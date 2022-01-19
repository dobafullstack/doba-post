import {
    Flex,
    Icon,
    LinkBox,
    LinkOverlay,
    Skeleton,
    Text,
    Link as CLink,
    useDisclosure,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { Post } from '../../graphql/generated/graphql';
import formatDate from '../../helpers/formatDate';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Link from 'next/link';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import DeletePostModal from './DeletePostModal';

interface Props {
    item: Post;
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
                    <Link href={`/app/post/${item._id}`}>
                        <CLink minW="400px" maxW="400px">{item.title}</CLink>
                    </Link>
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
            <DeletePostModal selectedPostId={item._id} isOpen={isOpen} onClose={onClose} />
        </>
    );
}
