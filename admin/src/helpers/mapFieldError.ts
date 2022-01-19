import { FieldError } from "../generated/graphql";

export const mapFieldError = (errors: FieldError[]) => {
    return errors.reduce((prevProps, error) => {
        return {
            ...prevProps,
            [error.field]: error.message
        }
    }, {})
}