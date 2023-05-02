import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import Sidebar from "@/components/Sidebar";
import Menu from "@/components/Icons/Menu";

import { useSizeValues } from "@/contexts/contextSize";
import { useAuthValues } from "@/contexts/contextAuth";
import { toast } from "react-toastify";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { isSignedIn } = useAuthValues();
  const [firstLoading, setFirstLoading] = useState<boolean>(true);

  const { width, contentWidth, isSidebarVisible, setIsSidebarVisible } =
    useSizeValues();

  useEffect(() => {
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

    if (!isSignedIn) {
      toast.warn("Please sign in.");
      router.push("/signin");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoading]);

  useEffect(() => {
    setIsSidebarVisible(width >= 768);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Admin Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
        <Sidebar visible={isSidebarVisible} setVisible={setIsSidebarVisible} />

        <div
          className="flex flex-row h-full border-l border-x-gray-700 justify-start items-center overflow-hidden"
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
