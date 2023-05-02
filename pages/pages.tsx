import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings";
import TextInput from "@/components/TextInput";
import ButtonUpload from "@/components/ButtonUpload";

import { useAuthValues } from "@/contexts/contextAuth";

import RadialProgress from "@/components/RadialProgress";
import GalleryView from "@/components/Gallery";

import useTermsOfService from "@/hooks/useTermsOfService";
import useAbout from "@/hooks/useAbout";
import useArtist from "@/hooks/useArtist";

import { DEFAULT_HOMEPAGE } from "@/interfaces/IHomepage";
import { DEFAULT_TERMSOFSERVICE } from "@/interfaces/ITermsOfService";

const TextAreaInput = dynamic(() => import("@/components/TextAreaInput"), {
  ssr: false,
});

export enum FANCLUB_TAB {
  HOME,
  ABOUT,
  GALLERY,
  TERMS,
}

export default function FanClub() {
  const { isSignedIn } = useAuthValues();
  const {
    isLoading: isArtistWorking,
    fetchHomeContent,
    updateHomeContent,
  } = useArtist();
  const { isLoading: isAboutWorking, updateAboutContent } = useAbout();
  const {
    isLoading: isTermsWorking,
    fetchTermsContent,
    updateTermsContent,
  } = useTermsOfService();

  const [tab, setTab] = useState<FANCLUB_TAB>(FANCLUB_TAB.HOME);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string>(
    DEFAULT_HOMEPAGE.youtubeVideoUrl
  );
  const [youtubeVideoTitle, setYoutubeVideoTitle] = useState<string>(
    DEFAULT_HOMEPAGE.youtubeTitle
  );
  const [videoBackgroundFile, setVideoBackgroundFile] = useState<File | null>(
    null
  );
  const [coverImage1, setCoverImage1] = useState<File | null>(null);
  const [coverImage2, setCoverImage2] = useState<File | null>(null);
  const [termsContent, setTermsContent] = useState<string>(
    DEFAULT_TERMSOFSERVICE.content
  );

  const fetchHomeContentData = () => {
    fetchHomeContent().then((data) => {
      if (data) {
        setYoutubeVideoTitle(data.youtubeTitle);
        setYoutubeVideoUrl(data.youtubeVideoUrl);
      }
    });
  };

  const onSaveHomeContent = () => {
    if (!youtubeVideoTitle) {
      toast.warn("Please enter youtube URL.");
      return;
    }
    if (!youtubeVideoTitle) {
      toast.warn("Please enter youtube video title.");
      return;
    }
    updateHomeContent(
      youtubeVideoTitle,
      youtubeVideoUrl,
      videoBackgroundFile
    ).then((data) => {
      if (data) {
        setYoutubeVideoTitle(data.youtubeTitle);
        setYoutubeVideoUrl(data.youtubeVideoUrl);

        toast.success("Successfully saved!");
      }
    });
  };

  const onSaveAboutContent = () => {
    if (!coverImage1 && !coverImage2) {
      toast.warn("Please select at least one cover image.");
      return;
    }

    updateAboutContent(coverImage1, coverImage2).then((data) => {
      if (data) {
        setCoverImage1(null);
        setCoverImage2(null);

        toast.success("Successfully saved!");
      }
    });
  };

  const fetchTermsContentData = () => {
    fetchTermsContent().then((data) => {
      if (data) {
        setTermsContent(data.content);
      }
    });
  };

  const onSaveTermsContentData = () => {
    if (!termsContent) {
      toast.warn("Please enter content.");
      return;
    }

    updateTermsContent(termsContent).then((data) => {
      if (data) {
        setTermsContent(data.content);
        console.log("!@#", data.content);
        toast.success("Successfully saved!");
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchHomeContentData();
      fetchTermsContentData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const Gallery = <GalleryView />;

  const About = (
    <div className="relative w-full flex flex-col justify-start items-center p-5">
      <div className="w-full lg:w-2/3 p-5 ">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <ButtonUpload
            sname="Cover image1"
            label=""
            placeholder="Select BackgroundImage1"
            accept_file="image/*"
            setValue={setCoverImage1}
          />
          <ButtonUpload
            sname="Cover image2"
            label=""
            placeholder="Select BackgroundImage2"
            accept_file="image/*"
            setValue={setCoverImage2}
          />
          <br />
          <ButtonSettings
            bgColor="cyan"
            label="Save"
            onClick={onSaveAboutContent}
          />
        </div>
      </div>
    </div>
  );

  const Home = (
    <div className="relative w-full flex flex-col justify-start items-center p-5">
      <div className="w-full lg:w-2/3 p-5 ">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextInput
              sname="Youtube Video URL"
              label=""
              placeholder={DEFAULT_HOMEPAGE.youtubeVideoUrl}
              type="text"
              value={youtubeVideoUrl}
              setValue={setYoutubeVideoUrl}
            />
            <TextInput
              sname="Youtube Video Title"
              label=""
              placeholder="Add your Youtube video title"
              type="text"
              value={youtubeVideoTitle}
              setValue={setYoutubeVideoTitle}
            />
          </div>
          <ButtonUpload
            sname="Background video"
            label=""
            placeholder="Select background video file"
            accept_file="video/*"
            setValue={setVideoBackgroundFile}
          />
          <br />
          <ButtonSettings
            bgColor="cyan"
            label="Save"
            onClick={onSaveHomeContent}
          />
        </div>
      </div>
    </div>
  );

  const Terms = (
    <div className="relative w-full flex flex-col justify-start items-center p-5">
      <div className="w-full lg:w-2/3 p-5">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextAreaInput
              id="termsofservice"
              sname="Terms of service"
              placeholder="Enter terms of service here"
              value={termsContent}
              setValue={setTermsContent}
            />
          </div>
          <br />
          <ButtonSettings
            bgColor="cyan"
            label="Save"
            onClick={onSaveTermsContentData}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto">
        <div className="w-full flex justify-start items-center space-x-2 pl-20 pr-5 pt-[31px] border-b border-gray-700 overflow-x-auto overflow-y-hidden">
          <button
            className={`inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 border-b ${
              tab == FANCLUB_TAB.HOME
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.HOME)}
          >
            <span className="whitespace-nowrap">Home</span>
          </button>
          <button
            className={`inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 border-b ${
              tab == FANCLUB_TAB.ABOUT
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.ABOUT)}
          >
            <span className="whitespace-nowrap">About</span>
          </button>
          <button
            className={`inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 border-b ${
              tab == FANCLUB_TAB.GALLERY
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.GALLERY)}
          >
            <span className="whitespace-nowrap">Gallery</span>
          </button>
          <button
            className={`inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 border-b ${
              tab == FANCLUB_TAB.TERMS
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.TERMS)}
          >
            <span className="whitespace-nowrap">Terms of service</span>
          </button>
        </div>

        {tab == FANCLUB_TAB.HOME && Home}
        {tab == FANCLUB_TAB.ABOUT && About}
        {tab == FANCLUB_TAB.GALLERY && Gallery}
        {tab == FANCLUB_TAB.TERMS && Terms}
      </div>

      {(isAboutWorking || isArtistWorking || isTermsWorking) && (
        <div className="loading">
          <RadialProgress width={50} height={50} />
        </div>
      )}
    </Layout>
  );
}
