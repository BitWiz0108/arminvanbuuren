import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_COVER_IMAGE,
} from "@/libs/constants";

import { IPost } from "@/interfaces/IPost";
import { getAWSSignedURL } from "@/libs/aws";

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
        return getAWSSignedURL(post.image, DEFAULT_COVER_IMAGE);
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

  return { isLoading, fetchPost, createPost, updatePost, deletePost };
};

export default usePost;
