"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";

export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });

  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({ where: { id } });

  revalidatePath("/");
  redirect("/");
}

export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  // This needs to be a server action
  // "use server"; // This is a server action, it will be run on the server

  try {
    // Check the user's input and make sure its valid
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !== "string" || title.length < 3) {
      return {
        message: "title must be at least 3 characters long",
      };
    }

    if (typeof code !== "string" || code.length < 3) {
      return {
        message: "code must be at least 3 characters long",
      };
    }

    // Take the user input and create a new record in the db
    const snippet = await db.snippet.create({
      data: {
        title,
        code,
      },
    });

    console.log("Created new snippet", snippet);
  } catch (err: unknown) {
    console.error("Failed to create snippet", err);
    if (err instanceof Error) {
      return {
        message: err.message,
      };
    } else {
      return {
        message: "Something went wrong",
      };
    }
  }

  revalidatePath("/");
  // Redirect the user to the new snippet's page
  redirect("/");
}
