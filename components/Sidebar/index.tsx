import { useEffect } from "react";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

import styles from "./index.module.scss";

import Menu from "@/components/Icons/Menu";
import Music from "@/components/Icons/Music";
import Transaction from "@/components/Icons/Transaction";
import ButtonSidebar from "@/components/ButtonSidebar";
import Mic from "@/components/Icons/Mic";
import Album from "@/components/Icons/Album";
import ThumbUp from "@/components/Icons/ThumbUp";
import Currency from "@/components/Icons/Currency";
import Emailtemplate from "@/components/Icons/EmailTemplate";
import Home from "@/components/Icons/Home";
import User from "@/components/Icons/User";
import Subscription from "@/components/Icons/Subscription";
import Info from "@/components/Icons/Info";
import Payment from "@/components/Icons/Payment";

import { useAuthValues } from "@/contexts/contextAuth";
import { useSizeValues } from "@/contexts/contextSize";

import { SIDEBARWIDTH_SM } from "@/libs/constants";
import Setting from "../Icons/Setting";

type Props = {
  visible: boolean;
  setVisible: Function;
};

const Sidebar = ({ visible, setVisible }: Props) => {
  const router = useRouter();
  const { isSignedIn, signOut } = useAuthValues();
  const { isMobile, sidebarWidth, isSidebarCollapsed, setIsSidebarCollapsed } =
    useSizeValues();

  const goToLink = (link: string) => {
    if (isSignedIn) {
      router.push(link);
    } else {
      toast.warn("Please sign in.");
    }
  };

  useEffect(() => {
    if (!isMobile) {
      setVisible(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ width: isMobile ? SIDEBARWIDTH_SM : sidebarWidth }}
          animate={{ width: isMobile ? SIDEBARWIDTH_SM : sidebarWidth }}
          exit={{ width: 0 }}
          transition={{ duration: 0.3 }}
          className={`${styles.container} ${twMerge(
            "fixed left-0 top-0 h-fit md:h-screen bg-third rounded-br-3xl md:rounded-br-none pt-5 pb-0 md:py-5 overflow-x-hidden overflow-y-auto z-30",
            isMobile ? "border-r border-x-gray-700" : "border-none"
          )}`}
          style={{ width: `${isMobile ? SIDEBARWIDTH_SM : sidebarWidth}px` }}
        >
          <div
            className={twMerge(
              "w-full flex flex-row justify-center items-center px-0 pb-5 md:px-5 md:justify-start"
            )}
          >
            <Menu
              width={35}
              height={35}
              className="cursor-pointer text-primary hover:text-secondary"
              onClick={() => {
                if (isMobile) {
                  setVisible(!visible);
                } else {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }
              }}
            />
          </div>

          <ButtonSidebar
            active={router.pathname == "/home"}
            collapsed={isSidebarCollapsed}
            icon={<Home width={26} height={26} />}
            label="Home"
            onClick={() => goToLink("/home")}
          />
          <ButtonSidebar
            active={router.pathname == "/album"}
            collapsed={isSidebarCollapsed}
            icon={<Album width={24} height={24} />}
            label="Album"
            onClick={() => goToLink("/album")}
          />
          <ButtonSidebar
            active={router.pathname == "/music"}
            collapsed={isSidebarCollapsed}
            icon={<Music width={26} height={26} color="white" />}
            label="Music"
            onClick={() => goToLink("/music")}
          />
          <ButtonSidebar
            active={router.pathname == "/category"}
            collapsed={isSidebarCollapsed}
            icon={<Album width={24} height={24} />}
            label="Category"
            onClick={() => goToLink("/category")}
          />
          <ButtonSidebar
            active={router.pathname == "/live-stream"}
            collapsed={isSidebarCollapsed}
            icon={<Mic width={24} height={24} />}
            label="Livestream"
            onClick={() => goToLink("/live-stream")}
          />
          <ButtonSidebar
            active={router.pathname == "/fan-club"}
            collapsed={isSidebarCollapsed}
            icon={<ThumbUp width={24} height={24} />}
            label="Fan Club"
            onClick={() => goToLink("/fan-club")}
          />
          <ButtonSidebar
            active={router.pathname == "/user"}
            collapsed={isSidebarCollapsed}
            icon={<User width={24} height={24} />}
            label="User"
            onClick={() => goToLink("/user")}
          />
          <ButtonSidebar
            active={router.pathname == "/transaction"}
            collapsed={isSidebarCollapsed}
            icon={<Transaction width={24} height={24} />}
            label="Transaction"
            onClick={() => goToLink("/transaction")}
          />
          <ButtonSidebar
            active={router.pathname == "/plan"}
            collapsed={isSidebarCollapsed}
            icon={<Subscription width={24} height={24} />}
            label="Plan"
            onClick={() => goToLink("/plan")}
          />
          <ButtonSidebar
            active={router.pathname == "/currency"}
            collapsed={isSidebarCollapsed}
            icon={<Currency width={24} height={24} />}
            label="Currency"
            onClick={() => goToLink("/currency")}
          />
          <ButtonSidebar
            active={router.pathname == "/emailtemplate"}
            collapsed={isSidebarCollapsed}
            icon={<Emailtemplate width={24} height={24} />}
            label="Email"
            onClick={() => goToLink("/emailtemplate")}
          />
          <ButtonSidebar
            active={router.pathname == "/payment"}
            collapsed={isSidebarCollapsed}
            icon={<Payment width={24} height={24} />}
            label="Payment"
            onClick={() => goToLink("/payment")}
          />
          <ButtonSidebar
            active={router.pathname == "/page-settings"}
            collapsed={isSidebarCollapsed}
            icon={<Setting width={24} height={24} />}
            label="Page Settings"
            onClick={() => goToLink("/page-settings")}
          />

          <div
            className={twMerge(
              "hidden md:flex w-full flex-row justify-center items-center space-x-3 my-5",
              isSidebarCollapsed ? "invisible" : "visible"
            )}
          >
            {isSignedIn && (
              <p
                className="text-primary text-lg text-center hover:underline cursor-pointer"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                Logout
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
