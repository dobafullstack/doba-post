import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { useGetPostQuery } from "../../graphql/graphql";
import formatDate from "../../helpers/formatDate";

export default function DetailPost() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = useGetPostQuery({
    variables: { id: id as string },
  });
  return <Layout>{loading ? <p>Loading</p> : <Box>
    <Heading as="h1">{data?.getPost?.title}</Heading>
    <Divider />
    <Flex justify="space-between" mt={2} color="gray.400">
        <Text>Posted by {data?.getPost?.user.username}</Text>
        <Text>{formatDate(data?.getPost?.createdAt)}</Text>
    </Flex>
    <Text mt={5}>{data?.getPost?.content}</Text>
  </Box>}</Layout>;
}
