import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";

interface InputFieldProps {
    name: string;
    label: string;
    placeholder: string;
    type: string;
}

const InputField = (props: InputFieldProps) => {
    const [field, { error }] = useField(props);

    return (
        <FormControl isInvalid={!!error} mb={3}>
            <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
            <Input
                id={field.name}
                placeholder={props.placeholder}
                value={field.value}
                onChange={field.onChange}
                type={props.type}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default InputField;
