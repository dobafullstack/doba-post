import { Context } from "./../Types/Context";
import lodash from "lodash";
import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import Logger from "../Configs/Logger";
import { Post, PostModel, User, UserModel } from "../Models";
import { Auth } from "../Middlewares/Auth.middleware";
import { CreatePostInput } from "../Types/CreatePostInput";
import { UpdatePostInput } from "../Types/UpdatePostInput";
import { PostMutationResponse } from "./../Types/PostMutationResponse";

@Resolver((_of) => Post)
export class PostResolver {
  @FieldResolver((_return) => String)
  textSnippet(@Root() root: any) {
    return root._doc.content.slice(0, 50);
  }

  //create post
  @UseMiddleware(Auth)
  @Mutation((_return) => PostMutationResponse)
  async createPost(
    @Arg("createPostInput") { title, content }: CreatePostInput,
    @Ctx() { req }: Context
  ): Promise<PostMutationResponse> {
    try {
      const user = await UserModel.findById(req.session.userId);

      const newPost = new PostModel({
        title,
        content,
        user,
      });

      await newPost.save();

      return {
        code: 200,
        success: true,
        message: "Created post successfully",
        post: newPost,
      };
    } catch (error: any) {
      Logger.error(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  //get list posts
  @Query((_return) => [Post])
  async getListPost(): Promise<Post[]> {
    try {
      const posts = await PostModel.find();
      return posts;
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  //get detail post
  @Query((_return) => Post, { nullable: true })
  async getPost(@Arg("id") id: string): Promise<Post | undefined | null> {
    try {
      const post = await PostModel.findById(id);

      return post;
    } catch (error) {
      Logger.error(error);
      return undefined;
    }
  }

  //update post
  @UseMiddleware(Auth)
  @Mutation((_return) => PostMutationResponse)
  async updatePost(
    @Arg("updatePostInput") updatePostInput: UpdatePostInput
  ): Promise<PostMutationResponse> {
    const { id } = updatePostInput;
    try {
      const post = await PostModel.findById(id);

      if (!post) {
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };
      }

      lodash.extend(post, updatePostInput);

      await post.save();

      return {
        code: 200,
        success: true,
        message: "Updated post successfully",
        post: post,
      };
    } catch (error: any) {
      Logger.error(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  //delete post
  @UseMiddleware(Auth)
  @Mutation((_return) => PostMutationResponse)
  async deletePost(@Arg("id") id: string): Promise<PostMutationResponse> {
    try {
      const post = await PostModel.findById(id);

      if (!post) {
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };
      }

      await PostModel.deleteOne({ _id: id });

      return {
        code: 200,
        success: true,
        message: "Deleted post successfully",
        post
      };
    } catch (error: any) {
      Logger.error(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }
}
