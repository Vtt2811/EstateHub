import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

//for single page to get post details
export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

//for list page to searching posts
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};

export const messagesPageLoader = async () => {
  const chatPromise = apiRequest("/chats");
  return defer({
    chatResponse: chatPromise,
  });
};
