import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION, FILE_TYPE } from "@/libs/constants";

import { IPost } from "@/interfaces/IPost";
import { IReply } from "@/interfaces/IReply";

const usePost = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

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

      setIsLoading(false);
      return post;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const createPost = async (
    postType: FILE_TYPE,
    imageFile: File,
    imageFileCompressed: File | null,
    videoFile: File,
    videoFileCompressed: File | null,
    title: string,
    content: string
  ): Promise<IPost | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const nullFile = new File([""], "garbage.bin");

      const formData = new FormData();
      formData.append("type", postType.toString());
      if (postType == FILE_TYPE.IMAGE) {
        formData.append("files", imageFile);
        formData.append("files", imageFileCompressed ?? nullFile);
      } else {
        formData.append("files", videoFile);
        formData.append("files", videoFileCompressed ?? nullFile);
      }

      // formData.append("types", [].join(","))

      if (user.id) formData.append("authorId", user.id.toString());
      else formData.append("authorId", "");
      formData.append("title", title.toString());
      formData.append("content", content.toString());

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/${API_VERSION}/admin/post`);
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round(
            (event.loaded / event.total) * 100
          );
          setLoadingProgress(percentCompleted);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201 || xhr.status === 202) {
          setIsLoading(false);
          const data = JSON.parse(xhr.response);
          const post = data as IPost;
          resolve(post);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while creating post.");
            setIsLoading(false);
          } else {
            const data = JSON.parse(xhr.responseText);
            toast.error(data.message);
            setIsLoading(false);
          }
          reject(xhr.statusText);
        }
      };
      xhr.onloadend = () => {
        setLoadingProgress(0);
      };
      xhr.send(formData);
    });
  };

  const updatePost = async (
    id: number | null,
    postType: FILE_TYPE,
    imageFile: File | null,
    imageFileCompressed: File | null,
    videoFile: File | null,
    videoFileCompressed: File | null,
    title: string,
    content: string
  ): Promise<IPost | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const nullFile = new File([""], "garbage.bin");

      const formData = new FormData();
      if (id) formData.append("id", id.toString());
      else formData.append("id", "");
      formData.append("type", postType.toString());
      if (postType == FILE_TYPE.IMAGE) {
        formData.append("files", imageFile ?? nullFile);
        formData.append("files", imageFileCompressed ?? nullFile);
      } else {
        formData.append("files", videoFile ?? nullFile);
        formData.append("files", videoFileCompressed ?? nullFile);
      }
      if (user.id) formData.append("authorId", user.id.toString());
      else formData.append("authorId", "");
      formData.append("title", title.toString());
      formData.append("content", content.toString());

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/post`);
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round(
            (event.loaded / event.total) * 100
          );
          setLoadingProgress(percentCompleted);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201 || xhr.status === 202) {
          setIsLoading(false);
          const data = JSON.parse(xhr.response);
          const post = data as IPost;
          resolve(post);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while updating post.");
            setIsLoading(false);
          } else {
            const data = JSON.parse(xhr.responseText);
            toast.error(data.message);
            setIsLoading(false);
          }
          reject(xhr.statusText);
        }
      };
      xhr.onloadend = () => {
        setLoadingProgress(0);
      };
      xhr.send(formData);
    });
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
    loadingProgress,
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
