import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  FILE_TYPE,
  UPLOAD_TYPE,
} from "@/libs/constants";

import { IArtist } from "@/interfaces/IArtist";
import { IHomepage } from "@/interfaces/IHomepage";

const useArtist = () => {
  const { accessToken, user } = useAuthValues();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

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
    bannerType: FILE_TYPE,
    bannerImageFile: File | null,
    bannerImageFileCompressed: File | null,
    bannerVideoFile: File | null,
    bannerVideoFileCompressed: File | null,
    avatarImageFile: File | null,
    logoImageFile: File | null,
    facebook: string,
    twitter: string,
    youtube: string,
    instagram: string,
    soundcloud: string,
    siteName: string,
    siteUrl: string,
    siteTitle: string,
    siteDescription: string,
    siteSocialPreviewImageFile: File | null
  ): Promise<IArtist | null> => {
    return new Promise((resolve, reject) => {
      console.log("!!!!!", artistName);
      setIsLoading(true);

      const nullFile = new File([""], "garbage.bin");

      const formData = new FormData();
      if (bannerType) formData.append("bannerType", bannerType.toString());
      else formData.append("bannerType", "");
      if (bannerType == FILE_TYPE.IMAGE) {
        formData.append("files", bannerImageFile ?? nullFile);
        formData.append("files", bannerImageFileCompressed ?? nullFile);
      } else {
        formData.append("files", bannerVideoFile ?? nullFile);
        formData.append("files", bannerVideoFileCompressed ?? nullFile);
      }
      formData.append("files", avatarImageFile ?? nullFile);
      formData.append("files", logoImageFile ?? nullFile);
      formData.append("files", siteSocialPreviewImageFile ?? nullFile);

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

      if (siteName) formData.append("siteName", siteName.toString());
      else formData.append("siteName", "");
      if (siteUrl) formData.append("siteUrl", siteUrl.toString());
      else formData.append("siteUrl", "");
      if (siteTitle) formData.append("siteTitle", siteTitle.toString());
      else formData.append("siteTitle", "");
      if (siteDescription)
        formData.append("siteDescription", siteDescription.toString());
      else formData.append("siteDescription", "");

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/artist`);
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
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
          const artist = data as IArtist;
          resolve(artist);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while updating artist.");
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
    backgroundType: FILE_TYPE,
    uploadType: UPLOAD_TYPE,
    backgroundVideoFile: File | string | null,
    backgroundVideoFileCompressed: File | string | null,
    backgroundImageFile: File | null,
    backgroundImageFileCompressed: File | null,
    signInBackgroundVideoFile: File | string | null,
    signInBackgroundVideoFileCompressed: File | string | null,
    signInBackgroundImageFile: File | null,
    signInBackgroundImageFileCompressed: File | null,
    homePageDescription: string,
    signInDescription: string
  ): Promise<IHomepage | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      const nullFile = new File([""], "garbage.bin");
      const formData = new FormData();
      formData.append("type", backgroundType);

      if (backgroundType == FILE_TYPE.IMAGE) {
        formData.append("files", backgroundImageFile ?? nullFile);
        formData.append("files", backgroundImageFileCompressed ?? nullFile);
        formData.append("files", signInBackgroundImageFile ?? nullFile);
        formData.append("files", backgroundImageFileCompressed ?? nullFile);
      } else {
        if (uploadType == UPLOAD_TYPE.FILE) {
          formData.append("files", backgroundVideoFile ?? nullFile);
          formData.append("files", backgroundVideoFileCompressed ?? nullFile);
          formData.append("files", signInBackgroundVideoFile ?? nullFile);
          formData.append(
            "files",
            signInBackgroundVideoFileCompressed ?? nullFile
          );
        } else {
          formData.append("files", nullFile);
          formData.append("files", nullFile);
          formData.append("backgroundVideo", backgroundVideoFile ?? "");
          formData.append(
            "backgroundVideoCompressed",
            backgroundVideoFileCompressed ?? ""
          );
          formData.append(
            "signInBackgroundVideo",
            signInBackgroundVideoFile ?? ""
          );
          formData.append(
            "signInBackgroundVideoCompressed",
            signInBackgroundVideoFileCompressed ?? ""
          );
        }
      }

      formData.append("homePageDescription", homePageDescription.toString());
      formData.append("signInDescription", signInDescription.toString());
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/home`);
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
          const home = data as IHomepage;
          resolve(home);
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

  const fetchAdminHomeContent = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/login-background`,
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
      return data as IHomepage;
    } else {
      setIsLoading(false);
      return null;
    }
  };

  const updateAdminHomeContent = async (
    adminBackgroundType: FILE_TYPE,
    adminBackgroundVideoFile: File | null,
    adminBackgroundVideoFileCompressed: File | null,
    adminBackgroundImageFile: File | null,
    adminBackgroundImageFileCompressed: File | null
  ): Promise<IHomepage | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);
      const nullFile = new File([""], "garbage.bin");

      const formData = new FormData();
      formData.append("type", adminBackgroundType);

      if (adminBackgroundType == FILE_TYPE.IMAGE) {
        formData.append("files", adminBackgroundImageFile ?? nullFile);
        formData.append(
          "files",
          adminBackgroundImageFileCompressed ?? nullFile
        );
      } else {
        formData.append("files", adminBackgroundVideoFile ?? nullFile);
        formData.append(
          "files",
          adminBackgroundVideoFileCompressed ?? nullFile
        );
      }

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/login-background`);
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
          const music = data as IHomepage;
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

  const changePassword = async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: user.id, oldPassword, newPassword }),
      }
    );

    if (response.ok) {
      toast.success("Successfully updated!");
      setIsLoading(false);
      return true;
    } else {
      const data = await response.json();
      toast.error(
        data.message ? data.message : "Error occured on changing password."
      );
      setIsLoading(false);
    }
    return false;
  };

  return {
    isLoading,
    loadingProgress,
    fetchArtist,
    updateArtist,
    fetchHomeContent,
    updateHomeContent,
    fetchAdminHomeContent,
    updateAdminHomeContent,
    changePassword,
  };
};

export default useArtist;
