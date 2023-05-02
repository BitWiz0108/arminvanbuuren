import { KeyboardEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Profile from "@/components/Icons/Profile";
import Lock from "@/components/Icons/Lock";
import ButtonOutline from "@/components/ButtonOutline";
import Switch from "@/components/Switch";

import { useAuthValues } from "@/contexts/contextAuth";

import { TAG_PASSWORD, TAG_USERNAME } from "@/libs/constants";

export default function Signin() {
  const router = useRouter();
  const { isLoading, isSignedIn, signIn } = useAuthValues();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);

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
        router.push("/");
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
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

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex flex-col justify-end md:justify-center items-center bg-gradient-to-b from-activeSecondary to-activePrimary overflow-x-hidden overflow-y-auto">
        <div className="w-full h-full flex flex-col justify-end md:justify-center items-center z-10">
          <div className="w-full h-fit flex flex-col justify-end md:justify-center items-center text-primary pb-5">
            <p className="text-center text-primary text-xl font-medium mb-5">
              Administrator
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
          </div>
        </div>
      </div>

      {isLoading && <div className="loading"></div>}
    </Layout>
  );
}
