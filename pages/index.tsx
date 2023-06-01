import { KeyboardEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Profile from "@/components/Icons/Profile";
import Lock from "@/components/Icons/Lock";
import ButtonOutline from "@/components/ButtonOutline";
import Switch from "@/components/Switch";

import { useAuthValues } from "@/contexts/contextAuth";

import useUser from "@/hooks/useUser";

import {
  TAG_PASSWORD,
  TAG_USERNAME,
  DEFAULT_LOGO_IMAGE,
  FILE_TYPE,
  PLACEHOLDER_IMAGE,
} from "@/libs/constants";
import { DEFAULT_HOMEPAGE, IHomepage } from "@/interfaces/IHomepage";
import Link from "next/link";

export default function Signin() {
  const router = useRouter();
  const { isLoading, isSignedIn, signIn } = useAuthValues();
  const { fetchArtistData, fetchAdminBackground } = useUser();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const [logoImage, setLogoImage] = useState<string>(DEFAULT_LOGO_IMAGE);
  const [background, setBackground] = useState<IHomepage>(DEFAULT_HOMEPAGE);

  const onSignin = () => {
    if (isLoading) return;

    if (!username || !password) {
      toast.error("Please enter username and password correctly!");
      return;
    }

    if (rememberPassword) {
      if (window) {
        window.localStorage.setItem(TAG_USERNAME, username);
        window.localStorage.setItem(
          TAG_PASSWORD,
          window.btoa(encodeURIComponent(password))
        );
      }
    } else {
      window.localStorage.setItem(TAG_USERNAME, "");
      window.localStorage.setItem(TAG_PASSWORD, "");
    }

    const userId = username.replace(" ", "").toLowerCase().trim();
    signIn(userId, password).then((result) => {
      if (result) {
        router.push("/home");
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/home");
    } else {
      if (window) {
        let username = window.localStorage.getItem(TAG_USERNAME);
        let password = window.localStorage.getItem(TAG_PASSWORD);
        if (password) {
          try {
            password = decodeURIComponent(window.atob(password));
          } catch (e) {
            console.log(e);
            password = "";
          }
        }
        setUsername(username ?? "");
        setPassword(password ?? "");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, router]);

  useEffect(() => {
    fetchArtistData().then((value) => {
      if (value) {
        setLogoImage(value.logoImage);
      }
    });

    fetchAdminBackground().then((value) => {
      if (value) {
        setBackground(value);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex flex-col justify-end md:justify-center items-center bg-gradient-to-b from-activeSecondary to-activePrimary -mt-12 overflow-x-hidden overflow-y-auto">
        <div className="w-full h-full flex flex-col justify-end md:justify-center items-center z-10">
          <div className="w-full h-fit flex flex-col justify-end md:justify-center items-center text-primary pb-5">
            <h3 className="text-center text-primary text-2xl mb-2">
              <Image
                className="w-56 object-cover mb-5"
                src={logoImage ?? DEFAULT_LOGO_IMAGE}
                width={311}
                height={220}
                alt=""
                priority
              />
            </h3>
            <p className="text-center text-primary text-xl font-medium mb-5">
              Artist Dashboard
            </p>
            <div className="w-80 mb-5">
              <Input
                label=""
                placeholder="Username"
                type="text"
                value={username}
                setValue={setUsername}
                icon={<Profile width={20} height={20} />}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    onSignin();
                  }
                }}
              />
            </div>
            <div className="w-80 mb-10">
              <Input
                label=""
                placeholder="Password"
                type="password"
                value={password}
                setValue={setPassword}
                icon={<Lock width={20} height={20} />}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    onSignin();
                  }
                }}
              />
            </div>

            <div className="relative w-full flex justify-center items-center mb-5">
              <Switch
                checked={rememberPassword}
                setChecked={setRememberPassword}
                label="Remember Password?&nbsp;&nbsp;&nbsp;&nbsp;"
                labelPos="left"
              />
            </div>

            <div className="mb-5">
              <ButtonOutline label="LOGIN" onClick={() => onSignin()} />
            </div>
            <Link href="/forgotpassword">
              <p className="text-center text-primary text-lg hover:underline transition-all duration-300 cursor-pointer">
                Forgot Your Password?
              </p>
            </Link>
          </div>
        </div>

        <div className="absolute left-0 top-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -left-4 -top-4 -right-4 -bottom-4">
            {background.type == FILE_TYPE.IMAGE ? (
              <Image
                src={background.backgroundImage ?? PLACEHOLDER_IMAGE}
                width={1600}
                height={900}
                className="w-full h-full object-cover object-center"
                alt=""
              />
            ) : (
              <div className="absolute -left-4 -top-4 -right-4 -bottom-4 filter blur-[5px]">
                <video
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  src={background.backgroundVideo}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isLoading && <div className="loading"></div>}
    </Layout>
  );
}
