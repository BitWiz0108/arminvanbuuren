import React, { useState, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import moment from "moment";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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
import Select from "@/components/Select";

import { useAuthValues } from "@/contexts/contextAuth";

import useLivestream from "@/hooks/useLivestream";
import useCategory from "@/hooks/useCategory";

import {
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  FILE_TYPE,
  IMAGE_SM_BLUR_DATA_URL,
  UPLOAD_TYPE,
} from "@/libs/constants";

import {
  DEFAULT_STREAMQUERYPARAM,
  IStream,
  IStreamQueryParam,
} from "@/interfaces/IStream";
import { IComment } from "@/interfaces/IComment";
import { ICategory } from "@/interfaces/ICategory";
import RadioBoxGroup from "@/components/RadioBoxGroup";

const TextAreaInput = dynamic(() => import("@/components/TextAreaInput"), {
  ssr: false,
});

export default function Livestream() {
  const UploadType = [
    { label: "File", value: UPLOAD_TYPE.FILE },
    { label: "URL", value: UPLOAD_TYPE.URL },
  ];

  const { isSignedIn } = useAuthValues();
  const { fetchAllCategory } = useCategory();
  const {
    isLoading,
    loadingProgress,
    fetchLivestream,
    createLivestream,
    updateLivestream,
    deleteLivestream,
    fetchComments,
    writeComment,
    deleteComment,
  } = useLivestream();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [livestreams, setLivestreams] = useState<Array<IStream>>([]);
  const [title, setTitle] = useState<string>("");
  const [isExclusive, setIsExclusive] = useState<boolean>(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [releaseDate, setReleaseDate] = useState<string>(
    moment().format(DATETIME_FORMAT)
  );
  const [lyrics, setLyrics] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [shortDescription, setShortDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUploaded, setImageFileUploaded] = useState<string>("");

  const [uploadType, setUploadType] = useState<UPLOAD_TYPE>(UPLOAD_TYPE.FILE);
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);
  const [previewVideoFileUploaded, setPreviewVideoFileUploaded] =
    useState<string>("");
  const [previewVideoFileUrl, setPreviewVideoFileUrl] = useState<string>("");

  const [previewVideoFileCompressed, setPreviewVideoFileCompressed] =
    useState<File | null>(null);
  const [previewVideoFileCompressedUrl, setPreviewVideoFileCompressedUrl] =
    useState<string>("");
  const [
    previewVideoFileCompressedUploaded,
    setPreviewVideoFileCompressedUploaded,
  ] = useState<string>("");

  const [fulllVideoFile, setFullVideoFile] = useState<File | null>(null);
  const [fulllVideoFileUrl, setFullVideoFileUrl] = useState<string>("");
  const [fulllVideoFileUploaded, setFullVideoFileUploaded] =
    useState<string>("");

  const [fulllVideoFileCompressed, setFullVideoFileCompressed] =
    useState<File | null>(null);
  const [fulllVideoFileCompressedUrl, setFulllVideoFileCompressedUrl] =
    useState<string>("");
  const [fulllVideoFileCompressedUploaded, setFullVideoFileCompressedUploaded] =
    useState<string>("");

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
  const [queryParams, setQueryParams] = useState<IStreamQueryParam>(
    DEFAULT_STREAMQUERYPARAM
  );

  const changeQueryParam = (key: string, value: number | string) => {
    setQueryParams({ ...queryParams, [key]: value });
  };

  const handlePostOptionChange = (value: UPLOAD_TYPE) => {
    setUploadType(value);
  };

  const clearFields = () => {
    setImageFile(null);
    setPreviewVideoFile(null);
    setPreviewVideoFileCompressed(null);
    setFullVideoFile(null);
    setFullVideoFileCompressed(null);
    setTitle("");
    setCategoryId(null);
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
      (!isEditing &&
        ((uploadType == UPLOAD_TYPE.FILE && !previewVideoFile) ||
          (uploadType == UPLOAD_TYPE.URL && !previewVideoFileUrl))) ||
      (!isEditing &&
        ((uploadType == UPLOAD_TYPE.FILE && !previewVideoFileCompressed) ||
          (uploadType == UPLOAD_TYPE.URL && !previewVideoFileCompressedUrl))) ||
      (!isEditing &&
        ((uploadType == UPLOAD_TYPE.FILE && !fulllVideoFile) ||
          (uploadType == UPLOAD_TYPE.URL && !fulllVideoFileUrl))) ||
      (!isEditing &&
        ((uploadType == UPLOAD_TYPE.FILE && !fulllVideoFileCompressed) ||
          (uploadType == UPLOAD_TYPE.URL && !fulllVideoFileCompressedUrl))) ||
      !title ||
      !description
    ) {
      toast.warn("Please type values correctly.");
      return;
    }

    if (isEditing) {
      updateLivestream(
        selectedId,
        imageFile,
        uploadType,
        uploadType == UPLOAD_TYPE.FILE ? previewVideoFile : previewVideoFileUrl,
        uploadType == UPLOAD_TYPE.FILE
          ? previewVideoFileCompressed
          : previewVideoFileCompressedUrl,
        uploadType == UPLOAD_TYPE.FILE ? fulllVideoFile : fulllVideoFileUrl,
        uploadType == UPLOAD_TYPE.FILE
          ? fulllVideoFileCompressed
          : fulllVideoFileCompressedUrl,
        title,
        categoryId,
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
        uploadType,
        uploadType == UPLOAD_TYPE.FILE
          ? previewVideoFile!
          : previewVideoFileUrl,
        uploadType == UPLOAD_TYPE.FILE
          ? previewVideoFileCompressed!
          : previewVideoFileCompressedUrl,
        uploadType == UPLOAD_TYPE.FILE ? fulllVideoFile! : fulllVideoFileUrl,
        uploadType == UPLOAD_TYPE.FILE
          ? fulllVideoFileCompressed!
          : fulllVideoFileCompressedUrl,
        title,
        categoryId == null ? null : categoryId < 0 ? null : categoryId,
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
    fetchLivestream(queryParams).then((data) => {
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
  }, [
    isSignedIn,
    queryParams.page,
    queryParams.limit,
    queryParams.categoryName,
    queryParams.artistName,
    queryParams.releaseDate,
    queryParams.title,
  ]);

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

  useEffect(() => {
    if (isSignedIn) {
      fetchAllCategory().then((data) => {
        setCategories(data);
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
        <LivestreamTable
          livestreams={livestreams}
          queryParam={queryParams}
          changeQueryParam={changeQueryParam}
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
              setImageFileUploaded(livestreams[index].coverImage);
              setPreviewVideoFile(null);
              setPreviewVideoFileUploaded(livestreams[index].previewVideo);
              setPreviewVideoFileCompressed(null);
              setPreviewVideoFileCompressedUploaded(
                livestreams[index].previewVideoCompressed
              );
              setFullVideoFile(null);
              setFullVideoFileUploaded(livestreams[index].fullVideo);
              setFullVideoFileCompressed(null);
              setFullVideoFileCompressedUploaded(
                livestreams[index].fullVideoCompressed
              );
              setTitle(livestreams[index].title);
              setCategoryId(livestreams[index].categoryId);
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
    <div className="relative w-full lg:w-4/5 2xl:w-2/3 justify-center items-center p-5">
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
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2">
              <TextInput
                sname="Livestream Title *"
                label=""
                placeholder="Enter Livestream Title"
                type="text"
                value={title}
                setValue={setTitle}
              />
              <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2">
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
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2">
              <Select
                defaultValue={""}
                defaultLabel="Select Livestream Category"
                value={categoryId ?? ""}
                setValue={(value: string) => setCategoryId(Number(value))}
                label="Select Livestream Category"
                options={categories.map((category) => {
                  return {
                    label: category.name,
                    value: category.id ? category.id.toString() : "",
                  };
                })}
              />
              <DateInput
                sname="Release Date"
                label=""
                placeholder="Enter Livestream Release Date"
                value={releaseDate}
                setValue={setReleaseDate}
              />
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2">
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
                sname="Lyrics *"
                placeholder="Enter Lyrics here"
                value={lyrics}
                setValue={setLyrics}
              />
              <TextAreaInput
                id="Description"
                sname="Description *"
                placeholder="Enter Description"
                value={description}
                setValue={setDescription}
              />
            </div>
            <RadioBoxGroup
              options={UploadType}
              name="UploadType RadioBox"
              selectedValue={uploadType}
              onChange={(value) => handlePostOptionChange(value as UPLOAD_TYPE)}
            />
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2 space-y-2 lg:space-y-0 mt-2 lg:mt-0">
              <div className="w-full lg:w-1/2">
                <ButtonUpload
                  id="upload_high_quality_preview_video"
                  label="Upload High Quality Preview Video *"
                  file={
                    uploadType == UPLOAD_TYPE.FILE
                      ? previewVideoFile
                      : previewVideoFileUrl
                  }
                  setFile={
                    uploadType == UPLOAD_TYPE.FILE
                      ? setPreviewVideoFile
                      : setPreviewVideoFileUrl
                  }
                  fileType={FILE_TYPE.VIDEO}
                  uploaded={previewVideoFileUploaded}
                  uploadType={uploadType}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <ButtonUpload
                  id="upload_low_quality_preview_video"
                  label="Upload Low Quality Preview Video"
                  file={
                    uploadType == UPLOAD_TYPE.FILE
                      ? previewVideoFileCompressed
                      : previewVideoFileCompressedUrl
                  }
                  setFile={
                    uploadType == UPLOAD_TYPE.FILE
                      ? setPreviewVideoFileCompressed
                      : setPreviewVideoFileCompressedUrl
                  }
                  fileType={FILE_TYPE.VIDEO}
                  uploaded={previewVideoFileCompressedUploaded}
                  uploadType={uploadType}
                />
              </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2 space-y-2 lg:space-y-0 mt-2 lg:mt-0">
              <div className="w-full lg:w-1/2">
                <ButtonUpload
                  id="upload_high_quality_full_video"
                  label="Upload High Quality Full Video"
                  file={
                    uploadType == UPLOAD_TYPE.FILE
                      ? fulllVideoFile
                      : fulllVideoFileUrl
                  }
                  setFile={
                    uploadType == UPLOAD_TYPE.FILE
                      ? setFullVideoFile
                      : setFullVideoFileUrl
                  }
                  fileType={FILE_TYPE.VIDEO}
                  uploaded={fulllVideoFileUploaded}
                  uploadType={uploadType}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <ButtonUpload
                  id="upload_low_quality_full_video"
                  label="Upload Low Quality Full Video"
                  file={
                    uploadType == UPLOAD_TYPE.FILE
                      ? fulllVideoFileCompressed
                      : fulllVideoFileCompressedUrl
                  }
                  setFile={
                    uploadType == UPLOAD_TYPE.FILE
                      ? setFullVideoFileCompressed
                      : setFulllVideoFileCompressedUrl
                  }
                  fileType={FILE_TYPE.VIDEO}
                  uploaded={fulllVideoFileCompressedUploaded}
                  uploadType={uploadType}
                />
              </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2 space-y-2 lg:space-y-0 mt-2 lg:mt-0">
              <div className="w-full lg:w-1/2">
                <ButtonUpload
                  id="upload_livestream_cover_image"
                  label="Upload Livestream Cover Image"
                  file={imageFile}
                  setFile={setImageFile}
                  fileType={FILE_TYPE.IMAGE}
                  uploaded={imageFileUploaded}
                />
              </div>
              <div className="relative  lg:w-1/2 flex justify-center items-center mt-0 lg:mt-8">
                <Switch
                  checked={isExclusive}
                  setChecked={setIsExclusive}
                  label="Exclusive"
                  labelPos="right"
                />
              </div>
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
        <div className="loading w-[50px] h-[50px]">
          {loadingProgress > 0 ? (
            <div className="w-20 h-20">
              <CircularProgressbar
                styles={buildStyles({
                  pathColor: "#0052e4",
                  textColor: "#ffffff",
                  trailColor: "#888888",
                })}
                value={loadingProgress}
                maxValue={100}
                text={`${loadingProgress}%`}
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
