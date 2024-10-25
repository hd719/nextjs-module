import type { Post } from "@prisma/client";
import { prisma } from "@/db";
import { select } from "@nextui-org/react";

// export type PostWithData = Post & {
//   topic: { slug: string };
//   user: { name: string | null };
//   _count: { comments: number };
// };

export type PostWithData = Awaited<
  ReturnType<typeof fetchPostByTopicSlug>
>[number];

export function fetchPostByTopicSlug(slug: string) {
  // Find a post by a given slug, and include the topic, user, and comment count
  const posts = prisma.post.findMany({
    where: { topic: { slug } },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });

  return posts;
}

export function fetchTopPosts(): Promise<PostWithData[]> {
  return prisma.post.findMany({
    orderBy: [
      {
        comments: {
          _count: "desc",
        },
      },
    ],
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
  });
}

export function fetchPostsBySearchTerm(term: string): Promise<PostWithData[]> {
  return prisma.post.findMany({
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
    where: {
      OR: [{ title: { contains: term } }, { content: { contains: term } }],
    },
  });
}
