import { Button, Flex, FormControl, Spinner, useToast, Link } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { GetUserDocument, GetUserQuery, LoginInput, useLoginMutation } from "../graphql/graphql";
import { mapFieldError } from "../helpers/mapFieldError";
import { useCheckAuth } from "../hooks/useCheckAuth";
import NextLink from 'next/link'
import { Layout } from "../components/Layout";

const Login = () => {
    const router = useRouter();
    const {data: authData, loading: authLoading} = useCheckAuth()
    const [loginUser] = useLoginMutation();
    const toast = useToast()
    const initialValues: LoginInput = {
        usernameOrEmail: "",
        password: "",
    };

    const onLoginSubmit = async (
        values: LoginInput,
        { setErrors }: FormikHelpers<LoginInput>
    ) => {
        const response = await loginUser({
            variables: {
                loginInput: values,
            },
            update(cache, {data}){
                if (data?.login.success){
                    cache.writeQuery<GetUserQuery>({
                        query: GetUserDocument,
                        data: {getUser: data.login.user}    
                    })
                }
            }
        });        

        if (response.data?.login.errors) {
            setErrors(mapFieldError(response.data.login.errors));
            return;
        }

        if (response.data?.login.success){
            console.log("success");
            

            toast({
                title: "Welcome",
                description: response.data.login.user?.username,
                status: "success",
                isClosable: true
            })

            router.push('/');
        }
    };

    return (
        <Layout>
            {authLoading || (!authLoading && authData?.getUser) ? (
                <Flex justifyContent='center' alignItems='center' minH='100vh'>
                    <Spinner />
                </Flex>
            ) : (
                <Wrapper size="small">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onLoginSubmit}>
                        {({ isSubmitting }) => (
                            <Form>
                                <FormControl>
                                    <InputField
                                        name='usernameOrEmail'
                                        placeholder='Username or email'
                                        label='Name'
                                        type='text'
                                    />
                                    <InputField
                                        name='password'
                                        placeholder='Password'
                                        label='Password'
                                        type='password'
                                    />
                                    <Flex justifyContent='flex-end' mt={2}>
                                        <NextLink href='/forgot-password'>
                                            <Link>Forgot password?</Link>
                                        </NextLink>
                                    </Flex>
                                    <Flex justifyContent='center'>
                                        <Button
                                            type='submit'
                                            mt={4}
                                            isLoading={isSubmitting}>
                                            Login
                                        </Button>
                                    </Flex>
                                </FormControl>
                            </Form>
                        )}
                    </Formik>
                </Wrapper>
            )}
        </Layout>
    );
};

export default Login;
