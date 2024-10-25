const paths = {
  homePath() {
    return "/";
  },
  topicShowPath(topicSlug: string) {
    return `/topics/${topicSlug}`;
  },
  postCreate() {
    return "/posts/create";
  },
  postShow(topicSlug: string, postSlug: string) {
    return `/topics/${topicSlug}/posts/${postSlug}`;
  },
};

export default paths;
