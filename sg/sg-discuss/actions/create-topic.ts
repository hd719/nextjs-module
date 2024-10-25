"use server";

import type { Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import paths from "@/path";
import { prisma } from "@/db";
import { revalidatePath } from "next/cache";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
      message: "Name must be lowercase and contain only letters and no spaces",
    }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to create a topic"],
      },
    };
  }

  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  let topic: Topic;
  try {
    topic = await prisma.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: [
            "An error occurred while creating the topic in createTopic() action",
          ],
        },
      };
    }
  }

  revalidatePath("/");
  redirect(paths.topicShowPath(topic.slug));
}
