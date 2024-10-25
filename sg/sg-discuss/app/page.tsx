// import { Button } from "@nextui-org/react";
// import * as actions from "@/actions";
// import { auth } from "@/auth";
// import Profile from "@/components/profile";

import TopicCreateForm from "@/components/topics/topic-create-form";
import TopicList from "@/components/topics/topic-list";
import { Divider } from "@nextui-org/react";
import PostList from "@/components/posts/post-list";
import { fetchTopPosts } from "@/db/queries/post";

export default async function Home() {
  // const session = await auth();

  return (
    <div>
      {/* <form action={actions.signIn}>
        <Button type="submit">Sign In</Button>
      </form>

      <form action={actions.signOut}>
        <Button type="submit">Sign Out</Button>
      </form>

      {session?.user ? (
        <div>Server: {JSON.stringify(session.user)}</div>
      ) : (
        <div>Server: Signed Out</div>
      )}

      <Profile /> */}
      <div className="grid grid-cols-4 gap-4 p-4">
        <div className="col-span-3">
          <h1 className="text-xl m-2">Top Posts</h1>
          <PostList fetchData={fetchTopPosts} />
        </div>
        <div className="border shadow py-3 px-2">
          <TopicCreateForm />
          <Divider className="my-2" />
          <h3 className="text-lg">Topics</h3>
          <TopicList />
        </div>
      </div>
    </div>
  );
}
