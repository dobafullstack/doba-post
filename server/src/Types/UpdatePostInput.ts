import { Field, InputType } from "type-graphql";


@InputType()
export class UpdatePostInput{
    @Field()
    id!: string;

    @Field({nullable: true})
    content?: string;

    @Field({nullable: true})
    title?: string;
}