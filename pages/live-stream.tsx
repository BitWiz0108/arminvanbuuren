import React, { useState, useEffect } from "react";
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

import { useAuthValues } from "@/contexts/contextAuth";

import useLivestream from "@/hooks/useLivestream";

import { DATETIME_FORMAT } from "@/libs/constants";

import { IStream } from "@/interfaces/IStream";

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
        />
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
        {isDetailViewOpened ? detailContentViiew : tableView}
      </div>

      {isLoading && (
        <div className="loading">
          <RadialProgress width={50} height={50} />
        </div>
      )}
    </Layout>
  );
}
