import { Button, Flex, FormControl, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../components/InputField";
import { Layout } from "../components/Layout";
import Wrapper from "../components/Wrapper";
import {
  ForgotPasswordInput,
  useForgotPasswordMutation,
} from "../graphql/graphql";

const ForgotPassword = () => {
  const [forgotPassword, { data, loading }] = useForgotPasswordMutation();
  const initialValues: ForgotPasswordInput = {
    email: "",
  };

  const onForgotPasswordSubmit = async (values: ForgotPasswordInput) => {
    forgotPassword({
      variables: {
        forgotPasswordInput: { email: values.email },
      },
    });
  };

  return (
      <Layout>
          {!loading && data ? (
              <Flex justifyContent="center" alignItems="center" minH="100vh">
                  <h1 style={{fontSize: '3rem'}}>Demo</h1>
                  <Link href={data.forgotPassword}>Click here</Link>
              </Flex>
          ) : (
              <Wrapper size="small">
                  <Formik
                      initialValues={initialValues}
                      onSubmit={onForgotPasswordSubmit}>
                      {({ isSubmitting }) => (
                          <Form>
                              <FormControl>
                                  <InputField
                                      name='email'
                                      placeholder='Email'
                                      label='Email'
                                      type='email'
                                  />

                                  <Button
                                      type='submit'
                                      mt={4}
                                      isLoading={isSubmitting}>
                                      Forgot password
                                  </Button>
                              </FormControl>
                          </Form>
                      )}
                  </Formik>
              </Wrapper>
          )}
      </Layout>
  );
};

export default ForgotPassword;
