import type { Comment } from "@prisma/client";
import { cache } from "react";
import { prisma } from "@/db";

export type CommentWithAuthor = Comment & {
  user: { name: string | null; image: string | null };
};

export const fetchCommentByPostId = cache(
  (postId: string): Promise<CommentWithAuthor[]> => {
    console.log("Making a request to the database");
    return prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });
  }
);
