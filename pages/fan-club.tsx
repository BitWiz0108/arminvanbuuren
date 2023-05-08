import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import moment from "moment";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings";
import TextInput from "@/components/TextInput";
import ButtonUpload from "@/components/ButtonUpload";
import RadialProgress from "@/components/RadialProgress";
import Edit from "@/components/Icons/Edit";
import X from "@/components/Icons/X";
import Delete from "@/components/Icons/Delete";
import Reply from "@/components/Icons/Reply";
import PostTable from "@/components/PostTable";
import DateInput from "@/components/DateInput";

import { useAuthValues } from "@/contexts/contextAuth";

import usePost from "@/hooks/usePost";
import useArtist from "@/hooks/useArtist";

import {
  DATETIME_FORMAT,
  DEFAULT_ARTIST_IMAGE,
  DEFAULT_AVATAR_IMAGE,
  DEFAULT_BANNER_IMAGE,
  IMAGE_MD_BLUR_DATA_URL,
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
  const bannerImageRef = useRef(null);
  const avatarImageRef = useRef(null);

  const { isSignedIn, user } = useAuthValues();
  const {
    isLoading: isWorkingPost,
    fetchPost,
    fetchPostById,
    createPost,
    updatePost,
    deletePost,
    fetchReplies,
    createReply,
    deleteReply,
  } = usePost();
  const { isLoading: isWorkingArtist, fetchArtist, updateArtist } = useArtist();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDetailViewOpened, setIsDetailedViewOpened] =
    useState<boolean>(false);
  const [isReplyViewOpened, setIsReplyViewOpened] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
  const [isBannerImageHover, setIsBannerImageHover] = useState<boolean>(false);
  const [isAvatarImageHover, setIsAvatarImageHover] = useState<boolean>(false);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] =
    useState<string>(DEFAULT_BANNER_IMAGE);
  const [avatarImageFile, setAvatarImageFile] = useState<File | null>(null);
  const [avatarImagePreview, setAvatarImagePreview] =
    useState<string>(DEFAULT_ARTIST_IMAGE);
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

  const clearFields = () => {
    setImageFile(null);
    setTitle("");
    setContent("");
  };

  const onSaveProfile = async () => {
    if (!username || !firstName || !lastName || !dob || !email || !address) {
      toast.warn("Please type values correctly.");
      return;
    }

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
      bannerImageFile,
      avatarImageFile,
      facebook,
      twitter,
      youtube,
      instagram,
      soundcloud,
      logoImageFile
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
        setBannerImagePreview(data.bannerImage);
        setBannerImageFile(null);
        setAvatarImagePreview(data.avatarImage);
        setAvatarImageFile(null);
        setLogoImageFile(null);
        toast.success("Successfully updated!");
      }
    });
  };

  const onConfirm = async () => {
    if ((!isEditing && !imageFile) || !title || !content) {
      toast.warn("Please type values correctly.");
      return;
    }

    if (isEditing) {
      updatePost(selectedId, imageFile, title, content).then((value) => {
        if (value) {
          clearFields();
          fetchPosts();

          toast.success("Successfully updated!");
        }
      });
    } else {
      createPost(imageFile!, title, content).then((value) => {
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
          setBannerImagePreview(data.bannerImage ?? DEFAULT_BANNER_IMAGE);
          setBannerImageFile(null);
          setAvatarImagePreview(data.avatarImage ?? DEFAULT_ARTIST_IMAGE);
          setAvatarImageFile(null);
          setFacebook(data.facebook ?? "");
          setTwitter(data.twitter ?? "");
          setYoutube(data.youtube ?? "");
          setInstagram(data.instagram ?? "");
          setSoundcloud(data.soundcloud ?? "");
          setLogoImageFile(null);
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
              setImageFile(null);
              setTitle(posts[index].title);
              setContent(posts[index].content);
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
              sname="Post Title"
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
            <ButtonUpload
              sname="Image"
              label=""
              placeholder="Select image file"
              accept_file="image/*"
              setValue={setImageFile}
            />

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
      <div
        className="relative w-full h-[260px] overflow-hidden flex justify-center items-center cursor-pointer"
        onMouseEnter={() => setIsBannerImageHover(true)}
        onMouseLeave={() => setIsBannerImageHover(false)}
        onClick={() => {
          if (bannerImageRef) {
            // @ts-ignore
            bannerImageRef.current.click();
          }
        }}
      >
        <input
          ref={bannerImageRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              if (files[0]) {
                setBannerImageFile(files[0]);

                const reader = new FileReader();
                reader.onload = () => {
                  setBannerImagePreview(reader.result as string);
                };
                reader.readAsDataURL(files[0]);
              }
            }
          }}
          accept="image/*"
        />
        <Image
          className="w-full h-full object-cover"
          src={bannerImagePreview ?? DEFAULT_BANNER_IMAGE}
          width={1600}
          height={450}
          alt=""
          placeholder="blur"
          blurDataURL={IMAGE_MD_BLUR_DATA_URL}
        />
        {isBannerImageHover && (
          <div className="absolute left-0 top-0 w-full h-full bg-[#00000088] flex justify-center items-center">
            <Edit width={26} height={26} />
          </div>
        )}
      </div>
      <div className="w-full flex justify-center md:justify-start items-center -mt-16">
        <div
          className="relative w-32 h-32 rounded-full overflow-hidden ml-0 md:ml-10 border border-secondary cursor-pointer"
          onMouseEnter={() => setIsAvatarImageHover(true)}
          onMouseLeave={() => setIsAvatarImageHover(false)}
          onClick={() => {
            if (avatarImageRef) {
              // @ts-ignore
              avatarImageRef.current.click();
            }
          }}
        >
          <input
            ref={avatarImageRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                if (files[0]) {
                  setAvatarImageFile(files[0]);

                  const reader = new FileReader();
                  reader.onload = () => {
                    setAvatarImagePreview(reader.result as string);
                  };
                  reader.readAsDataURL(files[0]);
                }
              }
            }}
            accept="image/*"
          />
          <Image
            className="w-full h-full object-cover"
            src={avatarImagePreview ?? DEFAULT_ARTIST_IMAGE}
            width={200}
            height={200}
            alt=""
            placeholder="blur"
            blurDataURL={IMAGE_SM_BLUR_DATA_URL}
          />
          {isAvatarImageHover && (
            <div className="absolute left-0 top-0 w-full h-full bg-[#00000088] flex justify-center items-center">
              <Edit width={26} height={26} />
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-2/3 xl:w-1/2 p-5 lg:-mt-10 ">
        <div className="w-full flex flex-col p-5 bg-[#2f363e] rounded-lg">
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
            sname="Logo Image"
            label=""
            placeholder="Select logo image file"
            accept_file="image/*"
            setValue={setLogoImageFile}
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
    </Layout>
  );
}
