import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Select,
    Textarea,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import { useToasts } from 'react-toast-notifications';
import * as yup from 'yup';
import {
    CreatePostInput,
    GetListPostDocument,
    GetListPostQuery,
    Post,
    useCreatePostMutation,
} from '../../graphql/generated/graphql';
import AddNewDrawer from '../Common/AddNewDrawer';
import CustomInput from '../Common/CustomInput';

interface Props {}

export default function School({}: Props): ReactElement {
    const [createPost, { loading }] = useCreatePostMutation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const initialValues: CreatePostInput = {
        content: '',
        title: '',
    };

    const validationSchema = yup.object().shape({
        content: yup.string().required('Name is required'),
        title: yup.string().required('City is required'),
    });

    const onSubmit = async (
        values: CreatePostInput,
        { setFieldError, resetForm }: FormikHelpers<CreatePostInput>
    ) => {
        try {
            const { data } = await createPost({
                variables: { createPostInput: values },
                update(cache, { data }) {
                    const posts = cache.readQuery<GetListPostQuery>({
                        query: GetListPostDocument,
                    });

                    const newPosts = posts?.getListPost.concat(data?.createPost.post as Post);

                    cache.writeQuery<GetListPostQuery>({
                        query: GetListPostDocument,
                        data: { getListPost: newPosts as Post[] },
                    });
                },
            });

            onClose();
            resetForm();

            toast({
                title: 'Create Post',
                description: data?.createPost.message,
                status: 'success',
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: 'Create Post',
                description: error.message,
                status: 'error',
                isClosable: true,
            });
        }
    };

    return (
        <>
            <AddNewDrawer
                label="Create new post"
                formId="create-post"
                // loading={loading}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
            >
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    {({ handleChange, errors, touched, values }) => (
                        <Form id="create-post">
                            <CustomInput
                                name="title"
                                placeholder="Title"
                                label="Title"
                                type="Text"
                            />
                            <FormControl isInvalid={Boolean(errors.content && touched.content)}>
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
            </AddNewDrawer>
        </>
    );
}
