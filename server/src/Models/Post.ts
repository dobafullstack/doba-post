import { getModelForClass, plugin, prop, Ref } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";
import mongooseAutoPopulate from 'mongoose-autopopulate';

@ObjectType()
@plugin(mongooseAutoPopulate as any)
export class Post extends TimeStamps{
    @Field(_type => String)
    _id!: string;

    @Field()
    @prop()
    title!: string;

    @Field()
    @prop()
    content!: string;

    @Field()
    @prop({default: false})
    active!: boolean;

    @Field(_type => User)
    @prop({ref: User, autopopulate: true})
    user!: Ref<User>

    @Field()
    @prop()
    createdAt!: Date;

    @Field()
    @prop()
    updatedAt!: Date;
}

export const PostModel = getModelForClass(Post);