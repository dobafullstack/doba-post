import { Field, InputType } from "type-graphql";

@InputType()
export default class CreateUserInput {
  @Field()
  name!: string;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  role!: string;
}
