import { Field, ObjectType } from "type-graphql";
import { Post } from "../Models";
import { FieldError } from "./FieldError";
import { IMutationResponse } from "./IMutationResponse";

@ObjectType({ implements: IMutationResponse })
export class PostMutationResponse implements IMutationResponse {
    code!: number;
    success!: boolean;
    message?: string | undefined;

    @Field({ nullable: true })
    post?: Post;

    @Field((_type) => [FieldError], { nullable: true })
    errors?: FieldError[];
}
