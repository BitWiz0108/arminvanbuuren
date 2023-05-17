import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import moment from "moment";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings";
import TextInput from "@/components/TextInput";
import ButtonUpload from "@/components/ButtonUpload";
import MusicTable from "@/components/MusicTable";
import RadialProgress from "@/components/RadialProgress";
import Switch from "@/components/Switch";
import Select from "@/components/Select";
import DateInput from "@/components/DateInput";

import { useAuthValues } from "@/contexts/contextAuth";

import useAlbum from "@/hooks/useAlbum";
import useMusic from "@/hooks/useMusic";

import { DATETIME_FORMAT, FILE_TYPE } from "@/libs/constants";

import { IAlbum } from "@/interfaces/IAlbum";
import {
  DEFAULT_MUSICQUERYPARAM,
  IMusic,
  IMusicQueryParam,
} from "@/interfaces/IMusic";

const TextAreaInput = dynamic(() => import("@/components/TextAreaInput"), {
  ssr: false,
});

export default function Music() {
  const { isSignedIn } = useAuthValues();
  const { fetchAllAlbum } = useAlbum();
  const {
    isLoading,
    loadingProgress,
    fetchMusic,
    createMusic,
    updateMusic,
    deleteMusic,
  } = useMusic();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [albums, setAlbums] = useState<Array<IAlbum>>([]);
  const [isDetailViewOpened, setIsDetailedViewOpened] =
    useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploaded, setImageUploaded] = useState<string>("");
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [musicFileUploaded, setMusicFileUploaded] = useState<string>("");
  const [musicFileCompressed, setMusicFileCompressed] = useState<File | null>(
    null
  );
  const [musicFileCompressedUploaded, setMusicFileCompressedUploaded] =
    useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isExclusive, setIsExclusive] = useState<boolean>(false);
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [releaseDate, setReleaseDate] = useState<string>(
    moment().format(DATETIME_FORMAT)
  );
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [copyright, setCopyright] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [musics, setMusics] = useState<Array<IMusic>>([]);
  const [queryParams, setQueryParams] = useState<IMusicQueryParam>(
    DEFAULT_MUSICQUERYPARAM
  );

  const changeQueryParam = (key: string, value: number | string) => {
    setQueryParams({ ...queryParams, [key]: value });
  };

  const clearFields = () => {
    setImageFile(null);
    setMusicFile(null);
    setMusicFileCompressed(null);
    setTitle("");
    setIsExclusive(false);
    setAlbumId(null);
    setReleaseDate(moment().format(DATETIME_FORMAT));
    setMinutes(0);
    setSeconds(0);
    setCopyright("");
    setLyrics("");
    setDescription("");
  };

  const onConfirm = async () => {
    const duration = minutes * 60 + seconds;
    if (
      (!isEditing && !imageFile) ||
      // (!isEditing && !musicFile) ||
      // (!isEditing && !musicFileCompressed) ||
      !title ||
      !lyrics ||
      !description
    ) {
      toast.warn("Please type values correctly.");
      return;
    }

    if (isEditing) {
      updateMusic(
        selectedId,
        imageFile,
        musicFile,
        musicFileCompressed,
        isExclusive,
        albumId,
        duration,
        title,
        null,
        null,
        copyright,
        lyrics,
        description,
        releaseDate
      ).then((value) => {
        if (value) {
          clearFields();
          fetchMusics();

          toast.success("Successfully updated!");
        }
      });
    } else {
      createMusic(
        imageFile!,
        musicFile!,
        musicFileCompressed!,
        isExclusive,
        albumId == null ? null : albumId < 0 ? null : albumId,
        duration,
        title,
        null,
        null,
        copyright,
        lyrics,
        description,
        releaseDate
      ).then((value) => {
        if (value) {
          clearFields();
          fetchMusics();
          toast.success("Successfully added!");
        }
      });
    }
    setIsDetailedViewOpened(false);
  };

  const fetchMusics = () => {
    fetchMusic(queryParams).then((data) => {
      if (data) {
        setTotalCount(data.pages);
        setMusics(data.musics);
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchMusics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSignedIn,
    queryParams.page,
    queryParams.limit,
    queryParams.albumName,
    queryParams.artistName,
    queryParams.releaseDate,
    queryParams.title,
  ]);

  useEffect(() => {
    if (isSignedIn) {
      fetchAllAlbum().then((data) => {
        setAlbums(data);
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
        <MusicTable
          musics={musics}
          queryParam={queryParams}
          changeQueryParam={changeQueryParam}
          totalCount={totalCount}
          deleteMusic={(id: number) =>
            deleteMusic(id).then((value) => {
              if (value) {
                fetchMusics();

                toast.success("Successfully deleted!");
              }
            })
          }
          updateMusic={(id: number) => {
            setIsEditing(true);
            const index = musics.findIndex((music) => music.id == id);
            if (index >= 0) {
              setImageFile(null);
              setImageUploaded(musics[index].coverImage);
              setMusicFile(null);
              setMusicFileUploaded(musics[index].musicFile);
              setMusicFileCompressed(null);
              setMusicFileCompressedUploaded(musics[index].musicFileCompressed);
              setTitle(musics[index].title);
              setIsExclusive(musics[index].isExclusive);
              setAlbumId(musics[index].albumId);
              setReleaseDate(
                musics[index].releaseDate ?? moment().format(DATETIME_FORMAT)
              );
              const minutes = Math.floor(musics[index].duration / 60);
              const seconds = musics[index].duration % 60;
              setMinutes(minutes);
              setSeconds(seconds);
              setCopyright(musics[index].copyright);
              setLyrics(musics[index].lyrics);
              setDescription(musics[index].description);
              setSelectedId(id);
              setIsDetailedViewOpened(true);
            }
          }}
        />
      </div>
    </div>
  );

  const detailContentView = (
    <div className="relative w-full xl:w-4/5 2xl:w-2/3 justify-center items-center">
      <div className="m-5 mt-16 p-5 bg-[#2f363e] flex flex-col space-y-5 rounded-lg">
        <label className="text-3xl px-0 font-semibold">
          {isEditing ? "Edit" : "Add"} Music
        </label>
        <div className="flex">
          <div className="w-full px-0 flex flex-col">
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <TextInput
                sname="Music Title *"
                label=""
                placeholder="Enter Music Title"
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
              <Select
                defaultValue={""}
                defaultLabel="Select Album"
                value={albumId ?? ""}
                setValue={(value: string) => setAlbumId(Number(value))}
                label="Select Album"
                options={albums.map((album) => {
                  return {
                    label: album.name,
                    value: album.id ? album.id.toString() : "",
                  };
                })}
              />
              <DateInput
                sname="Release Date"
                label=""
                placeholder="Enter Music Release Date"
                value={releaseDate}
                setValue={setReleaseDate}
              />
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <TextAreaInput
                id="Lyrics *"
                sname="Lyrics"
                placeholder="Enter Lyrics here"
                value={lyrics}
                setValue={setLyrics}
              />
              <TextAreaInput
                id="Description *"
                sname="Description"
                placeholder="Enter Description"
                value={description}
                setValue={setDescription}
              />
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2 space-y-2 lg:space-y-0">
              <div className="w-full">
                <ButtonUpload
                  id="upload_cover_image"
                  label="Upload Cover Image"
                  file={imageFile}
                  setFile={setImageFile}
                  fileType={FILE_TYPE.IMAGE}
                  uploaded={imageUploaded}
                />
              </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2 space-y-2 lg:space-y-0">
              <div className="w-full lg:w-1/2">
                <ButtonUpload
                  id="upload_high_quality_music"
                  label="Upload High Quality Music"
                  file={musicFile}
                  setFile={setMusicFile}
                  fileType={null}
                  uploaded={musicFileUploaded}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <ButtonUpload
                  id="upload_low_quality_music"
                  label="Upload Low Quality Music"
                  file={musicFileCompressed}
                  setFile={setMusicFileCompressed}
                  fileType={null}
                  uploaded={musicFileCompressedUploaded}
                />
              </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <TextInput
                sname="Copyright"
                label=""
                placeholder="Enter Copyright"
                type="text"
                value={copyright}
                setValue={setCopyright}
              />
              <div className="relative w-full flex justify-center items-center my-2 md:mt-8 md:mb-0">
                <Switch
                  checked={isExclusive}
                  setChecked={setIsExclusive}
                  label="Exclusive"
                  labelPos="left"
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
        {isDetailViewOpened ? detailContentView : tableView}
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
