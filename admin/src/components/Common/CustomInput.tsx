import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { ReactElement } from 'react';

interface Props {
    label: string;
    name: string;
    placeholder: string;
    type: string;
}

export default function CustomInput(props: Props): ReactElement {
    const [field, { error, touched }] = useField(props);

    return (
        <FormControl isInvalid={error && touched} mb={5}>
            <FormLabel fontWeight="bold">{props.label}</FormLabel>
            <Input
                name={field.name}
                placeholder={props.placeholder}
                type={props.type}
                onChange={field.onChange}
                value={field.value}
                isInvalid={error && touched}
            />
            {error && touched ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}
