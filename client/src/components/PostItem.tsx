import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  Skeleton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { Post, useGetUserQuery } from "../graphql/graphql";
import formatDate from "../helpers/formatDate";
import DeletePostModal from "./DeletePostModal";
import UpdatePostModal from "./UpdatePostModal";

interface IProps {
  post: Post;
}

export default function PostItem({ post }: IProps) {
  const { loading: getUserLoading, data: getUserData } = useGetUserQuery();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  return (
    <>
      <Skeleton isLoaded={!getUserLoading}>
        <Flex key={post._id} p={5} shadow="md" borderWidth="1px">
          <Box w="100%">
            <NextLink href={`/post/${post._id}`}>
              <Link>
                <Heading fontSize="x-large">{post.title}</Heading>
              </Link>
            </NextLink>
            <Text color="gray.400">Posted by {post.user.username}</Text>
            <Flex>
              <Text mt={4} flex={1}>
                {post.textSnippet.length >= 50
                  ? `${post.textSnippet}...`
                  : post.textSnippet}
              </Text>
              {getUserData?.getUser?._id === post.user._id ? (
                <Box ml="auto">
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="edit"
                    mr={4}
                    onClick={onOpenEdit}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="delete"
                    color="red"
                    onClick={onOpenDelete}
                  />
                </Box>
              ) : null}
            </Flex>
            <Text textAlign="end" mt={5} color="gray.400">
              {formatDate(post.createdAt)}
            </Text>
          </Box>
        </Flex>
      </Skeleton>
      <UpdatePostModal isOpen={isOpenEdit} onClose={onCloseEdit} post={post} />
      <DeletePostModal
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
        selectedPostId={post._id}
      />
    </>
  );
}
