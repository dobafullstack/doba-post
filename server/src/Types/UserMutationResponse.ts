import { FieldError } from './FieldError';
import { Field, ObjectType } from "type-graphql";
import { User } from "../Models";
import { IMutationResponse } from "./IMutationResponse";


@ObjectType({implements: IMutationResponse})
export class UserMutationResponse implements IMutationResponse{
    code!: number;
    success!: boolean;
    message?: string | undefined;

    @Field({nullable: true})
    user?: User

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[]
}