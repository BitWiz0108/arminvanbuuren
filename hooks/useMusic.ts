import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  RELEASEDATETIME_FORMAT,
  UPLOAD_TYPE,
} from "@/libs/constants";

import { IMusic, IMusicQueryParam } from "@/interfaces/IMusic";
import { getAWSSignedURL } from "@/libs/aws";
import moment from "moment";

const useMusic = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const fetchMusic = async (queryParam: IMusicQueryParam) => {
    setIsLoading(true);

    const params = Object.entries(queryParam)
      .map((param) => {
        return `${param[0]}=${param[1]}`;
      })
      .join("&");

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/music?${params}`,
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
      const musics = data.musics as Array<IMusic>;

      const musicPromises = musics.map((music) => {
        return getAWSSignedURL(music.musicFile);
      });
      const musicCompressedPromises = musics.map((music) => {
        return getAWSSignedURL(music.musicFileCompressed);
      });
      const result = await Promise.all([
        Promise.all(musicPromises),
        Promise.all(musicCompressedPromises),
      ]);
      musics.forEach((music, index) => {
        music.musicFile = result[0][index];
        music.musicFileCompressed = result[1][index];
      });

      return {
        pages: data.pages as number,
        musics,
      };
    }

    setIsLoading(false);
    return null;
  };

  const createMusic = (
    coverImage: File,
    musicFile: File,
    musicFileCompressed: File,
    isExclusive: boolean,
    albumIds: Array<number> | null,
    duration: number,
    title: string,
    musicGenrerId: number | null,
    languageId: number | null,
    copyright: string,
    lyrics: string,
    description: string,
    releaseDate: string,
    uploadType: UPLOAD_TYPE,
    videoBackgroundFile: File | string,
    videoBackgroundFileCompressed: File | string
  ): Promise<IMusic | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const formData = new FormData();

      const nullFile = new File([""], "garbage.bin");

      formData.append("files", musicFile);
      formData.append("files", musicFileCompressed);
      formData.append("files", coverImage);
      if (uploadType == UPLOAD_TYPE.FILE) {
        formData.append("files", videoBackgroundFile);
        formData.append("files", videoBackgroundFileCompressed);
      } else {
        formData.append("files", nullFile);
        formData.append("files", nullFile);
        formData.append("videoBackground", videoBackgroundFile);
        formData.append(
          "videoBackgroundCompressed",
          videoBackgroundFileCompressed
        );
      }

      if (user.id) formData.append("userId", user.id.toString());
      else formData.append("userId", "");

      formData.append("isExclusive", isExclusive.toString());
      if (albumIds) {
        formData.append("albumIds", albumIds.toString());
      } else {
        formData.append("albumIds", "");
      }
      formData.append("duration", duration.toString());
      formData.append("title", title.toString());
      if (musicGenrerId != null) {
        formData.append("musicGenrerId", musicGenrerId.toString());
      }
      if (languageId != null) {
        formData.append("languageId", languageId.toString());
      }
      formData.append("copyright", copyright.toString());
      formData.append("lyrics", lyrics.toString());
      formData.append("description", description.toString());
      formData.append(
        "releaseDate",
        moment(releaseDate).format(RELEASEDATETIME_FORMAT).toString()
      );
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE_URL}/${API_VERSION}/admin/music`);

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
          const music = data as IMusic;

          resolve(music);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while creating music.");
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

  const updateMusic = async (
    id: number | null,
    coverImage: File | null,
    musicFile: File | null,
    musicFileCompressed: File | null,
    isExclusive: boolean,
    albumIds: Array<number> | null,
    duration: number,
    title: string,
    musicGenrerId: number | null,
    languageId: number | null,
    copyright: string,
    lyrics: string,
    description: string,
    releaseDate: string,
    uploadType: UPLOAD_TYPE,
    videoBackgroundFile: File | string,
    videoBackgroundFileCompressed: File | string
  ): Promise<IMusic | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);

      const formData = new FormData();
      const nullFile = new File([""], "garbage.bin");

      if (id) formData.append("id", id.toString());
      else formData.append("id", "");
      formData.append("files", musicFile ?? nullFile);
      formData.append("files", musicFileCompressed ?? nullFile);
      formData.append("files", coverImage ?? nullFile);

      if (uploadType == UPLOAD_TYPE.FILE) {
        formData.append("files", videoBackgroundFile ?? nullFile);
        formData.append("files", videoBackgroundFileCompressed ?? nullFile);
      } else {
        formData.append("files", nullFile);
        formData.append("files", nullFile);
        formData.append("videoBackground", videoBackgroundFile ?? "");
        formData.append(
          "videoBackgroundCompressed",
          videoBackgroundFileCompressed ?? ""
        );
      }

      formData.append("isExclusive", isExclusive.toString());
      if (albumIds == null) {
        formData.append("albumIds", "");
      } else {
        formData.append("albumIds", albumIds.toString());
      }
      formData.append("duration", duration.toString());
      formData.append("title", title.toString());
      if (musicGenrerId != null) {
        formData.append("musicGenrerId", musicGenrerId.toString());
      }
      if (languageId != null) {
        formData.append("languageId", languageId.toString());
      }
      formData.append("copyright", copyright.toString());
      formData.append("lyrics", lyrics.toString());
      formData.append("description", description.toString());
      formData.append(
        "releaseDate",
        moment(releaseDate).format(RELEASEDATETIME_FORMAT).toString()
      );
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/music`);
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
          const music = data as IMusic;
          resolve(music);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while updating music.");
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

  const deleteMusic = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/music?id=${id}`,
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

  return {
    isLoading,
    loadingProgress,
    fetchMusic,
    createMusic,
    updateMusic,
    deleteMusic,
  };
};

export default useMusic;
