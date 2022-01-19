import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Field, ObjectType } from "type-graphql";
import { Entity } from "typeorm";

@ObjectType()
@Entity()
export class User extends TimeStamps{
    @Field(_type => String)
    _id!: string;

    @Field()
    @prop({unique: true})
    username!: string;

    @Field()
    @prop()
    name!: string;

    @Field()
    @prop({unique: true})
    email!: string;
    
    @prop()
    password!: string;
    
    @Field()
    @prop()
    createdAt!: Date;
    
    @Field()
    @prop()
    updatedAt!: Date;
}

export const UserModel = getModelForClass(User);
