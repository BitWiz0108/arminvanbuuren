import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_COVER_IMAGE,
} from "@/libs/constants";

import { IMusic } from "@/interfaces/IMusic";
import { getAWSSignedURL } from "@/libs/aws";

const useMusic = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken, user } = useAuthValues();

  const fetchMusic = async (page: number, limit: number = 10) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/music?page=${page}&limit=${limit}`,
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
      const coverImagePromises = musics.map((music) => {
        return getAWSSignedURL(music.coverImage, DEFAULT_COVER_IMAGE);
      });
      const coverImages = await Promise.all(coverImagePromises);
      musics.forEach((music, index) => (music.coverImage = coverImages[index]));

      return {
        pages: data.pages as number,
        musics,
      };
    }

    setIsLoading(false);
    return null;
  };

  const createMusic = async (
    coverImage: File,
    musicFile: File,
    isExclusive: boolean,
    albumId: number | null,
    duration: number,
    title: string,
    musicGenrerId: number | null,
    languageId: number | null,
    copyright: string,
    lyrics: string,
    description: string,
    releaseDate: string
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    if (user.id) formData.append("userId", user.id.toString());
    else formData.append("userId", "");
    formData.append("files", musicFile);
    formData.append("files", coverImage);
    formData.append("isExclusive", isExclusive.toString());
    if (albumId) {
      formData.append("albumId", albumId.toString());
    } else {
      formData.append("albumId", "");
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
    formData.append("releaseDate", releaseDate.toString());

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/music`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const music = data as IMusic;
      music.coverImage = await getAWSSignedURL(
        music.coverImage,
        DEFAULT_COVER_IMAGE
      );

      return music;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on creating music.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const updateMusic = async (
    id: number | null,
    coverImage: File | null,
    musicFile: File | null,
    isExclusive: boolean,
    albumId: number | null,
    duration: number,
    title: string,
    musicGenrerId: number | null,
    languageId: number | null,
    copyright: string,
    lyrics: string,
    description: string,
    releaseDate: string
  ) => {
    setIsLoading(true);

    const nullFile = new File([""], "garbage.bin");

    const formData = new FormData();
    if (id) formData.append("id", id.toString());
    else formData.append("id", "");
    formData.append("files", musicFile ?? nullFile);
    formData.append("files", coverImage ?? nullFile);
    formData.append("isExclusive", isExclusive.toString());
    if (albumId == null) {
      formData.append("albumId", "");
    } else {
      formData.append("albumId", albumId.toString());
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
    formData.append("releaseDate", releaseDate.toString());

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/music`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const music = data as IMusic;
      music.coverImage = await getAWSSignedURL(
        music.coverImage,
        DEFAULT_COVER_IMAGE
      );

      return music;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating music.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
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

  return { isLoading, fetchMusic, createMusic, updateMusic, deleteMusic };
};

export default useMusic;
