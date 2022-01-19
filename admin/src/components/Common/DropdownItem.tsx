import { Box, Collapse, Icon, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import SideItem from './SideItem';

interface IProps {
    label: string;
    children?: React.ReactNode;
}

export default function DropdownItem({ label, children }: IProps) {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <>
            <Box
                bg={isOpen ? 'primary.200' : 'gray.50'}
                color={isOpen ? 'white' : 'black'}
                w="100%"
                minH="50px"
                borderRadius={8}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                cursor="pointer"
                transition="all 0.5s"
                onClick={onToggle}
                mb="4"
                px={5}
                _hover={{
                    backgroundColor: 'primary.100',
                    color: 'white',
                }}
            >
                <Text>{label}</Text>
                <Icon as={AiOutlineDown} />
            </Box>
            <Collapse in={isOpen} animateOpacity>
                <Box pl={8} color="white" mb="4" rounded="md">
                    {children}
                </Box>
            </Collapse>
        </>
    );
}
