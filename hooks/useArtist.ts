import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { getAWSSignedURL } from "@/libs/aws";
import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_ARTIST_IMAGE,
  DEFAULT_BANNER_IMAGE,
} from "@/libs/constants";

import { IArtist } from "@/interfaces/IArtist";
import { IHomepage } from "@/interfaces/IHomepage";

const useArtist = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { accessToken } = useAuthValues();

  const fetchArtist = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/artist?id=${id}`,
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
      const artist = data as IArtist;
      artist.avatarImage = await getAWSSignedURL(
        artist.avatarImage,
        DEFAULT_ARTIST_IMAGE
      );
      artist.bannerImage = await getAWSSignedURL(
        artist.bannerImage,
        DEFAULT_BANNER_IMAGE
      );

      return artist;
    }

    setIsLoading(false);
    return null;
  };

  const updateArtist = async (
    id: number | null,
    username: string,
    firstName: string,
    lastName: string,
    dob: string,
    email: string,
    artistName: string,
    website: string,
    description: string,
    address: string,
    mobile: string,
    bannerImageFile: File | null,
    avatarImageFile: File | null,
    facebook: string,
    twitter: string,
    youtube: string,
    instagram: string,
    soundcloud: string,
    logoImageFile: File | null
  ) => {
    setIsLoading(true);

    const nullFile = new File([""], "garbage.bin");

    const formData = new FormData();

    formData.append("files", bannerImageFile ?? nullFile);
    formData.append("files", avatarImageFile ?? nullFile);
    formData.append("files", logoImageFile ?? nullFile);
    if (id) formData.append("id", id.toString());
    else formData.append("id", "");
    formData.append("username", username.toString());
    formData.append("firstName", firstName.toString());
    formData.append("lastName", lastName.toString());
    formData.append("dob", dob.toString());
    formData.append("email", email.toString());
    formData.append("artistName", artistName.toString());
    formData.append("website", website.toString());
    formData.append("description", description.toString());
    formData.append("address", address.toString());
    formData.append("mobile", mobile.toString());

    formData.append("facebook", facebook.toString());
    formData.append("twitter", twitter.toString());
    formData.append("youtube", youtube.toString());
    formData.append("instagram", instagram.toString());
    formData.append("soundcloud", soundcloud.toString());

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/artist`,
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
      const artist = data as IArtist;
      artist.avatarImage = await getAWSSignedURL(
        artist.avatarImage,
        DEFAULT_ARTIST_IMAGE
      );
      artist.bannerImage = await getAWSSignedURL(
        artist.bannerImage,
        DEFAULT_BANNER_IMAGE
      );

      return artist;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating artist.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const fetchHomeContent = async () => {
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as IHomepage;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  const updateHomeContent = async (
    backgroundVideoFile: File | null
  ) => {
    setIsLoading(true);
    const nullFile = new File([""], "garbage.bin");

    const formData = new FormData();
    formData.append("backgroundVideoFile", backgroundVideoFile ?? nullFile);
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/home`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      return data as IHomepage;
    } else {
      setIsLoading(false);
      return null;
    }
  };
  return {
    isLoading,
    fetchArtist,
    updateArtist,
    fetchHomeContent,
    updateHomeContent,
  };
};

export default useArtist;
