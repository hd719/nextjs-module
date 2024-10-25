"use server";
import type { Post } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import paths from "@/path";
import { prisma } from "@/db";
import { revalidatePath } from "next/cache";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

// This is what we are returning from the createPost function
interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to create a Post"],
      },
    };
  }

  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const topic = await prisma.topic.findUnique({
    where: {
      slug,
    },
  });

  if (!topic) {
    return {
      errors: {
        _form: ["Topic not found"],
      },
    };
  }

  let post: Post;
  try {
    post = await prisma.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
      },
    });
  } catch (err: unknown) {
    console.error("Error creating post", err);
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Error creating post"],
        },
      };
    }
  }

  revalidatePath(paths.topicShowPath(slug));
  redirect(paths.postShow(slug, post.id.toString()));
}
