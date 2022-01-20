import CreateUserInput from "../Types/CreateUserInput";
import { RegisterInput } from "../Types/RegisterInput";


export const ValidateRegister = (registerInput: RegisterInput | CreateUserInput) => {
    //Email
    if (!registerInput.email.includes("@"))
        return {
            message: 'Invalid email',
            errors: [
                {field: 'email', message: 'Email must include @ symbol'}
            ]
        }
    
    //Username
    if (registerInput.username.length <= 2)
        return  {
            message: 'Invalid username',
            errors: [
                {field: 'username', message: 'Length must be greater than 2'}
            ]
        }

    if (registerInput.username.includes('@'))
        return {
            message: 'Invalid username',
            errors: [
                {field: 'username', message: "Username cannot include @ symbol"}
            ]
        }
    
    //Password
    if (registerInput.password.length <= 6)
        return  {
            message: 'Invalid password',
            errors: [
                {field: 'password', message: 'Length must be greater than 6'}
            ]
        }


    return null;
}