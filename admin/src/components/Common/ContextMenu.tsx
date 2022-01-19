import { Box, Divider, Flex, Icon, Text } from '@chakra-ui/react';
import React, { ReactElement, useState } from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

interface Props {
    onEdit: (e: any, data: any) => void;
    onDelete: (e: any, data: any) => void;
}

export default function ContextMenuComponent({ onEdit, onDelete }: Props): ReactElement {
    return (
        <>
            <ContextMenu
                id="school_manager"
                style={{
                    backgroundColor: 'white',
                    boxShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                    borderRadius: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 15,
                    paddingBottom: 15,
                }}
            >
                <MenuItem onClick={onEdit}>
                    <Flex
                        align="center"
                        color="blue.500"
                        gap={3}
                        fontSize="xl"
                        mb={2}
                        cursor="pointer"
                    >
                        <Icon />
                        <Text>Edit</Text>
                    </Flex>
                </MenuItem>
                <Divider />
                <MenuItem onClick={onDelete}>
                    <Flex align="center" color="red.500" gap={3} fontSize="xl" cursor="pointer">
                        <Icon />
                        <Text>Delete</Text>
                    </Flex>
                </MenuItem>
            </ContextMenu>
        </>
    );
}
