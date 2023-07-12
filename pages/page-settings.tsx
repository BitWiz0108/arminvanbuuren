import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  FILE_TYPE,
  OAUTH_PROVIDER,
  PLACEHOLDER_IMAGE,
  UPLOAD_TYPE,
} from "@/libs/constants";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings";
import TextInput from "@/components/TextInput";
import ButtonUpload from "@/components/ButtonUpload";
import RadialProgress from "@/components/RadialProgress";
import GalleryView from "@/components/Gallery";
import RadioBoxGroup from "@/components/RadioBoxGroup";

import { useAuthValues } from "@/contexts/contextAuth";

import useTermsOfService from "@/hooks/useTermsOfService";
import useAbout from "@/hooks/useAbout";
import useArtist from "@/hooks/useArtist";
import useOauth from "@/hooks/useOauth";

import { DEFAULT_TERMSOFSERVICE } from "@/interfaces/ITermsOfService";

const TextAreaInput = dynamic(() => import("@/components/TextAreaInput"), {
  ssr: false,
});

export enum FANCLUB_TAB {
  FAN_HOME,
  ADMIN_HOME,
  ABOUT,
  GALLERY,
  TERMS,
  OAUTHSETTINGS,
  SUBSCRIPTION_MODAL,
}

export default function PageSettings() {
  const { isSignedIn, user } = useAuthValues();

  const {
    isLoading: isArtistWorking,
    loadingProgress: artistLoadingProgress,
    fetchHomeContent,
    updateHomeContent,
    fetchAdminHomeContent,
    updateAdminHomeContent,
  } = useArtist();

  const { fetchOauthSettings, updateOauthSettings } = useOauth();

  const {
    isLoading: isAboutWorking,
    loadingProgress: aboutLoadingProgress,
    fetchAboutContent,
    updateAboutContent,
    updateConnectContent,
  } = useAbout();
  const {
    isLoading: isTermsWorking,
    fetchTermsContent,
    updateTermsContent,
    fetchSubscriptionContent,
    updateSubscriptionContent,
  } = useTermsOfService();

  const [tab, setTab] = useState<FANCLUB_TAB>(FANCLUB_TAB.FAN_HOME);

  const [backgroundType, setBackgroundType] = useState<FILE_TYPE>(
    FILE_TYPE.VIDEO
  );

  const [adminBackgroundType, setAdminBackgroundType] = useState<FILE_TYPE>(
    FILE_TYPE.IMAGE
  );

  const [backgroundVideoFile, setBackgroundVideoFile] = useState<File | null>(
    null
  );
  const [backgroundVideoFileUrl, setBackgroundVideoFileUrl] =
    useState<string>("");
  const [backgroundVideoFileUploaded, setBackgroundVideoFileUploaded] =
    useState<string>("");

  const [backgroundVideoFileCompressed, setBackgroundVideoFileCompressed] =
    useState<File | null>(null);
  const [
    backgroundvideoFileCompressedUrl,
    setBackgroundVideoFileCompressedUrl,
  ] = useState<string>("");
  const [
    backgroundVideoFileCompressedUploaded,
    setBackgroundVideoFileCompressedUploaded,
  ] = useState<string>("");
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(
    null
  );
  const [backgroundImageFileUploaded, setBackgroundImageFileUploaded] =
    useState<string>("");
  const [backgroundImageFileCompressed, setBackgroundImageFileCompressed] =
    useState<File | null>(null);
  const [
    backgroundImageFileCompressedUploaded,
    setBackgroundImageFileCompressedUploaded,
  ] = useState<string>("");

  const [signInBackgroundVideoFile, setSignInBackgroundVideoFile] =
    useState<File | null>(null);
  const [signInBackgroundVideoFileUrl, setSignInBackgroundVideoFileUrl] =
    useState<string>("");
  const [
    signInBackgroundVideoFileUploaded,
    setSignInBackgroundVideoFileUploaded,
  ] = useState<string>("");

  const [
    signInBackgroundVideoFileCompressed,
    setSignInBackgroundVideoFileCompressed,
  ] = useState<File | null>(null);
  const [
    signInBackgroundVideoFileCompressedUrl,
    setSignInBackgroundVideoFileCompressedUrl,
  ] = useState<string>("");
  const [
    signInBackgroundVideoFileCompressedUploaded,
    setSignInBackgroundVideoFileCompressedUploaded,
  ] = useState<string>("");
  const [signInBackgroundImageFile, setSignInBackgroundImageFile] =
    useState<File | null>(null);
  const [
    signInBackgroundImageFileUploaded,
    setSignInBackgroundImageFileUploaded,
  ] = useState<string>("");
  const [
    signInBackgroundImageFileCompressed,
    setSignInBackgroundImageFileCompressed,
  ] = useState<File | null>(null);
  const [
    signInBackgroundImageFileCompressedUploaded,
    setSignInBackgroundImageFileCompressedUploaded,
  ] = useState<string>("");

  const [signInDescription, setSignInDescription] = useState<string>("");
  const [homePageDescription, setHomePageDescription] = useState<string>("");

  const [adminBackgroundVideoFile, setAdminBackgroundVideoFile] =
    useState<File | null>(null);
  const [
    adminBackgroundVideoFileUploaded,
    setAdminBackgroundVideoFileUploaded,
  ] = useState<string>("");

  const [
    adminBackgroundVideoFileCompressed,
    setAdminBackgroundVideoFileCompressed,
  ] = useState<File | null>(null);
  const [
    adminBackgroundVideoFileCompressedUploaded,
    setAdminBackgroundVideoFileCompressedUploaded,
  ] = useState<string>("");

  const [adminBackgroundImageFile, setAdminBackgroundImageFile] =
    useState<File | null>(null);
  const [
    adminBackgroundImageFileUploaded,
    setAdminBackgroundImageFileUploaded,
  ] = useState<string>("");
  const [
    adminBackgroundImageFileCompressed,
    setAdminBackgroundImageFileCompressed,
  ] = useState<File | null>(null);

  const [
    adminBackgroundImageFileCompressedUploaded,
    setAdminBackgroundImageFileCompressedUploaded,
  ] = useState<string>("");

  const [coverImage1, setCoverImage1] = useState<File | null>(null);
  const [coverImage1Uploaded, setCoverImage1Uploaded] = useState<string>("");
  const [coverImage2, setCoverImage2] = useState<File | null>(null);
  const [coverImage2Uploaded, setCoverImage2Uploaded] = useState<string>("");
  const [termsContent, setTermsContent] = useState<string>(
    DEFAULT_TERMSOFSERVICE.content
  );
  const [facebookAppId, setFacebookAppId] = useState<string>("");
  const [facebookAppSecret, setFacebookAppSecret] = useState<string>("");
  const [appleAppId, setAppleAppId] = useState<string>("");
  const [appleAppSecret, setAppleAppSecret] = useState<string>("");
  const [googleAppId, setGoogleAppId] = useState<string>("");
  const [googleAppSecret, setGoogleAppSecret] = useState<string>("");
  const [oauthProvider, setOauthProvider] = useState<OAUTH_PROVIDER>(
    OAUTH_PROVIDER.FACEBOOK
  );
  const [subscriptionModalDescription, setSubscriptionModalDescription] =
    useState<string>("");

  const fanBackgroundTypeChange = (value: FILE_TYPE) => {
    setBackgroundType(value);
  };
  const adminBackgroundTypeChange = (value: FILE_TYPE) => {
    setAdminBackgroundType(value);
  };
  const [connectContent, setConnectContent] = useState<string>("");
  const [uploadType, setUploadType] = useState<UPLOAD_TYPE>(UPLOAD_TYPE.FILE);

  const fanRadioBoxOptions = [
    { label: "Image", value: FILE_TYPE.IMAGE },
    { label: "Video", value: FILE_TYPE.VIDEO },
  ];

  const adminRadioBoxOptions = [
    { label: "Image", value: FILE_TYPE.IMAGE },
    { label: "Video", value: FILE_TYPE.VIDEO },
  ];

  const UploadType = [
    { label: "File", value: UPLOAD_TYPE.FILE },
    { label: "URL", value: UPLOAD_TYPE.URL },
  ];

  const handlePostOptionChange = (value: UPLOAD_TYPE) => {
    setUploadType(value);
  };

  const fetchHomeContentData = () => {
    fetchHomeContent().then((data) => {
      if (data) {
        fanBackgroundTypeChange(data.type);
        setBackgroundImageFileUploaded(data.backgroundImage);
        setBackgroundImageFileCompressedUploaded(
          data.backgroundImageCompressed
        );
        setBackgroundVideoFileUploaded(data.backgroundVideo);
        setBackgroundVideoFileCompressedUploaded(
          data.backgroundVideoCompressed
        );
        setBackgroundVideoFileUrl(data.backgroundVideo);
        setBackgroundVideoFileCompressedUrl(data.backgroundVideoCompressed);
        setBackgroundImageFileUploaded(data.backgroundImage);
        setAdminBackgroundImageFileCompressedUploaded(
          data.backgroundImageCompressed
        );
        setSignInBackgroundVideoFileUploaded(data.signInBackgroundVideo);
        setSignInBackgroundVideoFileCompressedUploaded(
          data.signInBackgroundVideoCompressed
        );
        setSignInBackgroundVideoFileUrl(data.signInBackgroundVideo);
        setSignInBackgroundVideoFileCompressedUrl(
          data.signInBackgroundVideoCompressed
        );
        setSignInBackgroundImageFileUploaded(data.signInBackgroundImage);
        setSignInBackgroundImageFileCompressedUploaded(
          data.signInBackgroundImageCompressed
        );
        setHomePageDescription(data.homePageDescription);
        setSignInDescription(data.signInDescription);
      }
    });
  };

  const fetchAdminHomeContentData = () => {
    fetchAdminHomeContent().then((data) => {
      if (data) {
        adminBackgroundTypeChange(data.type);
        setAdminBackgroundImageFileUploaded(data.backgroundImage);
        setAdminBackgroundImageFileCompressedUploaded(
          data.backgroundImageCompressed
        );
        setAdminBackgroundVideoFileUploaded(data.backgroundVideo);
        setAdminBackgroundVideoFileCompressedUploaded(
          data.backgroundVideoCompressed
        );
      }
    });
  };

  const fetchOAuthContentData = () => {
    fetchOauthSettings().then((data) => {
      if (data) {
        setFacebookAppId(data.facebookAppId);
        setFacebookAppSecret(data.facebookAppSecret);
        setAppleAppId(data.appleAppId);
        setAppleAppSecret(data.appleAppSecret);
        setGoogleAppId(data.googleAppId);
        setGoogleAppSecret(data.googleAppSecret);
      }
    });
  };

  const fetchAboutPageData = () => {
    fetchAboutContent().then((data) => {
      if (data) {
        setCoverImage1Uploaded(data.coverImage1 ?? PLACEHOLDER_IMAGE);
        setCoverImage2Uploaded(data.coverImage2 ?? PLACEHOLDER_IMAGE);
        setConnectContent(data.content);
      }
    });
  };

  const onSaveHomeContent = () => {
    // if (backgroundType == FILE_TYPE.VIDEO) {
    //   if (!backgroundVideoFile) {
    //     toast.warn("Please select video file.");
    //     return;
    //   }
    // } else {
    //   if (!backgroundImageFile) {
    //     toast.warn("Please select image file.");
    //     return;
    //   }
    // }

    updateHomeContent(
      backgroundType,
      uploadType,
      uploadType == UPLOAD_TYPE.FILE
        ? backgroundVideoFile
        : backgroundVideoFileUrl,
      uploadType == UPLOAD_TYPE.FILE
        ? backgroundVideoFileCompressed
        : backgroundvideoFileCompressedUrl,
      backgroundImageFile,
      backgroundImageFileCompressed,
      uploadType == UPLOAD_TYPE.FILE
        ? signInBackgroundVideoFile
        : signInBackgroundVideoFileUrl,
      uploadType == UPLOAD_TYPE.FILE
        ? signInBackgroundVideoFileCompressed
        : signInBackgroundVideoFileCompressedUrl,
      signInBackgroundImageFile,
      signInBackgroundImageFileCompressed,
      homePageDescription,
      signInDescription
    ).then((data) => {
      if (data) {
        toast.success("Successfully saved!");
      }
    });
  };

  const onSaveFacebookContent = () => {
    if (!facebookAppId || !facebookAppSecret) {
      toast.warn("Please input facebook App Id and App Secret.");
      return;
    }

    updateOauthSettings(
      OAUTH_PROVIDER.FACEBOOK,
      facebookAppId,
      facebookAppSecret
    ).then((data) => {
      if (data) {
        if (data.provider == OAUTH_PROVIDER.FACEBOOK) {
          setFacebookAppId(data.appId);
          setFacebookAppSecret(data.appSecret);
        } else if (data.provider == OAUTH_PROVIDER.APPLE) {
          setAppleAppId(data.appId);
          setFacebookAppSecret(data.appSecret);
        } else if (data.provider == OAUTH_PROVIDER.GOOGLE) {
          setGoogleAppId(data.appId);
          setGoogleAppSecret(data.appSecret);
        }
        toast.success("Successfully saved!");
      }
    });
  };

  const onSaveAppleContent = () => {
    if (!appleAppId || !appleAppSecret) {
      toast.warn("Please input Apple App Id and App Secret.");
      return;
    }

    updateOauthSettings(OAUTH_PROVIDER.APPLE, appleAppId, appleAppSecret).then(
      (data) => {
        if (data) {
          if (data.provider == OAUTH_PROVIDER.FACEBOOK) {
            setFacebookAppId(data.appId);
            setFacebookAppSecret(data.appSecret);
          } else if (data.provider == OAUTH_PROVIDER.APPLE) {
            setAppleAppId(data.appId);
            setAppleAppSecret(data.appSecret);
          } else if (data.provider == OAUTH_PROVIDER.GOOGLE) {
            setGoogleAppId(data.appId);
            setGoogleAppSecret(data.appSecret);
          }
          toast.success("Successfully saved!");
        }
      }
    );
  };

  const onSaveGoogleContent = () => {
    if (!googleAppId || !googleAppSecret) {
      toast.warn("Please input Google App Id and App Secret.");
      return;
    }

    updateOauthSettings(
      OAUTH_PROVIDER.GOOGLE,
      googleAppId,
      googleAppSecret
    ).then((data) => {
      if (data) {
        if (data.provider == OAUTH_PROVIDER.FACEBOOK) {
          setFacebookAppId(data.appId);
          setFacebookAppSecret(data.appSecret);
        } else if (data.provider == OAUTH_PROVIDER.APPLE) {
          setAppleAppId(data.appId);
          setFacebookAppSecret(data.appSecret);
        } else if (data.provider == OAUTH_PROVIDER.GOOGLE) {
          setGoogleAppId(data.appId);
          setGoogleAppSecret(data.appSecret);
        }
        toast.success("Successfully saved!");
      }
    });
  };

  const onSaveAdminHomeContent = () => {
    if (adminBackgroundType == FILE_TYPE.VIDEO) {
      if (!adminBackgroundVideoFile) {
        toast.warn("Please select video file.");
        return;
      }
    } else {
      if (!adminBackgroundImageFile) {
        toast.warn("Please select image file.");
        return;
      }
    }

    updateAdminHomeContent(
      adminBackgroundType,
      adminBackgroundVideoFile,
      adminBackgroundVideoFileCompressed,
      adminBackgroundImageFile,
      adminBackgroundImageFileCompressed
    ).then((data) => {
      if (data) {
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
        toast.success("Successfully saved!");
      }
    });
  };

  const onSaveConnectContent = () => {
    if (!connectContent) {
      toast.warn("Please enter content.");
      return;
    }

    updateConnectContent(connectContent).then((data) => {
      if (data) {
        setConnectContent(data.content);
        toast.success("Successfully saved!");
      }
    });
  };

  const fetchSubscriptionModalContentData = () => {
    fetchSubscriptionContent(user.id).then((data) => {
      if (data) {
        setSubscriptionModalDescription(data.content);
      }
    });
  };

  const onSaveSubscriptionModalContentData = () => {
    if (!subscriptionModalDescription) {
      toast.warn("Please enter content.");
      return;
    }

    updateSubscriptionContent(user.id, subscriptionModalDescription).then(
      (data) => {
        if (data) {
          setSubscriptionModalDescription(data.content);
          toast.success("Successfully saved!");
        }
      }
    );
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchAdminHomeContentData();
      fetchHomeContentData();
      fetchAboutPageData();
      fetchTermsContentData();
      fetchOAuthContentData();
      fetchSubscriptionModalContentData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const Gallery = <GalleryView />;

  const About = (
    <div className="relative w-full flex flex-col justify-start items-center p-5">
      <div className="w-full lg:w-2/3 p-5 ">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <ButtonUpload
            id="upload_cover_image_1"
            label="Upload Cover Image1"
            file={coverImage1}
            setFile={setCoverImage1}
            fileType={FILE_TYPE.IMAGE}
            uploaded={coverImage1Uploaded}
          />
          <ButtonUpload
            id="upload_cover_image_2"
            label="Upload Cover Image2"
            file={coverImage2}
            setFile={setCoverImage2}
            fileType={FILE_TYPE.IMAGE}
            uploaded={coverImage2Uploaded}
          />
          <br />
          <ButtonSettings
            bgColor="cyan"
            label="Save"
            onClick={onSaveAboutContent}
          />
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextInput
              sname="Connect Text"
              label=""
              placeholder="Enter connect text here"
              type="text"
              value={connectContent}
              setValue={setConnectContent}
            />
          </div>
          <ButtonSettings
            bgColor="cyan"
            label="Save"
            onClick={onSaveConnectContent}
          />
        </div>
      </div>
    </div>
  );

  const Home = (
    <div className="relative w-full flex flex-col justify-start items-center p-5">
      <div className="w-full lg:w-2/3 p-5 ">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <RadioBoxGroup
            options={fanRadioBoxOptions}
            name="myRadioGroup"
            selectedValue={backgroundType}
            onChange={(value) => fanBackgroundTypeChange(value as FILE_TYPE)}
          />
          {backgroundType == FILE_TYPE.VIDEO ? (
            <div>
              <RadioBoxGroup
                options={UploadType}
                name="UploadType RadioBox"
                selectedValue={uploadType}
                onChange={(value) =>
                  handlePostOptionChange(value as UPLOAD_TYPE)
                }
              />

              <ButtonUpload
                id="upload_high_quality_background_video"
                label="Upload High Quality Home Background Video *"
                file={
                  uploadType == UPLOAD_TYPE.FILE
                    ? backgroundVideoFile
                    : backgroundVideoFileUrl
                }
                setFile={
                  uploadType == UPLOAD_TYPE.FILE
                    ? setBackgroundVideoFile
                    : setBackgroundVideoFileUrl
                }
                fileType={FILE_TYPE.VIDEO}
                uploaded={backgroundVideoFileUploaded}
                uploadType={uploadType}
              />

              <ButtonUpload
                id="upload_low_quality_background_video"
                label="Upload Low Quality Home Background Video"
                file={
                  uploadType == UPLOAD_TYPE.FILE
                    ? backgroundVideoFileCompressed
                    : backgroundvideoFileCompressedUrl
                }
                setFile={
                  uploadType == UPLOAD_TYPE.FILE
                    ? setBackgroundVideoFileCompressed
                    : setBackgroundVideoFileCompressedUrl
                }
                fileType={FILE_TYPE.VIDEO}
                uploaded={backgroundVideoFileCompressedUploaded}
                uploadType={uploadType}
              />
            </div>
          ) : (
            <div>
              <ButtonUpload
                id="upload_high_quality_background_image"
                label="Upload High Quality Background Image*"
                file={backgroundImageFile}
                setFile={setBackgroundImageFile}
                fileType={FILE_TYPE.IMAGE}
                uploaded={backgroundImageFileUploaded}
              />
              <ButtonUpload
                id="upload_low_quality_background_image"
                label="Upload Low Quality Background Image*"
                file={backgroundImageFileCompressed}
                setFile={setBackgroundImageFileCompressed}
                fileType={FILE_TYPE.IMAGE}
                uploaded={backgroundImageFileCompressedUploaded}
              />
            </div>
          )}
          <br />

          {backgroundType == FILE_TYPE.VIDEO ? (
            <div>
              <ButtonUpload
                id="upload_high_quality_signin_background_video"
                label="Upload High Quality SignIn Background Video *"
                file={
                  uploadType == UPLOAD_TYPE.FILE
                    ? signInBackgroundVideoFile
                    : signInBackgroundVideoFileUrl
                }
                setFile={
                  uploadType == UPLOAD_TYPE.FILE
                    ? setSignInBackgroundVideoFile
                    : setSignInBackgroundVideoFileUrl
                }
                fileType={FILE_TYPE.VIDEO}
                uploaded={signInBackgroundVideoFileUploaded}
                uploadType={uploadType}
              />

              <ButtonUpload
                id="upload_low_quality_signin_background_video"
                label="Upload Low Quality SignIn Background Video"
                file={
                  uploadType == UPLOAD_TYPE.FILE
                    ? signInBackgroundVideoFileCompressed
                    : signInBackgroundVideoFileCompressedUrl
                }
                setFile={
                  uploadType == UPLOAD_TYPE.FILE
                    ? setSignInBackgroundVideoFileCompressed
                    : setSignInBackgroundVideoFileCompressedUrl
                }
                fileType={FILE_TYPE.VIDEO}
                uploaded={signInBackgroundVideoFileCompressedUploaded}
                uploadType={uploadType}
              />
            </div>
          ) : (
            <div>
              <ButtonUpload
                id="upload_high_quality_signin_background_image"
                label="Upload High Quality SignIn Background Image*"
                file={signInBackgroundImageFile}
                setFile={setSignInBackgroundImageFile}
                fileType={FILE_TYPE.IMAGE}
                uploaded={signInBackgroundImageFileUploaded}
              />
              <ButtonUpload
                id="upload_low_quality_signin_background_image"
                label="Upload Low Quality SignIn Background Image*"
                file={signInBackgroundImageFileCompressed}
                setFile={setSignInBackgroundImageFileCompressed}
                fileType={FILE_TYPE.IMAGE}
                uploaded={signInBackgroundImageFileCompressedUploaded}
              />
            </div>
          )}
          <br />
          <TextInput
            sname="Homepage Text"
            label=""
            placeholder="Enter Homepage Description"
            type="text"
            value={homePageDescription}
            setValue={setHomePageDescription}
          />
          <TextInput
            sname="Signin Page Text"
            label=""
            placeholder="Enter Signin Page Description"
            type="text"
            value={signInDescription}
            setValue={setSignInDescription}
          />
          <ButtonSettings
            bgColor="cyan"
            label="Save"
            onClick={onSaveHomeContent}
          />
        </div>
      </div>
    </div>
  );

  const AdminHome = (
    <div className="relative w-full flex flex-col justify-start items-center p-5">
      <div className="w-full lg:w-2/3 p-5 ">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <RadioBoxGroup
            options={adminRadioBoxOptions}
            name="myRadioGroup"
            selectedValue={adminBackgroundType}
            onChange={(value) => adminBackgroundTypeChange(value as FILE_TYPE)}
          />
          {adminBackgroundType == FILE_TYPE.VIDEO ? (
            <div>
              <ButtonUpload
                id="upload_high_quality_admin_background_video"
                label="Upload High Quality Admin Background Video *"
                file={adminBackgroundVideoFile}
                setFile={setAdminBackgroundVideoFile}
                fileType={FILE_TYPE.VIDEO}
                uploaded={adminBackgroundVideoFileUploaded}
              />
              <ButtonUpload
                id="upload_low_quality_admin_background_video"
                label="Upload Low Quality Admin Background Video *"
                file={adminBackgroundVideoFileCompressed}
                setFile={setAdminBackgroundVideoFileCompressed}
                fileType={FILE_TYPE.VIDEO}
                uploaded={adminBackgroundVideoFileCompressedUploaded}
              />
            </div>
          ) : (
            <div>
              <ButtonUpload
                id="upload_high_quality_admin_background_image"
                label="Upload High Quality Admin Background Image *"
                file={adminBackgroundImageFile}
                setFile={setAdminBackgroundImageFile}
                fileType={FILE_TYPE.IMAGE}
                uploaded={adminBackgroundImageFileUploaded}
              />
              <ButtonUpload
                id="upload_low_quality_admin_background_image"
                label="Upload Low Quality Admin Background Image *"
                file={adminBackgroundImageFileCompressed}
                setFile={setAdminBackgroundImageFileCompressed}
                fileType={FILE_TYPE.IMAGE}
                uploaded={adminBackgroundImageFileCompressedUploaded}
              />
            </div>
          )}
          <br />
          <ButtonSettings
            bgColor="cyan"
            label="Save"
            onClick={onSaveAdminHomeContent}
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
          <ButtonSettings
            bgColor="cyan"
            label="Save"
            onClick={onSaveTermsContentData}
          />
        </div>
      </div>
    </div>
  );

  const OAuth = (
    <div className="relative w-full flex flex-col justify-start items-center p-5">
      <div className="w-full lg:w-2/3 p-5 ">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <h3 className="text-2xl xl:text-3xl font-semibold text-gray-50">
            Facebook
          </h3>
          <TextInput
            sname="Facebook App Id"
            label=""
            placeholder="Facebook App Id"
            type="text"
            value={facebookAppId}
            setValue={setFacebookAppId}
          />
          <TextInput
            sname="Facebook App Secret"
            label=""
            placeholder="Facebook App Secret"
            type="text"
            value={facebookAppSecret}
            setValue={setFacebookAppSecret}
          />
          <br />
          <div className="w-full">
            <ButtonSettings
              bgColor="cyan"
              label="Save"
              onClick={onSaveFacebookContent}
            />
          </div>
        </div>

        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <h3 className="text-2xl xl:text-3xl font-semibold text-gray-50">
            Apple
          </h3>
          <TextInput
            sname="Apple App Id"
            label=""
            placeholder="Apple App Id"
            type="text"
            value={appleAppId}
            setValue={setAppleAppId}
          />
          <TextInput
            sname="Apple App Secret"
            label=""
            placeholder="Apple App Secret"
            type="text"
            value={appleAppSecret}
            setValue={setAppleAppSecret}
          />
          <br />
          <div className="w-full">
            <ButtonSettings
              bgColor="cyan"
              label="Save"
              onClick={onSaveAppleContent}
            />
          </div>
        </div>

        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <h3 className="text-2xl xl:text-3xl font-semibold text-gray-50">
            Google
          </h3>
          <TextInput
            sname="Google App Id"
            label=""
            placeholder="Google App Id"
            type="text"
            value={googleAppId}
            setValue={setGoogleAppId}
          />
          <TextInput
            sname="Google App Secret"
            label=""
            placeholder="Google App Secret"
            type="text"
            value={googleAppSecret}
            setValue={setGoogleAppSecret}
          />
          <br />
          <div className="w-full">
            <ButtonSettings
              bgColor="cyan"
              label="Save"
              onClick={onSaveGoogleContent}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const Subscription = (
    <div className="relative w-full flex flex-col justify-start items-center p-5">
      <div className="w-full lg:w-2/3 p-5">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextAreaInput
              id="subscriptioncontent"
              sname="Subscription Modal Description"
              placeholder="Enter Subscription Modal Description Text"
              value={subscriptionModalDescription}
              setValue={setSubscriptionModalDescription}
            />
          </div>
          <ButtonSettings
            bgColor="cyan"
            label="Save"
            onClick={onSaveSubscriptionModalContentData}
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
              tab == FANCLUB_TAB.FAN_HOME
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.FAN_HOME)}
          >
            <span className="whitespace-nowrap">Fan&apos;s Homepage</span>
          </button>
          <button
            className={`inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 border-b ${
              tab == FANCLUB_TAB.ADMIN_HOME
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.ADMIN_HOME)}
          >
            <span className="whitespace-nowrap">Admin&apos;s Homepage</span>
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

          <button
            className={`inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 border-b ${
              tab == FANCLUB_TAB.SUBSCRIPTION_MODAL
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.SUBSCRIPTION_MODAL)}
          >
            <span className="whitespace-nowrap">Subscription Modal</span>
          </button>

          <button
            className={`inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 border-b ${
              tab == FANCLUB_TAB.OAUTHSETTINGS
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.OAUTHSETTINGS)}
          >
            <span className="whitespace-nowrap">OAuth</span>
          </button>
        </div>

        {tab == FANCLUB_TAB.FAN_HOME && Home}
        {tab == FANCLUB_TAB.ADMIN_HOME && AdminHome}
        {tab == FANCLUB_TAB.ABOUT && About}
        {tab == FANCLUB_TAB.GALLERY && Gallery}
        {tab == FANCLUB_TAB.TERMS && Terms}
        {tab == FANCLUB_TAB.OAUTHSETTINGS && OAuth}
        {tab == FANCLUB_TAB.SUBSCRIPTION_MODAL && Subscription}
      </div>

      {(isAboutWorking || isArtistWorking || isTermsWorking) && (
        <div className="loading">
          <RadialProgress width={50} height={50} />
        </div>
      )}

      {isAboutWorking && (
        <div className="loading w-[50px] h-[50px]">
          {aboutLoadingProgress > 0 ? (
            <div className="w-20 h-20">
              <CircularProgressbar
                styles={buildStyles({
                  pathColor: "#0052e4",
                  textColor: "#ffffff",
                  trailColor: "#888888",
                })}
                value={aboutLoadingProgress}
                maxValue={100}
                text={`${aboutLoadingProgress}%`}
              />
            </div>
          ) : (
            <RadialProgress width={50} height={50} />
          )}
        </div>
      )}

      {isArtistWorking && (
        <div className="loading w-[50px] h-[50px]">
          {artistLoadingProgress > 0 ? (
            <div className="w-20 h-20">
              <CircularProgressbar
                styles={buildStyles({
                  pathColor: "#0052e4",
                  textColor: "#ffffff",
                  trailColor: "#888888",
                })}
                value={artistLoadingProgress}
                maxValue={100}
                text={`${artistLoadingProgress}%`}
              />
            </div>
          ) : (
            <RadialProgress width={50} height={50} />
          )}
        </div>
      )}
    </Layout>
  );
}
