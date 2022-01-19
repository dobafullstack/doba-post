import { Button, FormControl, useToast } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { ChangePasswordDocument, ChangePasswordMutation, useChangePasswordMutation } from "../graphql/graphql";
import IChangePasswordInput from "../types/ChangePasswordInput";

const ChangePassword = () => {
  const toast = useToast();
  const initialValues: IChangePasswordInput = {
    newPassword: "",
    confirmPassword: "",
  };
  const router = useRouter();
  const [changePassword, { loading, data }] = useChangePasswordMutation();

  const onChangePasswordSubmit = async (
    { confirmPassword, newPassword }: IChangePasswordInput,
    { setErrors }: FormikHelpers<IChangePasswordInput>
  ) => {
    if (newPassword === "") {
      setErrors({
        newPassword: "New password can not null",
      });
      return;
    }
    if (confirmPassword === "") {
      setErrors({
        confirmPassword: "Confirm password can not null",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Confirm password",
        description: "Not correct",
        duration: 3000,
        status: "warning",
        isClosable: true,
      });
      return;
    }

    const response = await changePassword({
      variables: {
        changePasswordInput: {
          token: router.query.token as string,
          newPassword,
        },
      },
      update(cache, {data}){
        cache.writeQuery<ChangePasswordMutation>({
            query: ChangePasswordDocument,
            data: {changePassword: data?.changePassword as any}
        })
      }
    });

    if (!response.data?.changePassword.success) {
      toast({
        title: "Change password failed",
        description: data?.changePassword.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return
    }

    if (!loading && response.data?.changePassword.success) {
      toast({
        title: "Change password",
        description: "Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.replace('/login');
    }
  };

  return (
    <Wrapper>
      <Formik initialValues={initialValues} onSubmit={onChangePasswordSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField
                name="newPassword"
                placeholder="New password"
                label="New password"
                type="password"
              />
              <InputField
                name="confirmPassword"
                placeholder="Confirm password"
                label="Confirm password"
                type="password"
              />

              <Button type="submit" mt={4} isLoading={isSubmitting}>
                Forgot password
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ChangePassword;
