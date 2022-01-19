import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import * as yup from "yup";
import {
  CreatePostInput,
  GetListPostDocument,
  GetListPostQuery,
  Post,
  useCreatePostMutation,
} from "../graphql/graphql";
import InputField from "./InputField";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: IProps) {
  const [createPost, { loading }] = useCreatePostMutation();
  const toast = useToast();

  const initialValues: CreatePostInput = {
    content: "",
    title: "",
  };

  const onSubmit = async (values: CreatePostInput, {resetForm}: FormikHelpers<CreatePostInput>) => {
    try {
      const { data } = await createPost({
        variables: { createPostInput: values },
        update(cache, { data }) {
          const posts = cache.readQuery<GetListPostQuery>({
            query: GetListPostDocument,
          });

          const newPosts = posts?.getListPost.concat(
            data?.createPost.post as Post
          );

          cache.writeQuery<GetListPostQuery>({
            query: GetListPostDocument,
            data: { getListPost: newPosts as Post[] },
          });
        },
      });

      onClose();
      resetForm();

      toast({
        title: "Create Post",
        description: data?.createPost.message,
        status: "success",
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Create Post",
        description: error.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    content: yup.string().required("Content is required"),
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ handleChange, values, errors, touched }) => (
                <Form id="create-post">
                  <InputField
                    placeholder="Title"
                    name="title"
                    label="Title"
                    type="text"
                  />
                  <FormControl
                    isInvalid={Boolean(errors.content && touched.content)}
                  >
                    <FormLabel htmlFor="content">Content</FormLabel>
                    <Textarea
                      placeholder="Content"
                      id="content"
                      name="content"
                      isInvalid={Boolean(errors.content && touched.content)}
                      value={values.content}
                      onChange={handleChange}
                    />
                    {errors.content && touched.content ? (
                      <FormErrorMessage>{errors.content}</FormErrorMessage>
                    ) : null}
                  </FormControl>
                </Form>
              )}
            </Formik>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              isLoading={loading}
              bg="green.400"
              color="white"
              _hover={{ bg: "green.500" }}
              type="submit"
              form="create-post"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
