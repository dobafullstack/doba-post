import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Select,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { ReactElement } from 'react';
import * as yup from 'yup';
import {
    CreateUserInput,
    GetListUserDocument,
    GetListUserQuery, useCreateUserMutation
} from '../../graphql/generated/graphql';
import { mapFieldError } from '../../helpers/mapFieldError';
import AddNewDrawer from '../Common/AddNewDrawer';
import CustomInput from '../Common/CustomInput';

interface Props {}

export default function School({}: Props): ReactElement {
    const [createUser, { loading }] = useCreateUserMutation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const initialValues: CreateUserInput = {
        username: '',
        email: '',
        name: '',
        password: '',
        role: '',
    };

    const validationSchema = yup.object().shape({
        username: yup.string().required('Username is required'),
        email: yup.string().required('Email is required'),
        name: yup.string().required('Name is required'),
        password: yup.string().required('Password is required'),
        role: yup.string().required('Role is required'),
    });

    const onSubmit = async (
        values: CreateUserInput,
        { setErrors, resetForm }: FormikHelpers<CreateUserInput>
    ) => {
        console.log(values);
        try {
            const response = await createUser({
                variables: { createUserInput: values },
                update(cache, { data }) {
                    const users = cache.readQuery<GetListUserQuery>({
                        query: GetListUserDocument,
                    });

                    if (data.createUser.user) {
                        cache.writeQuery<GetListUserQuery>({
                            query: GetListUserDocument,
                            data: { getListUser: users.getListUser.concat(data.createUser.user) },
                        });
                    }
                },
            });

            if (response.data.createUser.errors) {
                setErrors(mapFieldError(response.data.createUser.errors));
            } else {
                onClose();
                resetForm();
                toast({
                    title: 'Create User',
                    description: response.data?.createUser.message,
                    status: 'success',
                    isClosable: true,
                });
            }
        } catch (error: any) {
            toast({
                title: 'Create User',
                description: error.message,
                status: 'error',
                isClosable: true,
            });
        }
    };

    return (
        <>
            <AddNewDrawer
                label="Create new user"
                formId="create-user"
                loading={loading}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
            >
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    {({ handleChange, errors, touched }) => (
                        <Form id="create-user">
                            <CustomInput name="name" placeholder="Name" label="Name" type="text" />
                            <CustomInput
                                name="username"
                                placeholder="Username"
                                label="Username"
                                type="text"
                            />
                            <CustomInput
                                name="email"
                                placeholder="Email"
                                label="Email"
                                type="text"
                            />
                            <CustomInput
                                name="password"
                                placeholder="Password"
                                label="Password"
                                type="password"
                            />
                            <FormControl isInvalid={errors.role && touched.role}>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    name="role"
                                    onChange={handleChange}
                                    placeholder="Select role"
                                    isInvalid={errors.role && touched.role}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="client">Client</option>
                                </Select>
                                {errors.role && touched.role ? (
                                    <FormErrorMessage>{errors.role}</FormErrorMessage>
                                ) : null}
                            </FormControl>
                        </Form>
                    )}
                </Formik>
            </AddNewDrawer>
        </>
    );
}
