import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { getAWSSignedURL } from "@/libs/aws";
import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_COVER_IMAGE,
} from "@/libs/constants";

import { IAlbum } from "@/interfaces/IAlbum";

const useAlbum = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllAlbum = async () => {
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/album`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const albums = data as Array<IAlbum>;
      const promises = albums.map((album) => {
        return getAWSSignedURL(album.image, DEFAULT_COVER_IMAGE);
      });
      const images = await Promise.all(promises);
      albums.forEach((album, index) => (album.image = images[index]));

      return albums;
    }

    setIsLoading(false);
    return [];
  };

  const createAlbum = async (
    image: File,
    name: string,
    description: string
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append("name", name.toString());
    if (user.id) formData.append("userId", user.id.toString());
    else formData.append("userId", "");
    formData.append("description", description.toString());
    formData.append("copyright", "");

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/album`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const album = data as IAlbum;
      album.image = await getAWSSignedURL(album.image, DEFAULT_COVER_IMAGE);

      return album;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on creating Album.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const updateAlbum = async (
    id: number | null,
    image: File | null,
    name: string,
    description: string
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    if (id) formData.append("id", id.toString());
    else formData.append("id", "");
    if (image) {
      formData.append("imageFile", image);
    }
    formData.append("name", name.toString());
    if (user.id) formData.append("userId", user.id.toString());
    else formData.append("userId", "");
    formData.append("description", description.toString());
    formData.append("copyright", "");

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/album`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const album = data as IAlbum;
      album.image = await getAWSSignedURL(album.image, DEFAULT_COVER_IMAGE);

      return album;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating Album.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const deleteAlbum = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/album?id=${id}`,
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

  return { isLoading, fetchAllAlbum, createAlbum, updateAlbum, deleteAlbum };
};

export default useAlbum;
