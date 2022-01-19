import { Button, Spinner, Stack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import CreatePostModal from "../components/CreatePostModal";
import { Layout } from "../components/Layout";
import PostItem from "../components/PostItem";
import {
  GetListPostDocument,
  Post,
  useGetListPostQuery,
  useGetUserQuery,
} from "../graphql/graphql";
import { useCheckAuth } from "../hooks/useCheckAuth";
import { addApolloState, initializeApollo } from "../lib/apolloClient";

const Index = () => {
  const { loading, data } = useGetListPostQuery();
  const {data: getUserData, loading: getUserLoading} = useCheckAuth()
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Layout>
      {!getUserLoading && getUserData?.getUser !== null ? (
        <Button
          mb={5}
          bg="green.500"
          color="white"
          _hover={{ bg: "green.400" }}
          onClick={onOpen}
        >
          Create a post
        </Button>
      ) : null}
      {loading ? (
        <Spinner />
      ) : (
        <Stack spacing={8}>
          {data?.getListPost?.map((post) => (
            <PostItem post={post as Post} key={post._id} />
          ))}
        </Stack>
      )}
      <CreatePostModal isOpen={isOpen} onClose={onClose} />
    </Layout>
  );
};

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GetListPostDocument,
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}

export default Index;
