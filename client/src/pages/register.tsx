import { Button, Flex, FormControl, Spinner, useToast } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import { Layout } from "../components/Layout";
import Wrapper from "../components/Wrapper";
import { GetUserDocument, GetUserQuery, RegisterInput, useRegisterMutation } from "../graphql/graphql";
import { mapFieldError } from "../helpers/mapFieldError";
import { useCheckAuth } from "../hooks/useCheckAuth";

const register = () => {
    const router = useRouter();
    const toast = useToast();
    const { data: authData, loading: authLoading } = useCheckAuth();
    const [registerUser] = useRegisterMutation();
    const initialValues: RegisterInput = {
        username: "",
        password: "",
        name: "",
        email: "",
    };

    const onRegisterSubmit = async (values: RegisterInput, {setErrors}: FormikHelpers<RegisterInput>) => {
        const response = await registerUser({
            variables: {
                registerInput: values,
            },
            update(cache, { data }) {
                if (data?.register.success) {
                    cache.writeQuery<GetUserQuery>({
                        query: GetUserDocument,
                        data: { getUser: data.register.user },
                    });
                }
            },
        });

        if (response.data?.register.errors){
            setErrors(mapFieldError(response.data.register.errors));
            return;
        }

        if (response.data?.register.success) {
             toast({
                 title: "Welcome",
                 description: response.data.register.user?.username,
                 status: "success",
                 isClosable: true,
             });
            router.push("/");
        }
    };

    return (
        <Layout>
            {authLoading || (!authLoading && authData?.getUser) ? (
                <Flex justifyContent='center' alignItems='center' minH='100vh'>
                    <Spinner />
                </Flex>
            ) : (
                <Wrapper size='small'>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onRegisterSubmit}>
                        {({ isSubmitting }) => (
                            <Form>
                                <FormControl>
                                    <InputField
                                        name='name'
                                        placeholder='Name'
                                        label='Name'
                                        type='text'
                                    />
                                    <InputField
                                        name='username'
                                        placeholder='Username'
                                        label='Username'
                                        type='text'
                                    />
                                    <InputField
                                        name='email'
                                        placeholder='Email'
                                        label='Email'
                                        type='text'
                                    />
                                    <InputField
                                        name='password'
                                        placeholder='Password'
                                        label='Password'
                                        type='password'
                                    />
                                    <Flex justifyContent="center">
                                        <Button
                                            type='submit'
                                            mt={4}
                                            isLoading={isSubmitting}>
                                            Register
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

export default register;
