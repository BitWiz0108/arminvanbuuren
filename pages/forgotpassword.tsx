import { useEffect, useState, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

import Layout from "@/components/Layout";
import ButtonOutline from "@/components/ButtonOutline";
import Input from "@/components/Input";
import Email from "@/components/Icons/Email";

import { useAuthValues } from "@/contexts/contextAuth";

import useUser from "@/hooks/useUser";

import { validateEmail } from "@/libs/utils";
import {
  DEFAULT_LOGO_IMAGE,
  FILE_TYPE,
  PLACEHOLDER_IMAGE,
} from "@/libs/constants";

import { DEFAULT_ARTIST, IArtist } from "@/interfaces/IArtist";
import { DEFAULT_HOMEPAGE, IHomepage } from "@/interfaces/IHomepage";

export default function ForgotPassword() {
  const { fetchArtistData, fetchAdminBackground } = useUser();

  const { isLoading, forgotPassword } = useAuthValues();

  const [artist, setArtist] = useState<IArtist>(DEFAULT_ARTIST);
  const [email, setEmail] = useState<string>("");
  const [logoImage, setLogoImage] = useState<string>(DEFAULT_LOGO_IMAGE);
  const [background, setBackground] = useState<IHomepage>(DEFAULT_HOMEPAGE);

  const onForgotPassword = () => {
    if (!validateEmail(email)) {
      toast.error("Please enter valid email.");
      return;
    }

    forgotPassword(email);
  };

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
      <div className="relative w-full min-h-screen flex flex-col -mt-12 justify-end md:justify-center items-center">
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
              Forgot Password
            </p>
            <div className="w-80 mb-10">
              <Input
                label=""
                placeholder="Email"
                type="email"
                value={email}
                setValue={setEmail}
                icon={<Email width={20} height={20} />}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    onForgotPassword();
                  }
                }}
              />
            </div>

            <div className="mb-5">
              <ButtonOutline
                label="SEND LINK"
                onClick={() => onForgotPassword()}
              />
            </div>

            <div className="w-full flex flex-row justify-center items-center space-x-3 mb-5">
              <Link href="/">
                <p className="text-center text-primary text-lg hover:underline transition-all duration-300 cursor-pointer">
                  Sign In
                </p>
              </Link>
            </div>
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
              <div className="absolute -left-4 -top-4 -right-4 -bottom-4">
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
