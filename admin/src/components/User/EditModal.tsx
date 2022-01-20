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
} from '@chakra-ui/react';
import React from 'react';
import {
    GetListPostDocument,
    GetListPostQuery,
    Post,
    UpdatePostInput,
    useUpdatePostMutation,
} from '../../graphql/generated/graphql';
import * as yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import CustomInput from '../Common/CustomInput';

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post;
}

export default function UpdatePostModal({ isOpen, onClose, post }: IProps) {
    const [updatePost, { loading }] = useUpdatePostMutation();
    const toast = useToast();
    const initialValues: UpdatePostInput = {
        id: post._id,
        content: post.content,
        title: post.title,
    };

    const validationSchema = yup.object().shape({
        title: yup.string().required('Title is required'),
        content: yup.string().required('Content is required'),
    });

    const onSubmit = async (values: UpdatePostInput, {}: FormikHelpers<UpdatePostInput>) => {
        try {
            const response = await updatePost({
                variables: { updatePostInput: values },
                update(cache, { data }) {
                    const posts = cache.readQuery<GetListPostQuery>({
                        query: GetListPostDocument,
                    });

                    const index = posts?.getListPost.findIndex((p) => p._id === values.id);

                    if (index && index > -1) {
                        const newPosts = posts?.getListPost.map((p, i) => {
                            if (i === index) {
                                return data?.updatePost.post;
                            }
                            return p;
                        });

                        cache.writeQuery<GetListPostQuery>({
                            query: GetListPostDocument,
                            data: { getListPost: newPosts as Post[] },
                        });
                    }
                },
            });

            if (response.data?.updatePost.success) {
                toast({
                    title: 'Update Post',
                    description: response.data.updatePost.message,
                    status: 'success',
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Update Post',
                    description: response.data?.updatePost.message,
                    status: 'error',
                    isClosable: true,
                });
            }
        } catch (error: any) {
            toast({
                title: 'Update Post',
                description: error.message,
                status: 'error',
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Update Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                            enableReinitialize
                        >
                            {({ values, errors, touched, handleChange }) => (
                                <Form id="update-post">
                                    <CustomInput
                                        name="title"
                                        label="Title"
                                        placeholder="Title"
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
                                            value={values.content as string}
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
                            bg="blue.500"
                            color="white"
                            _hover={{ bg: 'blue.600' }}
                            type="submit"
                            form="update-post"
                            isLoading={loading}
                        >
                            Update
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
