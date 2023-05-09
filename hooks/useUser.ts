import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { getAWSSignedURL } from "@/libs/aws";
import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_AVATAR_IMAGE,
  GENDER,
} from "@/libs/constants";

import { IUser } from "@/interfaces/IUser";
import { DEFAULT_COUNTRY, ICountry } from "@/interfaces/ICountry";
import { DEFAULT_STATE, IState } from "@/interfaces/IState";
import { ICity } from "@/interfaces/ICity";

const useUser = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUsers = async (page: number, limit: number = 30) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/users?page=${page}&limit=${limit}`,
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
      const users = data.users as Array<IUser>;
      const pages = Number(data.pages);

      const promises = users.map((user) => {
        return getAWSSignedURL(user.avatarImage, DEFAULT_AVATAR_IMAGE);
      });
      const images = await Promise.all(promises);
      users.forEach((user, index) => (user.avatarImage = images[index]));

      return { users, pages };
    }

    setIsLoading(false);
    return { users: [], pages: 0 };
  };

  const updateUser = async (
    id: number | null,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    avatarImageFile: File | null,
    gender: GENDER,
    dob: string,
    status: boolean,
    address: string,
    country: string,
    state: string,
    city: string,
    zipcode: string
  ) => {
    setIsLoading(true);

    const formData = new FormData();
    if (id) formData.append("id", id.toString());
    else formData.append("id", "");
    formData.append("username", username.toString());
    formData.append("firstName", firstName.toString());
    formData.append("lastName", lastName.toString());
    formData.append("email", email.toString());
    if (avatarImageFile) {
      formData.append("avatarImageFile", avatarImageFile);
    }
    formData.append("gender", gender.toString());
    formData.append("dob", dob.toString());
    formData.append("status", status.toString());
    formData.append("address", address.toString());
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("zipcode", zipcode.toString());

    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/admin/users`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const user = data as IUser;
      user.avatarImage = await getAWSSignedURL(
        user.avatarImage,
        DEFAULT_AVATAR_IMAGE
      );

      return user;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating user.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const deleteUser = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/users?id=${id}`,
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

  const fetchCountries = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/profile/countries`,
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
      const countries = data as Array<ICountry>;

      setIsLoading(false);
      return countries;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchStates = async (countryId: number | null) => {
    if (countryId == DEFAULT_COUNTRY.id) return [];

    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/profile/states?countryId=${countryId}`,
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
      const states = data as Array<IState>;

      setIsLoading(false);
      return states;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchCities = async (stateId: number | null) => {
    if (stateId == DEFAULT_STATE.id) return [];

    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/profile/cities?stateId=${stateId}`,
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
      const cities = data as Array<ICity>;

      setIsLoading(false);
      return cities;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchLocation = async (zipcode: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zipcode}&key=AIzaSyD1WyLhwNkzGPKEGYK_WJzunFEv94ZC1vY`
      );

      const data = await response.json();
      if (data.results.length > 0) {
        const result = data.results[0];

        const country = result.address_components.find((component: any) =>
          component.types.includes("country")
        )?.long_name;

        const state = result.address_components.find((component: any) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name;

        const city = result.address_components.find((component: any) =>
          component.types.includes("locality")
        )?.long_name;

        setIsLoading(false);
        return { country, state, city };
      }
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
    return null;
  };

  return {
    isLoading,
    fetchUsers,
    updateUser,
    deleteUser,
    fetchCountries,
    fetchStates,
    fetchCities,
    fetchLocation,
  };
};

export default useUser;
