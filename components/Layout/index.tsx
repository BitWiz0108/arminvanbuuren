import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { toast } from "react-toastify";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Menu from "@/components/Icons/Menu";

import { useSizeValues } from "@/contexts/contextSize";
import { useAuthValues } from "@/contexts/contextAuth";

import useUser from "@/hooks/useUser";

import { APP_TYPE, DEFAULT_LOGO_IMAGE, SYSTEM_TYPE } from "@/libs/constants";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { fetchArtistData } = useUser();
  const { isSignedIn } = useAuthValues();
  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const [logoImage, setLogoImage] = useState<string>("");

  const {
    width,
    sidebarWidth,
    contentWidth,
    isSidebarVisible,
    setIsSidebarVisible,
    isTopbarVisible,
    setIsTopbarVisible,
  } = useSizeValues();

  useEffect(() => {
    fetchArtistData().then((data) => {
      if (data) {
        setLogoImage(data.logoImage);
      }
    });
    const timeout = setTimeout(() => {
      setFirstLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstLoading) {
      return;
    }
    if (
      router.pathname != "/" &&
      router.pathname != "/signup" &&
      router.pathname != "/forgotpassword" &&
      !router.pathname.includes("/resetpassword") &&
      !router.pathname.includes("/verifyemail")
    ) {
      if (!isSignedIn) {
        toast.warn("Please sign in.");
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoading]);

  useEffect(() => {
    setIsSidebarVisible(width >= 768);

    if (
      SYSTEM_TYPE == APP_TYPE.TYPICAL &&
      (router.pathname.includes("prayer-requests") ||
        router.pathname == "/audio" ||
        router.pathname == "/community")
    ) {
      router.push("/home");
    }

    if (
      SYSTEM_TYPE == APP_TYPE.CHRISTIAN &&
      (router.pathname == "/audio" || router.pathname == "/community")
    ) {
      router.push("/home");
    }

    if (
      SYSTEM_TYPE == APP_TYPE.CHURCH &&
      (router.pathname == "/music" || router.pathname == "/fan-club")
    ) {
      router.push("/home");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, router.pathname]);

  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Admin Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={logoImage ?? DEFAULT_LOGO_IMAGE} key="favicon" />
      </Head>

      <main className="relative w-full min-h-screen flex flex-row justify-start items-start">
        <div className="flex absolute left-5 top-5 z-20">
          <Menu
            width={35}
            height={35}
            className="cursor-pointer text-primary hover:text-secondary transition-all duration-300"
            onClick={() => {
              setIsSidebarVisible(!isSidebarVisible);
            }}
          />
        </div>

        <Topbar visible={isTopbarVisible} setVisible={setIsTopbarVisible} />
        <Sidebar visible={isSidebarVisible} setVisible={setIsSidebarVisible} />

        <div
          className="transition-all duration-300 mr-[1px]"
          style={{ width: `${sidebarWidth}px` }}
        ></div>

        <div
          className="flex flex-row h-full border-l border-x-gray-700 justify-start pt-12 items-center overflow-hidden"
          style={{
            width: `${contentWidth}px`,
          }}
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
