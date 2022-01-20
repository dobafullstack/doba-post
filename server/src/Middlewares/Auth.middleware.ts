import { AuthenticationError } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";
import { UserModel } from "../Models";
import { Context } from "../Types/Context";


export const Auth: MiddlewareFn<Context> = ({context: {req}}, next) => {
    if (!req.session.userId) {
        throw new AuthenticationError(
            "Not authenticated to perform GraphQL operations"
        );
    }

    return next();
}

export const Authorization: MiddlewareFn<Context> = async ({context: {req}}, next) => {
    const user = await UserModel.findById(req.session.userId);

    if (user?.role === "client"){
        throw new AuthenticationError(
            "You do not have permission to access this route"
        );
    }

    return next();
}