import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IStream, IStreamQueryParam } from "@/interfaces/IStream";
import { IComment } from "@/interfaces/IComment";
import { getAWSSignedURL } from "@/libs/aws";

const useLivestream = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken, user } = useAuthValues();
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const fetchLivestream = async (queryParam: IStreamQueryParam) => {
    setIsLoading(true);

    const params = Object.entries(queryParam)
      .map((param) => {
        return `${param[0]}=${param[1]}`;
      })
      .join("&");

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/live-stream?${params}`,
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
      const fullVideoPromises = livestreams.map((livestream) => {
        return getAWSSignedURL(livestream.fullVideo);
      });
      const fullVideoCompressedPromises = livestreams.map((livesstream) => {
        return getAWSSignedURL(livesstream.fullVideoCompressed);
      });
      const previewVideoPromises = livestreams.map((livesstream) => {
        return getAWSSignedURL(livesstream.fullVideoCompressed);
      });
      const previewVideoCompressedPromises = livestreams.map((livesstream) => {
        return getAWSSignedURL(livesstream.fullVideoCompressed);
      });
      const result = await Promise.all([
        Promise.all(fullVideoPromises),
        Promise.all(fullVideoCompressedPromises),
        Promise.all(previewVideoPromises),
        Promise.all(previewVideoCompressedPromises),
      ]);
      livestreams.forEach((livestream, index) => {
        livestream.fullVideo = result[0][index];
        livestream.fullVideoCompressed = result[1][index];
        livestream.previewVideo = result[2][index];
        livestream.previewVideoCompressed = result[3][index];
      });

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
    previewVideoCompressed: File,
    fullVideo: File,
    fullVideoCompressed: File,
    title: string,
    categoryId: number | null,
    releaseDate: string,
    description: string,
    duration: number,
    shortDescription: string,
    lyrics: string,
    isExclusive: boolean
  ): Promise<IStream | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("files", coverImage);
      formData.append("files", previewVideo);
      formData.append("files", previewVideoCompressed);
      formData.append("files", fullVideo);
      formData.append("files", fullVideoCompressed);
      formData.append("title", title.toString());
      if (categoryId) {
        formData.append("categoryId", categoryId.toString());
      } else {
        formData.append("categoryId", "");
      }
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

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/${API_VERSION}/admin/live-stream`);
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
          const livestream = data as IStream;
          resolve(livestream);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while creating livestream.");
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

  const updateLivestream = async (
    id: number | null,
    coverImage: File | null,
    previewVideo: File | null,
    previewVideoCompressed: File | null,
    fullVideo: File | null,
    fullVideoCompressed: File | null,
    title: string,
    categoryId: number | null,
    releaseDate: string,
    description: string,
    duration: number,
    shortDescription: string,
    lyrics: string,
    isExclusive: boolean
  ): Promise<IStream | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      const nullFile = new File([""], "garbage.bin");

      const formData = new FormData();
      if (id) formData.append("id", id.toString());
      else formData.append("id", "");
      formData.append("files", coverImage ?? nullFile);
      formData.append("files", previewVideo ?? nullFile);
      formData.append("files", previewVideoCompressed ?? nullFile);
      formData.append("files", fullVideo ?? nullFile);
      formData.append("files", fullVideoCompressed ?? nullFile);
      formData.append("title", title.toString());
      if (categoryId == null) {
        formData.append("categoryId", "");
      } else {
        formData.append("categoryId", categoryId.toString());
      }
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

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/live-stream`);
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
          const livestream = data as IStream;
          resolve(livestream);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while creating livestream.");
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
    loadingProgress,
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
