import { Field, InputType } from "type-graphql";

@InputType()
export default class ChangePasswordInput{

    @Field()
    token!: string;

    @Field()
    newPassword!: string;
}