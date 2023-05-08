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

import { IStream } from "@/interfaces/IStream";
import { IComment } from "@/interfaces/IComment";

const useLivestream = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken, user } = useAuthValues();

  const fetchLivestream = async (page: number, limit: number = 10) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/live-stream?page=${page}&limit=${limit}`,
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
      const livestreams = data.livestreams as Array<IStream>;
      const coverImagePromises = livestreams.map((livestream) => {
        return getAWSSignedURL(livestream.coverImage, DEFAULT_COVER_IMAGE);
      });
      const coverImages = await Promise.all(coverImagePromises);
      livestreams.forEach(
        (livestream, index) => (livestream.coverImage = coverImages[index])
      );

      return {
        pages: data.pages as number,
        livestreams,
      };
    }

    setIsLoading(false);
    return null;
  };

  const createLivestream = async (
    coverImage: File,
    previewVideo: File,
    fullVideo: File,
    title: string,
    releaseDate: string,
    description: string,
    duration: number,
    shortDescription: string,
    lyrics: string,
    isExclusive: boolean
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("files", coverImage);
    formData.append("files", previewVideo);
    formData.append("files", fullVideo);
    formData.append("title", title.toString());
    if (user.id) {
      formData.append("singerId", user.id.toString());
      formData.append("creatorId", user.id.toString());
    } else {
      formData.append("singerId", "");
      formData.append("creatorId", "");
    }
    formData.append("releaseDate", releaseDate.toString());
    formData.append("lyrics", lyrics.toString());
    formData.append("description", description.toString());
    formData.append("duration", duration.toString());
    formData.append("shortDescription", shortDescription.toString());
    formData.append("isExclusive", isExclusive.toString());
    formData.append("copyright", "");

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/live-stream`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const livestream = data as IStream;
      livestream.coverImage = await getAWSSignedURL(
        livestream.coverImage,
        DEFAULT_COVER_IMAGE
      );

      return livestream;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on creating livestream.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const updateLivestream = async (
    id: number | null,
    coverImage: File | null,
    previewVideo: File | null,
    fullVideo: File | null,
    title: string,
    releaseDate: string,
    description: string,
    duration: number,
    shortDescription: string,
    lyrics: string,
    isExclusive: boolean
  ) => {
    setIsLoading(true);

    const nullFile = new File([""], "garbage.bin");

    const formData = new FormData();
    if (id) formData.append("id", id.toString());
    else formData.append("id", "");
    formData.append("files", coverImage ?? nullFile);
    formData.append("files", previewVideo ?? nullFile);
    formData.append("files", fullVideo ?? nullFile);
    formData.append("title", title.toString());
    if (user.id) {
      formData.append("singerId", user.id.toString());
      formData.append("creatorId", user.id.toString());
    } else {
      formData.append("singerId", "");
      formData.append("creatorId", "");
    }
    formData.append("releaseDate", releaseDate.toString());
    formData.append("lyrics", lyrics.toString());
    formData.append("description", description.toString());
    formData.append("duration", duration.toString());
    formData.append("shortDescription", shortDescription.toString());
    formData.append("isExclusive", isExclusive.toString());
    formData.append("copyright", "");

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/live-stream`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const livestream = data as IStream;
      livestream.coverImage = await getAWSSignedURL(
        livestream.coverImage,
        DEFAULT_COVER_IMAGE
      );

      return livestream;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating livestream.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const deleteLivestream = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/live-stream?id=${id}`,
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

  const fetchComments = async (
    livestreamId: number | null,
    page: number,
    limit: number = 30
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/live-stream/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: livestreamId,
          page,
          limit,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      const comments = data.comments as Array<IComment>;
      const avatarImagePromises = comments.map((comment) => {
        return getAWSSignedURL(
          comment.author.avatarImage,
          DEFAULT_AVATAR_IMAGE
        );
      });
      const avatarImages = await Promise.all(avatarImagePromises);
      comments.forEach((comment, index) => {
        comment.author.avatarImage = avatarImages[index];
      });
      const pages = Number(data.pages);

      setIsLoading(false);
      return { comments, pages };
    } else {
      setIsLoading(false);
    }
    return { comments: [], pages: 0 };
  };

  const writeComment = async (livestreamId: number | null, content: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/live-stream/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ livestreamId, userId: user.id, content }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      const comment = data as IComment;
      comment.author.avatarImage = await getAWSSignedURL(
        comment.author.avatarImage,
        DEFAULT_AVATAR_IMAGE
      );

      setIsLoading(false);
      return comment;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const deleteComment = async (id: number) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/live-stream/delete-comments`,
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
    fetchLivestream,
    createLivestream,
    updateLivestream,
    deleteLivestream,
    fetchComments,
    writeComment,
    deleteComment,
  };
};

export default useLivestream;
