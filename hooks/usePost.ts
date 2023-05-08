import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_AVATAR_IMAGE,
  DEFAULT_COVER_IMAGE,
} from "@/libs/constants";
import { getAWSSignedURL } from "@/libs/aws";

import { DEFAULT_POST, IPost } from "@/interfaces/IPost";
import { IReply } from "@/interfaces/IReply";

const usePost = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken, user } = useAuthValues();

  const fetchPost = async (page: number, limit: number = 10) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/post?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const posts = data.posts as Array<IPost>;
      const imagePromises = posts.map((post) => {
        return getAWSSignedURL(post.compressedImage, DEFAULT_COVER_IMAGE);
      });
      const images = await Promise.all(imagePromises);
      posts.forEach((post, index) => (post.image = images[index]));

      return {
        pages: data.pages as number,
        posts,
      };
    }

    setIsLoading(false);
    return null;
  };

  const fetchPostById = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/post?id=${id}&userId=${user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const post = data as IPost;
      post.image = await getAWSSignedURL(post.image, DEFAULT_POST.image);
      post.compressedImage = await getAWSSignedURL(
        post.compressedImage,
        DEFAULT_POST.image
      );
      const avatarImagePromises = post.replies.map((reply) => {
        return getAWSSignedURL(reply.replier.avatarImage, DEFAULT_AVATAR_IMAGE);
      });
      if (avatarImagePromises && avatarImagePromises.length > 0) {
        const avatarImages = await Promise.all(avatarImagePromises);
        post.replies.forEach(
          (reply, index) => (reply.replier.avatarImage = avatarImages[index])
        );
      }

      setIsLoading(false);
      return post;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const createPost = async (
    imageFile: File,
    title: string,
    content: string
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("imageFile", imageFile);
    if (user.id) formData.append("authorId", user.id.toString());
    else formData.append("authorId", "");
    formData.append("title", title.toString());
    formData.append("content", content.toString());

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const post = data as IPost;
      post.image = await getAWSSignedURL(post.image, DEFAULT_COVER_IMAGE);

      return post;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on creating post.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const updatePost = async (
    id: number | null,
    imageFile: File | null,
    title: string,
    content: string
  ) => {
    setIsLoading(true);

    const nullFile = new File([""], "garbage.bin");

    const formData = new FormData();
    if (id) formData.append("id", id.toString());
    else formData.append("id", "");
    formData.append("imageFile", imageFile ?? nullFile);
    if (user.id) formData.append("authorId", user.id.toString());
    else formData.append("authorId", "");
    formData.append("title", title.toString());
    formData.append("content", content.toString());

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/post`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const post = data as IPost;
      post.image = await getAWSSignedURL(post.image, DEFAULT_COVER_IMAGE);

      return post;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating post.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const deletePost = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/post?id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const fetchReplies = async (
    postId: number | null,
    page: number,
    limit: number = 10
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/reply/list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ postId, page, limit }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const replies = data.replies as Array<IReply>;
      const avatarImagePromises = replies.map((reply) => {
        return getAWSSignedURL(reply.replier.avatarImage, DEFAULT_AVATAR_IMAGE);
      });
      if (avatarImagePromises && avatarImagePromises.length > 0) {
        const avatarImages = await Promise.all(avatarImagePromises);
        replies.forEach(
          (reply, index) => (reply.replier.avatarImage = avatarImages[index])
        );
      }

      const pages = Number(data.pages);

      setIsLoading(false);
      return { replies, pages };
    } else {
      setIsLoading(false);
    }
    return { replies: [], pages: 0 };
  };

  const createReply = async (postId: number | null, content: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ replierId: user.id, postId, content }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const reply = data as IReply;
      reply.replier.avatarImage = await getAWSSignedURL(
        reply.replier.avatarImage,
        DEFAULT_AVATAR_IMAGE
      );

      setIsLoading(false);
      return reply;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const deleteReply = async (id: number) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/post/delete-replies`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ids: [id] }),
      }
    );
    if (response.ok) {
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
    }
    return false;
  };

  return {
    isLoading,
    fetchPost,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    fetchReplies,
    createReply,
    deleteReply,
  };
};

export default usePost;
