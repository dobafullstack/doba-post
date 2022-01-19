import User from "./User";

interface Post {
  _id: string;
  title: string;
  content: string;
  user: User;
  textSnippet: string;
  createdAt: string;
  updatedAt: string;
}

export default Post;