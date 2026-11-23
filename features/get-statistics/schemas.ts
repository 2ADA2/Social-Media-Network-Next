import z from "zod";
import type {
  Comment,
  Like,
  MyPost,
  Post,
  PostAuthor,
  PostsPage,
} from "@/entities/post/types";

export const postAuthorSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string().nullable(),
  secondName: z.string().nullable(),
  profileImage: z.string().nullable(),
}) satisfies z.ZodType<PostAuthor>;

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  image: z.string().nullable(),
  authorId: z.number(),
  likesCount: z.number(),
  commentsCount: z.number(),
  creationDate: z.string(),
  modifiedDate: z.string(),
  author: postAuthorSchema,
  likedByUsers: z.array(z.object({ id: z.number() })),
}) satisfies z.ZodType<Post>;

export const myPostSchema = postSchema.omit({
  author: true,
  likedByUsers: true,
}) satisfies z.ZodType<MyPost>;

export const myPostsPageSchema = z.object({
  items: z.array(myPostSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export const likeSchema = z.object({
  id: z.number(),
  postId: z.number(),
  userId: z.number(),
  creationDate: z.string(),
}) satisfies z.ZodType<Like>;

export const commentSchema = z.object({
  id: z.number(),
  text: z.string(),
  postId: z.number(),
  authorId: z.number(),
  creationDate: z.string(),
  modifiedDate: z.string(),
}) satisfies z.ZodType<Comment>;

export const postsPageSchema = z.object({
  items: z.array(postSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
}) satisfies z.ZodType<PostsPage>;

export const likesSchema = z.array(likeSchema);
export const commentsSchema = z.array(commentSchema);
