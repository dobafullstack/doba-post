import { Box, Flex, Image } from '@chakra-ui/react';
import React, { ReactElement } from 'react'
import mainBg from '../assets/images/bg3.png';
import subBg from '../assets/images/bg2.png';

interface Props {
    children: React.ReactNode;
}

export default function UserLayout({children}: Props): ReactElement {
    return (
        <Flex
            minH="100vh"
            w="100%"
            justify="center"
            align="center"
            bgColor="primary.100"
            opacity="68%"
            pos="relative"
        >
            <Flex minW="50%" minH="500px" bg="primary.200" borderRadius={8}>
                <Flex flexGrow={1} justify="center" align="center">
                    <Image src={mainBg.src} />
                </Flex>

                <Box
                    bg="white"
                    px={10}
                    py={5}
                    flexGrow={1}
                    borderRightRadius={8}
                    borderBottomEndRadius={8}
                    shadow='lg'
                >
                    {children}
                </Box>
            </Flex>
            <Image src={subBg.src} pos="absolute" bottom={0} right={0}/>
        </Flex>
    );
}
