import React, { useState, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import moment from "moment";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings";
import TextInput from "@/components/TextInput";
import ButtonUpload from "@/components/ButtonUpload";
import RadialProgress from "@/components/RadialProgress";
import X from "@/components/Icons/X";
import Delete from "@/components/Icons/Delete";
import Reply from "@/components/Icons/Reply";
import PostTable from "@/components/PostTable";
import DateInput from "@/components/DateInput";
import RadioBoxGroup from "@/components/RadioBoxGroup";

import { useAuthValues } from "@/contexts/contextAuth";

import usePost from "@/hooks/usePost";
import useArtist from "@/hooks/useArtist";

import {
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  FILE_TYPE,
  IMAGE_SM_BLUR_DATA_URL,
} from "@/libs/constants";

import { DEFAULT_POST, IPost } from "@/interfaces/IPost";

const TextAreaInput = dynamic(() => import("@/components/TextAreaInput"), {
  ssr: false,
});

export enum FANCLUB_TAB {
  POSTS,
  ABOUTME,
  HOME,
}

export default function FanClub() {
  const { isSignedIn, user } = useAuthValues();
  const {
    isLoading: isWorkingPost,
    loadingProgress: postProgress,
    fetchPost,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    fetchReplies,
    createReply,
    deleteReply,
  } = usePost();
  const {
    isLoading: isWorkingArtist,
    loadingProgress: artistProgress,
    fetchArtist,
    updateArtist,
  } = useArtist();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDetailViewOpened, setIsDetailedViewOpened] =
    useState<boolean>(false);
  const [isReplyViewOpened, setIsReplyViewOpened] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUploaded, setImageFileUploaded] = useState<string>("");
  const [imageFileCompressed, setImageFileCompressed] = useState<File | null>(
    null
  );
  const [imageFileCompressedUploaded, setImageFileCompresseduploaded] =
    useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileUploaded, setVideoFileUploaded] = useState<string>("");
  const [videoFileCompressed, setVideoFileCompressed] = useState<File | null>(
    null
  );
  const [videoFileCompressedUploaded, setVideoFileCompressedUploaded] =
    useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [post, setPost] = useState<IPost>(DEFAULT_POST);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [tab, setTab] = useState<FANCLUB_TAB>(FANCLUB_TAB.POSTS);
  const [replyContent, setReplyContent] = useState<string>("");
  const [repliesPage, setRepliesPage] = useState<number>(1);
  const [repliesPageCount, setRepliesPageCount] = useState<number>(1);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImageFileUploaded, setBannerImageFileUploaded] =
    useState<string>("");
  const [bannerImageFileCompressed, setBannerImageFileCompressed] =
    useState<File | null>(null);
  const [
    bannerImageFileCompressedUploaded,
    setBannerImageFileCompressedUploaded,
  ] = useState<string>("");
  const [bannerVideoFile, setBannerVideoFile] = useState<File | null>(null);
  const [bannerVideoFileUploaded, setBannerVideoFileUploaded] =
    useState<string>("");
  const [bannerVideoFileCompressed, setBannerVideoFileCompressed] =
    useState<File | null>(null);
  const [
    bannerVideoFileCompressedUploaded,
    setBannerVideoFileCompressedUploaded,
  ] = useState<string>("");

  const [avatarImageFile, setAvatarImageFile] = useState<File | null>(null);
  const [avatarImageFileUploaded, setAvatarImageFileUploaded] =
    useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dob, setDob] = useState<string>(moment().format(DATETIME_FORMAT));
  const [email, setEmail] = useState<string>("");
  const [artistName, setArtistName] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [youtube, setYoutube] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [soundcloud, setSoundcloud] = useState<string>("");
  const [logoImageFile, setLogoImageFile] = useState<File | null>(null);
  const [logoImageFileUploaded, setLogoImageFileUploaded] =
    useState<string>("");
  const [bannerType, setBannerType] = useState<FILE_TYPE>(FILE_TYPE.IMAGE);
  const [postType, setPostType] = useState<FILE_TYPE>(FILE_TYPE.IMAGE);

  const handleArtistOptionChange = (value: FILE_TYPE) => {
    setBannerType(value);
  };

  const handlePostOptionChange = (value: FILE_TYPE) => {
    setPostType(value);
  };

  const profileOptions = [
    { label: "Image", value: FILE_TYPE.IMAGE },
    { label: "Video", value: FILE_TYPE.VIDEO },
  ];

  const clearFields = () => {
    setImageFile(null);
    setImageFileCompressed(null);
    setVideoFile(null);
    setVideoFileCompressed(null);
    setTitle("");
    setContent("");
  };

  const onSaveProfile = async () => {
    updateArtist(
      user.id,
      username,
      firstName,
      lastName,
      dob,
      email,
      artistName,
      website,
      description,
      address,
      mobile,
      bannerType,
      bannerImageFile,
      bannerImageFileCompressed,
      bannerVideoFile,
      bannerVideoFileCompressed,
      avatarImageFile,
      logoImageFile,
      facebook,
      twitter,
      youtube,
      instagram,
      soundcloud
    ).then((data) => {
      if (data) {
        setUsername(data.username);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setDob(data.dob ?? moment().format(DATETIME_FORMAT));
        setEmail(data.email);
        setArtistName(data.artistName);
        setWebsite(data.website);
        setDescription(data.description);
        setAddress(data.address);
        setMobile(data.mobile);
        setBannerImageFile(null);
        setAvatarImageFile(null);
        setLogoImageFile(null);
        toast.success("Successfully updated!");
      }
    });
  };

  const onConfirm = async () => {
    if (postType == FILE_TYPE.IMAGE && ((!isEditing && !imageFile) || !title)) {
      toast.warn("Please  fill the required fields.");
      return;
    } else if (
      postType == FILE_TYPE.VIDEO &&
      ((!isEditing && !videoFile) || !title)
    ) {
      toast.warn("Please fill the required fields.");
      return;
    }

    if (isEditing) {
      updatePost(
        selectedId,
        postType,
        imageFile,
        imageFileCompressed,
        videoFile,
        videoFileCompressed,
        title,
        content
      ).then((value) => {
        if (value) {
          clearFields();
          fetchPosts();
          toast.success("Successfully updated!");
        }
      });
    } else {
      createPost(
        postType,
        imageFile!,
        imageFileCompressed!,
        videoFile!,
        videoFileCompressed!,
        title,
        content
      ).then((value) => {
        if (value) {
          clearFields();
          fetchPosts();

          toast.success("Successfully added!");
        }
      });
    }

    setIsDetailedViewOpened(false);
  };

  const fetchPosts = () => {
    fetchPost(page).then((data) => {
      if (data) {
        setTotalCount(data.pages);
        setPosts(data.posts);
      }
    });
  };

  const reply = () => {
    createReply(selectedId, replyContent).then((value) => {
      if (value) {
        setPost({ ...post, replies: [...post.replies, value] });
        setReplyContent("");
      }
    });
  };

  const fetchMoreReplies = () => {
    fetchReplies(selectedId, repliesPage + 1).then((result) => {
      setPost({ ...post, replies: [...post.replies, ...result.replies] });
      setRepliesPageCount(result.pages);

      if (repliesPage < result.pages) {
        setRepliesPage((prev) => prev + 1);
      }
    });
  };

  useEffect(() => {
    if (isReplyViewOpened) {
      fetchPostById(selectedId).then((value) => {
        if (value) {
          setPost(value);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, isReplyViewOpened]);

  useEffect(() => {
    if (isSignedIn) {
      fetchPosts();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, page]);

  useEffect(() => {
    if (isSignedIn) {
      fetchArtist(user.id).then((data) => {
        if (data) {
          handleArtistOptionChange(data.bannerType);
          setUsername(data.username ?? "");
          setFirstName(data.firstName ?? "");
          setLastName(data.lastName ?? "");
          setDob(data.dob ?? moment().format(DATETIME_FORMAT));
          setEmail(data.email ?? "");
          setArtistName(data.artistName ?? "");
          setWebsite(data.website ?? "");
          setDescription(data.description ?? "");
          setAddress(data.address ?? "");
          setMobile(data.mobile ?? "");
          setBannerImageFile(null);
          setBannerImageFileUploaded(data.bannerImage);
          setBannerImageFileCompressed(null);
          setBannerImageFileUploaded(data.bannerImageCompressed);
          setBannerVideoFile(null);
          setBannerVideoFileUploaded(data.bannerVideo);
          setBannerVideoFileCompressed(null);
          setBannerVideoFileCompressedUploaded(data.bannerVideoCompressed);
          setAvatarImageFile(null);
          setAvatarImageFileUploaded(data.avatarImage);
          setFacebook(data.facebook ?? "");
          setTwitter(data.twitter ?? "");
          setYoutube(data.youtube ?? "");
          setInstagram(data.instagram ?? "");
          setSoundcloud(data.soundcloud ?? "");
          setLogoImageFile(null);
          setLogoImageFileUploaded(data.logoImage);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const tableView = (
    <div className="w-full">
      <div className="w-full flex justify-end items-center p-5">
        <div className="w-40">
          <ButtonSettings
            label="Add"
            bgColor="cyan"
            onClick={() => {
              clearFields();
              setIsEditing(false);
              setIsDetailedViewOpened(true);
            }}
          />
        </div>
      </div>
      <div className="w-full p-5">
        <PostTable
          posts={posts}
          page={page}
          setPage={(value: number) => setPage(value)}
          totalCount={totalCount}
          deletePost={(id: number) =>
            deletePost(id).then((value) => {
              if (value) {
                fetchPosts();

                toast.success("Successfully deleted!");
              }
            })
          }
          updatePost={(id: number) => {
            setIsEditing(true);
            const index = posts.findIndex((post) => post.id == id);
            if (index >= 0) {
              handlePostOptionChange(posts[index].type);
              setImageFile(null);
              setImageFileUploaded(posts[index].image);
              setImageFileCompressed(null);
              setImageFileCompresseduploaded(posts[index].imageCompressed);
              setVideoFile(null);
              setVideoFileUploaded(posts[index].video);
              setVideoFileCompressed(null);
              setVideoFileCompressedUploaded(posts[index].videoCompressed);
              setTitle(posts[index].title);
              setContent(posts[index].content);
              setPostType(posts[index].type);
              setSelectedId(id);
              setIsDetailedViewOpened(true);
            }
          }}
          replyPost={(id: number) => {
            setSelectedId(id);
            setIsReplyViewOpened(true);
          }}
        />
      </div>
    </div>
  );

  const replyView = (
    <div className="relative w-full xl:w-4/5 2xl:w-2/3 justify-center items-center p-5">
      <div className="relative mt-16 p-5 bg-[#2f363e] flex flex-col space-y-5 rounded-lg">
        <div className="absolute top-2 right-2 text-primary cursor-pointer">
          <X
            width={24}
            height={24}
            onClick={() => setIsReplyViewOpened(false)}
          />
        </div>

        <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-center space-x-0 md:space-x-2 space-y-2 md:space-y-0 py-1">
          <input
            type="text"
            placeholder="Please type what you want..."
            className="w-full md:w-auto inline-flex h-10 flex-grow rounded-md border-[0.0625rem] border-[#3e454d] p-3 text-left text-sm text-primary bg-transparent outline-none focus:outline-none"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key == "Enter") {
                if (!replyContent) {
                  toast.warn("Please type message correctly.");
                  return;
                }
                reply();
              }
            }}
          />
          <button
            className="w-full md:w-40 h-10 inline-flex justify-center items-center space-x-2 bg-bluePrimary hover:bg-blueSecondary text-primary rounded-md transition-all duration-300"
            onClick={() => {
              if (!replyContent) {
                toast.warn("Please type message correctly.");
                return;
              }
              reply();
            }}
          >
            <Reply />
            <span>Comment</span>
          </button>
        </div>

        {post.replies?.length > 0 && (
          <div className="w-full flex flex-col justify-start items-start space-y-2 mb-5">
            {post.replies.map((reply, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex justify-start items-center space-x-2 p-2 bg-third rounded-md"
                >
                  <div className="w-24 min-w-[96px] flex flex-col justify-start items-center">
                    <Image
                      className="w-8 h-8 object-cover rounded-full overflow-hidden"
                      src={reply.replier?.avatarImage ?? DEFAULT_AVATAR_IMAGE}
                      width={40}
                      height={40}
                      alt=""
                      placeholder="blur"
                      blurDataURL={IMAGE_SM_BLUR_DATA_URL}
                    />
                    <p className="w-full text-primary text-sm text-center truncate">
                      {reply.replier?.username ?? "anonymous"}
                    </p>
                  </div>
                  <div className="flex flex-grow flex-col justify-start items-start space-y-2">
                    <div className="flex flex-row w-full space-x-2 justify-start items-start">
                      <p className="w-full text-left text-sm text-primary">
                        {reply.content}
                      </p>
                      <div className="w-5 h-5 flex justify-center items-center">
                        <Delete
                          width={24}
                          height={24}
                          className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                          onClick={() => {
                            deleteReply(reply.id).then((value) => {
                              if (value) {
                                const treplies = post.replies.slice();
                                treplies.splice(index, 1);
                                setPost({ ...post, replies: treplies });
                              }
                            });
                          }}
                        />
                      </div>
                    </div>
                    <p className="w-full flex justify-end items-center text-xs text-secondary">
                      {moment(reply.createdAt).format(DATETIME_FORMAT)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="w-full flex justify-center items-center">
              {isWorkingPost ? (
                <RadialProgress width={30} height={30} />
              ) : (
                repliesPageCount > repliesPage && (
                  <button
                    className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-third rounded-full border border-secondary cursor-pointer transition-all duration-300"
                    onClick={() => fetchMoreReplies()}
                  >
                    + More
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const detailContentView = (
    <div className="relative w-full xl:w-4/5 2xl:w-2/3 justify-center items-center p-5">
      <div className="p-5 bg-[#2f363e] flex flex-col space-y-5 rounded-lg">
        <label className="text-3xl px-0 font-semibold">
          {isEditing ? "Edit" : "Add"} Post
        </label>
        <div className="flex space-x-10 lg:space-x-20">
          <div className="w-full px-0 flex flex-col lg:flex-col">
            <TextInput
              sname="Post Title *"
              label=""
              placeholder="Enter Post Title"
              type="text"
              value={title}
              setValue={setTitle}
            />
            <TextAreaInput
              id="Content"
              sname="Content"
              placeholder="Enter Content"
              value={content}
              setValue={setContent}
            />
            <RadioBoxGroup
              options={profileOptions}
              name="myRadioGroup"
              selectedValue={postType}
              onChange={(value) => handlePostOptionChange(value as FILE_TYPE)}
            />
            {postType == FILE_TYPE.IMAGE ? (
              <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2 mt-5">
                <div className="w-full flex flex-col md:flex-row justify-start items-center">
                  <ButtonUpload
                    id="upload_high_quality_image"
                    label="Upload High Quality Image *"
                    file={imageFile}
                    setFile={setImageFile}
                    fileType={FILE_TYPE.IMAGE}
                    uploaded={imageFileUploaded}
                  />
                </div>
                <div className="w-full flex flex-col md:flex-row justify-start items-center">
                  <ButtonUpload
                    id="upload_low_quality_image"
                    label="Upload Low Quality Image"
                    file={imageFileCompressed}
                    setFile={setImageFileCompressed}
                    fileType={FILE_TYPE.IMAGE}
                    uploaded={imageFileCompressedUploaded}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2 mt-5">
                <div className="w-full flex flex-col md:flex-row justify-start items-center">
                  <ButtonUpload
                    id="upload_high_quality_video"
                    label="Upload High Quality Video"
                    file={videoFile}
                    setFile={setVideoFile}
                    fileType={FILE_TYPE.VIDEO}
                    uploaded={videoFileUploaded}
                  />
                </div>
                <div className="w-full flex flex-col md:flex-row justify-start items-center">
                  <ButtonUpload
                    id="upload_low_quality_video"
                    label="Upload Low Quality Video"
                    file={videoFileCompressed}
                    setFile={setVideoFileCompressed}
                    fileType={FILE_TYPE.VIDEO}
                    uploaded={videoFileCompressedUploaded}
                  />
                </div>
              </div>
            )}
            <div className="flex space-x-2 mt-5">
              <ButtonSettings
                label="Cancel"
                onClick={() => setIsDetailedViewOpened(false)}
              />
              <ButtonSettings bgColor="cyan" label="Save" onClick={onConfirm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const aboutMe = (
    <div className="relative w-full flex flex-col justify-start items-center">
      <div className="w-full xl:w-4/5 2xl:w-2/3 p-5">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
          <RadioBoxGroup
            options={profileOptions}
            name="myRadioGroup"
            selectedValue={bannerType}
            onChange={(value) => handleArtistOptionChange(value as FILE_TYPE)}
          />
          {bannerType == FILE_TYPE.IMAGE ? (
            <div className="w-full flex flex-col justify-start items-center space-x-0 md:space-x-2">
              <ButtonUpload
                id="upload_high_quality_banner_image"
                label="Upload High Quality Banner Image *"
                file={bannerImageFile}
                setFile={setBannerImageFile}
                fileType={FILE_TYPE.IMAGE}
                uploaded={bannerImageFileUploaded}
              />
              <ButtonUpload
                id="upload_low_quality_banner_image"
                label="Upload Low Quality Banner Image"
                file={bannerImageFileCompressed}
                setFile={setBannerImageFileCompressed}
                fileType={FILE_TYPE.IMAGE}
                uploaded={bannerImageFileCompressedUploaded}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col justify-start items-center space-x-0 md:space-x-2">
              <ButtonUpload
                id="upload_high_quality_banner_video"
                label="Upload High Quality Banner Video *"
                file={bannerVideoFile}
                setFile={setBannerVideoFile}
                fileType={FILE_TYPE.VIDEO}
                uploaded={bannerVideoFileUploaded}
              />
              <ButtonUpload
                id="upload_low_quality_banner_video"
                label="Upload Low Quality Banner Video"
                file={bannerVideoFileCompressed}
                setFile={setBannerVideoFileCompressed}
                fileType={FILE_TYPE.VIDEO}
                uploaded={bannerVideoFileCompressedUploaded}
              />
            </div>
          )}

          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextInput
              sname="Username"
              label=""
              placeholder="Enter username"
              type="text"
              value={username}
              setValue={setUsername}
            />
            <TextInput
              sname="Email"
              label=""
              placeholder="Email"
              type="email"
              value={email}
              setValue={setEmail}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextInput
              sname="FirstName"
              label=""
              placeholder="Enter first name"
              type="text"
              value={firstName}
              setValue={setFirstName}
            />
            <TextInput
              sname="LastName"
              label=""
              placeholder="Enter last name"
              type="text"
              value={lastName}
              setValue={setLastName}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <DateInput
              sname="DOB"
              label=""
              placeholder="Date of birth"
              value={dob}
              setValue={setDob}
            />
            <TextInput
              sname="Artistname"
              label=""
              placeholder="Artistname"
              type="text"
              value={artistName}
              setValue={setArtistName}
            />
          </div>
          <TextAreaInput
            id="Description"
            sname="Description"
            placeholder="Enter Description"
            value={description}
            setValue={setDescription}
          />
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextInput
              sname="Address"
              label=""
              placeholder="Address"
              type="text"
              value={address}
              setValue={setAddress}
            />
            <TextInput
              sname="Phone number"
              label=""
              placeholder="Phone number"
              type="text"
              value={mobile}
              setValue={setMobile}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextInput
              sname="Website"
              label=""
              placeholder="Website"
              type="text"
              value={website}
              setValue={setWebsite}
            />
            <TextInput
              sname="facebook"
              label=""
              placeholder="facebook"
              type="text"
              value={facebook}
              setValue={setFacebook}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextInput
              sname="twitter"
              label=""
              placeholder="twitter"
              type="text"
              value={twitter}
              setValue={setTwitter}
            />
            <TextInput
              sname="youtube"
              label=""
              placeholder="youtube"
              type="text"
              value={youtube}
              setValue={setYoutube}
            />
          </div>
          <div className="w-full flex flex-col md:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextInput
              sname="instagram"
              label=""
              placeholder="instagram"
              type="text"
              value={instagram}
              setValue={setInstagram}
            />
            <TextInput
              sname="soundcloud"
              label=""
              placeholder="soundcloud"
              type="text"
              value={soundcloud}
              setValue={setSoundcloud}
            />
          </div>
          <ButtonUpload
            id="upload_avatar_image"
            label="Upload Avatar Image"
            file={avatarImageFile}
            setFile={setAvatarImageFile}
            fileType={FILE_TYPE.IMAGE}
            uploaded={avatarImageFileUploaded}
          />
          <br />
          <ButtonUpload
            id="upload_logo_image"
            label="Upload Logo Image"
            file={logoImageFile}
            setFile={setLogoImageFile}
            fileType={FILE_TYPE.IMAGE}
            uploaded={logoImageFileUploaded}
          />
          <br />
          <ButtonSettings bgColor="cyan" label="Save" onClick={onSaveProfile} />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto">
        <div className="w-full flex justify-start items-center space-x-2 pl-20 pr-5 pt-[31px] border-b border-gray-700">
          <button
            className={`inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 border-b ${
              tab == FANCLUB_TAB.POSTS
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.POSTS)}
          >
            Posts
          </button>
          <button
            className={`inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 border-b ${
              tab == FANCLUB_TAB.ABOUTME
                ? "border-primary bg-bluePrimary text-primary"
                : "border-secondary bg-transparent text-secondary hover:bg-background"
            } transition-all duration-300`}
            onClick={() => setTab(FANCLUB_TAB.ABOUTME)}
          >
            About Me
          </button>
        </div>

        {tab == FANCLUB_TAB.POSTS &&
          (isDetailViewOpened
            ? detailContentView
            : isReplyViewOpened
            ? replyView
            : tableView)}
        {tab == FANCLUB_TAB.ABOUTME && aboutMe}
      </div>

      {(isWorkingPost || isWorkingArtist) && (
        <div className="loading">
          <RadialProgress width={50} height={50} />
        </div>
      )}

      {isWorkingArtist && (
        <div className="loading w-[50px] h-[50px]">
          {artistProgress > 0 ? (
            <div className="w-20 h-20">
              <CircularProgressbar
                styles={buildStyles({
                  pathColor: "#0052e4",
                  textColor: "#ffffff",
                  trailColor: "#888888",
                })}
                value={artistProgress}
                maxValue={100}
                text={`${artistProgress}%`}
              />
            </div>
          ) : (
            <RadialProgress width={50} height={50} />
          )}
        </div>
      )}

      {isWorkingPost && (
        <div className="loading w-[50px] h-[50px]">
          {postProgress > 0 ? (
            <div className="w-20 h-20">
              <CircularProgressbar
                styles={buildStyles({
                  pathColor: "#0052e4",
                  textColor: "#ffffff",
                  trailColor: "#888888",
                })}
                value={postProgress}
                maxValue={100}
                text={`${postProgress}%`}
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
