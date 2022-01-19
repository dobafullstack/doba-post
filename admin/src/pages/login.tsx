import { Button, Flex, Link, Text, useToast } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import * as yup from 'yup';
import CustomInput from '../components/Common/CustomInput';
import {
    GetUserDocument,
    GetUserQuery,
    LoginInput,
    useLoginMutation,
} from '../graphql/generated/graphql';
import { mapFieldError } from '../helpers/mapFieldError';
import UserLayout from '../Layout/UserLayout';

interface Props {}

export default function Login({}: Props): ReactElement {
    const [loginUser, { loading }] = useLoginMutation();
    const toast = useToast();
    const router = useRouter();

    const initialValues: LoginInput = {
        usernameOrEmail: '',
        password: '',
    };

    const validationSchema = yup.object().shape({
        usernameOrEmail: yup.string().required('Username or email are required'),
        password: yup.string().required('Password are required'),
    });

    const onSubmit = async (values: LoginInput, { setErrors }: FormikHelpers<LoginInput>) => {
        const response = await loginUser({
            variables: {
                loginInput: values,
            },
            update(cache, { data }) {
                if (data?.login.success) {
                    cache.writeQuery<GetUserQuery>({
                        query: GetUserDocument,
                        data: { getUser: data.login.user },
                    });
                }
            },
        });

        if (response.data?.login.errors) {
            setErrors(mapFieldError(response.data.login.errors));
            return;
        }

        if (response.data?.login.success) {
            console.log('success');

            toast({
                title: 'Welcome',
                description: response.data.login.user?.username,
                status: 'success',
                isClosable: true,
            });

            router.push('/');
        }
    };

    return (
        <>
            <Text fontWeight="bold" textAlign="center" fontSize="2.5rem">
                Login
            </Text>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {() => (
                    <Form>
                        <CustomInput
                            name="usernameOrEmail"
                            placeholder="Username or Email"
                            type="text"
                            label="Username or Email"
                        />
                        <CustomInput
                            name="password"
                            placeholder="Password"
                            type="password"
                            label="Password"
                        />
                        <Flex justify="flex-end">
                            <NextLink href="/forgot-password" passHref>
                                <Link>Forgot password?</Link>
                            </NextLink>
                        </Flex>
                        <Flex justify="center">
                            <Button
                                type="submit"
                                mt={5}
                                isLoading={loading}
                                variant="outline"
                                colorScheme="primary"
                                _hover={{
                                    backgroundColor: 'primary.200',
                                    color: 'white',
                                }}
                            >
                                Login
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </>
    );
}

Login.getLayout = function getLayout(page: ReactElement) {
    return <UserLayout>{page}</UserLayout>;
};
