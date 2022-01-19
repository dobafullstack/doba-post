import { Box } from '@chakra-ui/react';
import React from 'react';
import DropdownItem from '../components/Common/DropdownItem';
import SideItem from '../components/Common/SideItem';
import {
    AiOutlineFontColors,
    AiTwotoneBank,
    AiOutlineRadarChart,
    AiOutlineUserSwitch,
    AiOutlineUsergroupAdd,
} from 'react-icons/ai';

export default function Sidebar() {
    return (
        <Box minW="400px" shadow="lg" pt={5} px={3}>
            <SideItem label="Post" path="/app/post" icon={AiOutlineFontColors} />
            <SideItem label="User" path="/app/user" icon={AiOutlineUserSwitch} />
        </Box>
    );
}
