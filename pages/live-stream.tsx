import React, { useState, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import moment from "moment";

import Layout from "@/components/Layout";
import LivestreamTable from "@/components/LivestreamTable";
import ButtonSettings from "@/components/ButtonSettings/index";
import TextInput from "@/components/TextInput";
import ButtonUpload from "@/components/ButtonUpload";
import RadialProgress from "@/components/RadialProgress";
import Switch from "@/components/Switch";
import DateInput from "@/components/DateInput";
import X from "@/components/Icons/X";
import Reply from "@/components/Icons/Reply";
import Delete from "@/components/Icons/Delete";

import { useAuthValues } from "@/contexts/contextAuth";

import useLivestream from "@/hooks/useLivestream";

import {
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  IMAGE_SM_BLUR_DATA_URL,
} from "@/libs/constants";

import { IStream } from "@/interfaces/IStream";
import { IComment } from "@/interfaces/IComment";

const TextAreaInput = dynamic(() => import("@/components/TextAreaInput"), {
  ssr: false,
});

export default function Livestream() {
  const { isSignedIn } = useAuthValues();
  const {
    isLoading,
    fetchLivestream,
    createLivestream,
    updateLivestream,
    deleteLivestream,
    fetchComments,
    writeComment,
    deleteComment,
  } = useLivestream();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [livestreams, setLivestreams] = useState<Array<IStream>>([]);
  const [title, setTitle] = useState<string>("");
  const [isExclusive, setIsExclusive] = useState<boolean>(false);
  const [releaseDate, setReleaseDate] = useState<string>(
    moment().format(DATETIME_FORMAT)
  );
  const [lyrics, setLyrics] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [shortDescription, setShortDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);
  const [fulllVideoFile, setFullVideoFile] = useState<File | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isDetailViewOpened, setIsDetailedViewOpened] =
    useState<boolean>(false);
  const [isCommentViewOpened, setIsCommentViewOpened] =
    useState<boolean>(false);
  const [comments, setComments] = useState<Array<IComment>>([]);
  const [replyContent, setReplyContent] = useState<string>("");
  const [commentPageCount, setCommentPageCount] = useState<number>(1);
  const [commentPage, setCommentPage] = useState<number>(1);

  const clearFields = () => {
    setImageFile(null);
    setPreviewVideoFile(null);
    setFullVideoFile(null);
    setTitle("");
    setReleaseDate(moment().format(DATETIME_FORMAT));
    setLyrics("");
    setDescription("");
    setMinutes(0);
    setSeconds(0);
    setShortDescription("");
    setIsExclusive(false);
  };

  const onConfirm = () => {
    const duration = minutes * 60 + seconds;
    if (
      (!isEditing && !imageFile) ||
      (!isEditing && !previewVideoFile) ||
      (!isEditing && !fulllVideoFile) ||
      !title ||
      !releaseDate ||
      !description ||
      duration <= 0
    ) {
      toast.warn("Please type values correctly.");
      return;
    }

    if (isEditing) {
      updateLivestream(
        selectedId,
        imageFile,
        previewVideoFile,
        fulllVideoFile,
        title,
        releaseDate,
        description,
        duration,
        shortDescription,
        lyrics,
        isExclusive
      ).then((value) => {
        if (value) {
          clearFields();
          fetchLivestreams();

          toast.success("Successfully updated!");
        }
      });
    } else {
      createLivestream(
        imageFile!,
        previewVideoFile!,
        fulllVideoFile!,
        title,
        releaseDate,
        description,
        duration,
        shortDescription,
        lyrics,
        isExclusive
      ).then((value) => {
        if (value) {
          clearFields();
          fetchLivestreams();

          toast.success("Successfully added!");
        }
      });
    }

    setIsDetailedViewOpened(false);
  };

  const fetchLivestreams = () => {
    fetchLivestream(page).then((data) => {
      if (data) {
        setTotalCount(data.pages);
        setLivestreams(data.livestreams);
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchLivestreams();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, page]);

  const reply = () => {
    writeComment(selectedId, replyContent).then((value) => {
      if (value) {
        setComments([value, ...comments]);
        setReplyContent("");
      }
    });
  };

  const fetchMoreComments = () => {
    fetchComments(selectedId, page + 1).then((result) => {
      setComments([...comments, ...result.comments]);
      setCommentPageCount(result.pages);

      if (page < result.pages) {
        setCommentPage((prev) => prev + 1);
      }
    });
  };

  useEffect(() => {
    if (isCommentViewOpened) {
      fetchComments(selectedId, 1).then((value) => {
        setComments(value.comments);
        setCommentPageCount(value.pages);
        setCommentPage(1);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, isCommentViewOpened]);

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
        <LivestreamTable
          livestreams={livestreams}
          page={page}
          setPage={(value: number) => setPage(value)}
          totalCount={totalCount}
          deleteLivestream={(id: number) =>
            deleteLivestream(id).then((value) => {
              if (value) {
                fetchLivestreams();

                toast.success("Successfully deleted!");
              }
            })
          }
          updateLivestream={(id: number) => {
            setIsEditing(true);
            const index = livestreams.findIndex((stream) => stream.id == id);
            if (index >= 0) {
              setImageFile(null);
              setPreviewVideoFile(null);
              setFullVideoFile(null);
              setTitle(livestreams[index].title);
              setReleaseDate(
                livestreams[index].releaseDate ??
                  moment().format(DATETIME_FORMAT)
              );
              setLyrics(livestreams[index].lyrics);
              setDescription(livestreams[index].description);
              const minutes = Math.floor(livestreams[index].duration / 60);
              const seconds = livestreams[index].duration % 60;
              setMinutes(minutes);
              setShortDescription(livestreams[index].shortDescription);
              setIsExclusive(livestreams[index].isExclusive);

              setSelectedId(id);
              setIsDetailedViewOpened(true);
            }
          }}
          commentLivestream={(id: number) => {
            setSelectedId(id);
            setIsCommentViewOpened(true);
          }}
        />
      </div>
    </div>
  );

  const commentView = (
    <div className="relative w-full xl:w-4/5 2xl:w-2/3 justify-center items-center p-5">
      <div className="relative mt-16 p-5 bg-[#2f363e] flex flex-col space-y-5 rounded-lg">
        <div className="absolute top-2 right-2 text-primary cursor-pointer">
          <X
            width={24}
            height={24}
            onClick={() => setIsCommentViewOpened(false)}
          />
        </div>
        <div className="w-full h-full flex flex-col justify-start items-center">
          <div className="w-full flex flex-row justify-start items-center p-2 space-x-2">
            <input
              type="text"
              placeholder="Please type what you want..."
              className="w-auto inline-flex h-10 flex-grow rounded-md border-[0.0625rem] border-[#3e454d] p-3 text-left text-sm text-primary bg-transparent outline-none focus:outline-none"
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
              className="w-10 h-10 inline-flex justify-center items-center space-x-2 bg-bluePrimary hover:bg-blueSecondary text-primary rounded-md transition-all duration-300"
              onClick={() => {
                if (!replyContent) {
                  toast.warn("Please type message correctly.");
                  return;
                }
                reply();
              }}
            >
              <Reply />
            </button>
          </div>
          <div className="w-full h-full flex-grow flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto pr-1 space-y-1">
            {comments.map((reply, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex justify-start items-start space-x-2 p-2 bg-background rounded-md"
                >
                  <div className="w-24 min-w-[96px] flex flex-col justify-start items-center">
                    <Image
                      className="w-8 h-8 object-cover rounded-full overflow-hidden"
                      src={reply.author.avatarImage ?? DEFAULT_AVATAR_IMAGE}
                      width={40}
                      height={40}
                      alt=""
                      placeholder="blur"
                      blurDataURL={IMAGE_SM_BLUR_DATA_URL}
                    />
                    <p className="w-full text-primary text-sm text-center truncate">
                      {reply.author.username ?? "anonymous"}
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
                            deleteComment(reply.id).then((value) => {
                              if (value) {
                                const tcomments = comments.slice();
                                tcomments.splice(index, 1);
                                setComments(tcomments);
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
              {isLoading ? (
                <RadialProgress width={30} height={30} />
              ) : (
                commentPageCount > commentPage && (
                  <button
                    className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-third rounded-full border border-secondary cursor-pointer transition-all duration-300"
                    onClick={() => fetchMoreComments()}
                  >
                    + More
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const detailContentViiew = (
    <div className="relative w-full xl:w-4/5 2xl:w-2/3 justify-center items-center p-5">
      <div className="mt-16 p-5 bg-[#2f363e] flex flex-col space-y-5 rounded-lg">
        <label className="text-3xl px-0 font-semibold">
          {isEditing ? "Edit" : "Add"} Livestream
        </label>
        <div className="flex">
          <div className="w-full px-0 flex flex-col">
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <TextInput
                sname="Livestream Title"
                label=""
                placeholder="Enter Livestream Title"
                type="text"
                value={title}
                setValue={setTitle}
              />
              <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
                <TextInput
                  sname="Minutes"
                  label=""
                  placeholder="Enter Music Duration (s)"
                  type="text"
                  value={minutes}
                  setValue={(value: string) => setMinutes(Number(value))}
                />
                <span className="hidden lg:inline-flex mt-5">:</span>
                <TextInput
                  sname="Seconds"
                  label=""
                  placeholder="Enter Music Duration (s)"
                  type="text"
                  value={seconds}
                  setValue={(value: string) => setSeconds(Number(value))}
                />
              </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <DateInput
                sname="Release Date"
                label=""
                placeholder="Enter Livestream Release Date"
                value={releaseDate}
                setValue={setReleaseDate}
              />
              <TextInput
                sname="Short Description"
                label=""
                placeholder="Enter Short Description"
                type="text"
                value={shortDescription}
                setValue={setShortDescription}
              />
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <TextAreaInput
                id="Lyrics"
                sname="Lyrics"
                placeholder="Enter Lyrics here"
                value={lyrics}
                setValue={setLyrics}
              />
              <TextAreaInput
                id="Description"
                sname="Description"
                placeholder="Enter Description"
                value={description}
                setValue={setDescription}
              />
            </div>
            <div className="w-full flex flex-col xl:flex-row justify-start items-center space-x-0 xl:space-x-2 space-y-2 xl:space-y-0">
              <div className="w-full xl:w-1/3">
                <ButtonUpload
                  sname="Livestream Cover Image"
                  label=""
                  setValue={setImageFile}
                  placeholder="Enter Livestream Release Date"
                  accept_file="image/*"
                />
              </div>
              <div className="w-full xl:w-1/3">
                <ButtonUpload
                  sname="Livestream Preview Video"
                  label=""
                  setValue={setPreviewVideoFile}
                  placeholder="Enter Livestream Release Date"
                  accept_file="video/*"
                />
              </div>
              <div className="w-full xl:w-1/3">
                <ButtonUpload
                  sname="Livestream Full Video"
                  label=""
                  setValue={setFullVideoFile}
                  placeholder="Enter Livestream Release Date"
                  accept_file="video/*"
                />
              </div>
            </div>
            <div className="relative w-full flex justify-center items-center mt-5">
              <Switch
                checked={isExclusive}
                setChecked={setIsExclusive}
                label="Exclusive"
                labelPos="right"
              />
            </div>

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

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex justify-center items-start overflow-x-hidden overflow-y-auto">
        {isDetailViewOpened
          ? detailContentViiew
          : isCommentViewOpened
          ? commentView
          : tableView}
      </div>

      {isLoading && (
        <div className="loading">
          <RadialProgress width={50} height={50} />
        </div>
      )}
    </Layout>
  );
}
