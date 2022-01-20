import { Box } from '@chakra-ui/react';
import React from 'react';
import {
    AiOutlineFontColors, AiOutlineUserSwitch
} from 'react-icons/ai';
import SideItem from '../components/Common/SideItem';

export default function Sidebar() {
    return (
        <Box minW="400px" shadow="xl" pt={5} px={3}>
            <SideItem label="Post" path="/app/post" icon={AiOutlineFontColors} />
            <SideItem label="User" path="/app/user" icon={AiOutlineUserSwitch} />
        </Box>
    );
}
