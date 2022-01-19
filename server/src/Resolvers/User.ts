import lodash from "lodash";
import md5 from "md5";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { v4 as uuidV4 } from "uuid";
import Logger from "../Configs/Logger";
import { COOKIE_NAME } from "../Constants";
import { User, UserModel } from "../Models";
import { TokenModel } from "../Models/Token";
import ChangePasswordInput from "../Types/ChangePasswordInput";
import { Context } from "../Types/Context";
import ForgotPasswordInput from "../Types/ForgotPasswordInput";
import { LoginInput } from "../Types/LoginInput";
import { RegisterInput } from "../Types/RegisterInput";
import { UserMutationResponse } from "../Types/UserMutationResponse";
import { sendMail } from "../Utils/SendMail";
import { ValidateRegister } from "../Utils/ValidateRegister";

@Resolver()
export class UserResolver {
  @Query((_return) => User, { nullable: true })
  async getUser(@Ctx() { req }: Context): Promise<User | undefined | null> {
    if (!req.session.userId) return null;

    const user = await UserModel.findById(req.session.userId);

    return user;
  }

  //Register
  @Mutation((_return) => UserMutationResponse)
  async register(
    @Arg("registerInput") registerInput: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    const { name, username, email, password } = registerInput;
    const validateRegister = ValidateRegister(registerInput);

    if (validateRegister !== null) {
      return {
        code: 400,
        success: false,
        ...validateRegister,
      };
    }

    try {
      const existingUser = await UserModel.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser)
        return {
          code: 400,
          success: false,
          message: "Duplicate username or email",
          errors: [
            {
              field: existingUser.username === username ? "username" : "email",
              message: `${
                existingUser.username === username ? "Username" : "Email"
              } already taken`,
            },
          ],
        };

      const hashPassword = md5(password);

      const newUser = new UserModel({
        name,
        username,
        email,
        password: hashPassword,
      });

      //session
      req.session.userId = newUser._id;

      return {
        code: 201,
        success: true,
        message: "Register successfully!",
        user: await newUser.save(),
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

  //Login
  @Mutation((_return) => UserMutationResponse)
  async login(
    @Arg("loginInput") { usernameOrEmail, password }: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await UserModel.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      if (!existingUser) {
        return {
          code: 403,
          success: false,
          message: "This account does not exist!",
          errors: [
            {
              field: "usernameOrEmail",
              message: `${
                usernameOrEmail.includes("@") ? "Email" : "Username"
              } does not exist`,
            },
          ],
        };
      }

      if (md5(password) !== existingUser.password) {
        return {
          code: 403,
          success: false,
          message: "Wrong password",
          errors: [{ field: "password", message: "Wrong password" }],
        };
      }

      //create session
      req.session.userId = existingUser.id;

      return {
        code: 200,
        success: true,
        message: "Logged successfully",
        user: existingUser,
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

  //Logout
  @Mutation((_return) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<Boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME);

      req.session.destroy((err) => {
        if (err) {
          Logger.error(`DESTROYING SESSION ERROR ${err}`);
          resolve(false);
        }

        resolve(true);
      });
    });
  }

  //Forgot Password
  @Mutation((_return) => String)
  async forgotPassword(
    @Arg("forgotPasswordInput") { email }: ForgotPasswordInput
  ): Promise<string> {
    const user = await UserModel.findOne({ email: email });

    if (!user) return "";

    const resetToken = uuidV4();
    const token = md5(resetToken);

    await new TokenModel({ userId: `${user.id}`, token }).save();

    const url = await sendMail(
      email,
      `<a href="http://localhost:3000/change-password/?token=${resetToken}">Click here</a>`
    );

    return url;
  }

  //Change password
  @Mutation((_return) => UserMutationResponse)
  async changePassword(
    @Arg("changePasswordInput") { token, newPassword }: ChangePasswordInput
  ): Promise<UserMutationResponse> {
    try {
      const existingToken = await TokenModel.findOne({ token: md5(token) });

      if (!existingToken) {
        return {
          code: 403,
          success: false,
          message: "Token was expires",
          user: undefined,
          errors: [{ field: "token", message: "Token was expires" }],
        };
      }

      const user = await UserModel.findById(existingToken.userId);

      if (!user) {
        return {
          code: 403,
          success: false,
          message: "Can not find user",
          user: undefined,
          errors: [{ field: "user", message: "Can not find User" }],
        };
      }

      lodash.extend(user, {
        password: md5(newPassword),
      });

      await user.save();

      //remove token
      await TokenModel.findByIdAndDelete(existingToken._id);

      return {
        code: 200,
        success: true,
        message: "Change password successfully",
        user,
      };
    } catch (error: any) {
      Logger.error(error.message);
      return {
        code: 500,
        message: error.message,
        success: false,
      };
    }
  }
}
