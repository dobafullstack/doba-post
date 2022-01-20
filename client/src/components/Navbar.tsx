import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { GetUserDocument, GetUserQuery, useGetUserQuery, useLogoutMutation } from "../graphql/graphql";

const Navbar = () => {
    const { data, loading } = useGetUserQuery();
    const [logout, {loading: useLogoutLoading}] = useLogoutMutation();

    const handleLogout = async () => {
        await logout({
            update(cache){
                cache.writeQuery<GetUserQuery>({
                    query: GetUserDocument,
                    data: {getUser: null}
                })
            }
        });
    };

    let body;
    if (loading) {
        body = null;
    } else if (!data?.getUser) {
        body = (
            <>
                <NextLink href='/login' prefetch={true}>
                    <Link mr={2}>Login</Link>
                </NextLink>
                <NextLink href='/register' prefetch={true}>
                    <Link>Register</Link>
                </NextLink>
            </>
        );
    } else {
        body = (
            <Button bg="red.500" _hover={{bg: "red.600"}} onClick={() => handleLogout()} isLoading={useLogoutLoading}>
                Logout
            </Button>
        );
    }

    return (
        <Box bg='primary.200' color="white" p={4}>
            <Flex
                maxW={800}
                justifyContent='space-between'
                alignItems='center'
                m='auto'>
                <Heading>
                    <NextLink href="/">
                        <Link>Doba</Link>
                    </NextLink>
                </Heading>
                <Box>{body}</Box>
            </Flex>
        </Box>
    );
};

export default Navbar;
