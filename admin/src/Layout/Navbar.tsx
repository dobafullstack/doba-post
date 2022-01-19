import { Box, Fade, Flex, Icon, Image, Link, Text, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { BiUserCircle } from 'react-icons/bi';
import logo from '../assets/images/logo.png';
import { useLogoutMutation } from '../graphql/generated/graphql';

interface Props {}

export default function Navbar({}: Props): ReactElement {
    const { isOpen, onToggle } = useDisclosure();
    const [logout] = useLogoutMutation();
    const router = useRouter();

    const handleLogout = async () => {
        const response = await logout();

        if (response.data.logout){
            router.replace('/login')
        }
    }

    return (
        <Box width="100%" px="100px" color="primary.200" fontSize="2rem" shadow="lg">
            <Flex align="center" minH="5rem">
                <NextLink href="/" passHref>
                    <Link>
                        <Image src={logo.src} />
                    </Link>
                </NextLink>
                <Box ml="auto" pos="relative">
                    <Icon as={BiUserCircle} onClick={onToggle} />
                    <Fade in={isOpen}>
                        <Box
                            p={5}
                            minW="160px"
                            pos="absolute"
                            bg="white"
                            rounded="md"
                            shadow="lg"
                            bottom="-100px"
                            right="-20px"
                            fontSize="1.2rem"
                        >
                            <Flex align="center" gap={1} justify="flex-start">
                                <Icon as={BiUserCircle} />
                                <NextLink href="/app/profile" passHref>
                                    <Link>My Profile</Link>
                                </NextLink>
                            </Flex>
                            <Flex align="center" gap={1} justify="flex-start">
                                <Icon as={AiOutlineLogout} />
                                <Text cursor="pointer" onClick={() => handleLogout()}>
                                    Logout
                                </Text>
                            </Flex>
                        </Box>
                    </Fade>
                </Box>
            </Flex>
        </Box>
    );
}
