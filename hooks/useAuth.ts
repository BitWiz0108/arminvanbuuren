import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { API_BASE_URL, API_VERSION, DEFAULT_AVATAR_IMAGE, TAG_ACCESS_TOKEN } from "@/libs/constants";

import { IUser } from "@/interfaces/IUser";
import { DEFAULT_USER } from "@/interfaces/IUser";

import { getAWSSignedURL } from "@/libs/aws";

const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessToken, setAcessToken] = useState<string>("");
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>(DEFAULT_USER);

  useEffect(() => {
    if (window) {
      const accessToken = window.localStorage.getItem(TAG_ACCESS_TOKEN);

      setAcessToken(<string>accessToken);

      if (accessToken) {
        checkAuth(<string>accessToken);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async (accessToken: string) => {
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/check-auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // Admin authorization
      if (data.user.roleId != "1") {
        window.localStorage.setItem(TAG_ACCESS_TOKEN, "");

        setAcessToken("");
        setIsSignedIn(false);
        return false;
      }
      data.user.avatarImage = await getAWSSignedURL(
        data.user.avatarImage,
        DEFAULT_AVATAR_IMAGE
      );
      setUser(data.user as IUser);
      setIsSignedIn(true);

      return true;
    } else {
      setIsSignedIn(false);
    }

    return false;
  };

  const signUp = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
      }),
    });

    if (response.ok) {
      setIsLoading(false);

      toast.success("Successfully signed up!");
      return true;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on signing up.");
      } else {
        const data = await response.json();
        toast.error(
          data.message ? data.message : "Error occured on signing up."
        );
      }

      setIsLoading(false);
    }
    return false;
  };

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    const response = await fetch(`${API_BASE_URL}/${API_VERSION}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      // Admin authorization
      if (data.user.roleId == "1") {
        window.localStorage.setItem(TAG_ACCESS_TOKEN, data.accessToken);

        setAcessToken(data.accessToken);
        data.user.avatarImage = await getAWSSignedURL(
          data.user.avatarImage,
          DEFAULT_AVATAR_IMAGE
        );
        setUser(data.user);

        setIsSignedIn(true);
        setIsLoading(false);

        toast.success("Successfully signed in!");
        return true;
      } else {
        window.localStorage.setItem(TAG_ACCESS_TOKEN, "");

        setIsSignedIn(false);
        setIsLoading(false);

        toast.error("You are not administrator!");
        return false;
      }
    } else {
      if (response.status == 500) {
        toast.error("Error occured on signing in.");
      } else {
        const data = await response.json();
        toast.error(
          data.message ? data.message : "Error occured on signing in."
        );
      }
      setIsSignedIn(false);
      setIsLoading(false);
    }
    return false;
  };

  const signOut = async () => {
    window.localStorage.setItem(TAG_ACCESS_TOKEN, "");

    setAcessToken("");

    setIsSignedIn(false);
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);

    // TODO: integrate api
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/auth/resetpassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();

      setIsLoading(false);

      toast.success(data.message);
      return true;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on resetting password.");
      } else {
        const data = await response.json();
        toast.error(
          data.message ? data.message : "Error occured on resetting password."
        );
      }

      setIsLoading(false);
    }
    return false;
  };

  return {
    isLoading,
    accessToken,
    isSignedIn,
    user,
    checkAuth,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};

export default useAuth;
