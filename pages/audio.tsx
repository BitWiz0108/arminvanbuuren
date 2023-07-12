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
import MultiSelect from "@/components/MultiSelect";
import DateInput from "@/components/DateInput";

import { useAuthValues } from "@/contexts/contextAuth";

import useAlbum from "@/hooks/useAlbum";
import useMusic from "@/hooks/useMusic";

import { DATETIME_FORMAT, FILE_TYPE, UPLOAD_TYPE } from "@/libs/constants";

import { IAlbum } from "@/interfaces/IAlbum";
import {
  DEFAULT_MUSICQUERYPARAM,
  IMusic,
  IMusicQueryParam,
} from "@/interfaces/IMusic";
import RadioBoxGroup from "@/components/RadioBoxGroup";

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
  const [duration, setDuration] = useState<number>(0);
  const [musicFileUploaded, setMusicFileUploaded] = useState<string>("");
  const [musicFileCompressed, setMusicFileCompressed] = useState<File | null>(
    null
  );
  const [musicFileCompressedUploaded, setMusicFileCompressedUploaded] =
    useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [searchKey, setSearchKey] = useState<string>("");
  const [isExclusive, setIsExclusive] = useState<boolean>(false);
  const [albumIds, setAlbumIds] = useState<Array<number> | null>(null);
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
  const changeQueryParam = (
    key: string,
    value: number | string,
    callback: Function | null = null
  ) => {
    setQueryParams((prev) => {
      if (callback) {
        callback({ ...prev, [key]: value });
      }
      return { ...prev, [key]: value };
    });
  };

  const [uploadType, setUploadType] = useState<UPLOAD_TYPE>(UPLOAD_TYPE.FILE);
  const [videoBackgroundFile, setVideoBackgroundFile] = useState<File | null>(
    null
  );
  const [videoBackgroundFileUploaded, setVideoBackgroundFileUploaded] =
    useState<string>("");
  const [videoBackgroundFileUrl, setVideoBackgroundFileUrl] =
    useState<string>("");
  const [videoBackgroundFileCompressed, setVideoBackgroundFileCompressed] =
    useState<File | null>(null);
  const [
    videoBackGroundFileCompressedUploaded,
    setVideoBackgroundFileCompressedUploaded,
  ] = useState<string>("");
  const [
    videoBackgroundFileCompressedUrl,
    setVideoBackgroundFileCompressedUrl,
  ] = useState<string>("");

  const UploadType = [
    { label: "File", value: UPLOAD_TYPE.FILE },
    { label: "URL", value: UPLOAD_TYPE.URL },
  ];

  const handlePostOptionChange = (value: UPLOAD_TYPE) => {
    setUploadType(value);
  };

  const clearFields = () => {
    setImageFile(null);
    setMusicFile(null);
    setMusicFileCompressed(null);
    setTitle("");
    setIsExclusive(false);
    setAlbumIds(null);
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
        albumIds,
        duration,
        title,
        null,
        null,
        copyright,
        lyrics,
        description,
        releaseDate,
        uploadType,
        uploadType == UPLOAD_TYPE.FILE
          ? videoBackgroundFile!
          : videoBackgroundFileUrl,
        uploadType == UPLOAD_TYPE.FILE
          ? videoBackgroundFileCompressed!
          : videoBackgroundFileCompressedUrl
      ).then((value) => {
        if (value) {
          clearFields();
          fetchMusics(queryParams);

          toast.success("Successfully updated!");
        }
      });
    } else {
      createMusic(
        imageFile!,
        musicFile!,
        musicFileCompressed!,
        isExclusive,
        albumIds == null ? null : albumIds,
        duration,
        title,
        null,
        null,
        copyright,
        lyrics,
        description,
        releaseDate,
        uploadType,
        uploadType == UPLOAD_TYPE.FILE
          ? videoBackgroundFile!
          : videoBackgroundFileUrl,
        uploadType == UPLOAD_TYPE.FILE
          ? videoBackgroundFileCompressed!
          : videoBackgroundFileCompressedUrl
      ).then((value) => {
        if (value) {
          clearFields();
          fetchMusics(queryParams);
          toast.success("Successfully added!");
        }
      });
    }
    setIsDetailedViewOpened(false);
  };

  const fetchMusics = (queryParams: IMusicQueryParam) => {
    fetchMusic(queryParams).then((data) => {
      if (data) {
        setTotalCount(data.pages);
        setMusics(data.musics);
      }
    });
  };

  const handleSearchKeyChange = (value: string) => {
    changeQueryParam("searchKey", value, (queryParam: IMusicQueryParam) =>
      fetchMusics(queryParam)
    );
  };

  useEffect(() => {
    if (duration) {
      setMinutes(Math.floor(duration / 60));
      setSeconds(Math.floor(duration % 60));
    }
  }, [duration]);

  useEffect(() => {
    if (isSignedIn) {
      fetchMusics(queryParams);
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
      <div className="w-full flex flex-col md:flex-row justify-between items-center p-5">
        <div className="w-40 self-start pt-5">
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
        <div className="w-60 self-end">
          <TextInput
            label=""
            placeholder="Enter Music Title"
            type="text"
            value={searchKey}
            setValue={(value: string) => {
              setSearchKey(value);
              handleSearchKeyChange(value);
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
                fetchMusics(queryParams);

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
              setAlbumIds(musics[index].albumIds);
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
              setVideoBackgroundFile(null);
              setVideoBackgroundFileUploaded(musics[index].videoBackground);
              setVideoBackgroundFileUrl(musics[index].videoBackground);
              setVideoBackgroundFileCompressed(null);
              setVideoBackgroundFileCompressedUploaded(
                musics[index].videoBackgroundCompressed
              );
              setVideoBackgroundFileCompressedUrl(
                musics[index].videoBackgroundCompressed
              );
              setImageFile(null);
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
                  readOnly={true}
                  setValue={(value: string) => setMinutes(Number(value))}
                />
                <span className="hidden lg:inline-flex mt-5">:</span>
                <TextInput
                  sname="Seconds"
                  label=""
                  placeholder="Enter Music Duration (s)"
                  type="text"
                  value={seconds}
                  readOnly={true}
                  setValue={(value: string) => setSeconds(Number(value))}
                />
              </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <MultiSelect
                defaultValue={albums.map((album) => {
                  return {
                    label: "Select Album",
                    value: "",
                  };
                })}
                defaultLabel="Select Album"
                value={albumIds?.map((albumId) => {
                  const album = Object.values(albums).filter(
                    (album) => album.id === albumId
                  )[0];
                  return {
                    label: album.name,
                    value: albumId.toString(),
                  };
                })}
                setValue={(value: Array<number>) => setAlbumIds(value)}
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
                  mainContent={true}
                  setDuration={setDuration}
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

            <RadioBoxGroup
              options={UploadType}
              name="UploadType RadioBox"
              selectedValue={uploadType}
              onChange={(value) => handlePostOptionChange(value as UPLOAD_TYPE)}
            />
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-2 space-y-2 lg:space-y-0 mt-2 lg:mt-0">
              <div className="w-full lg:w-1/2">
                <ButtonUpload
                  id="upload_high_quality_video_background"
                  label="Upload High Quality Video Background"
                  file={
                    uploadType == UPLOAD_TYPE.FILE
                      ? videoBackgroundFile
                      : videoBackgroundFileUrl
                  }
                  setFile={
                    uploadType == UPLOAD_TYPE.FILE
                      ? setVideoBackgroundFile
                      : setVideoBackgroundFileUrl
                  }
                  fileType={FILE_TYPE.VIDEO}
                  uploaded={videoBackgroundFileUploaded}
                  uploadType={uploadType}
                  mainContent={true}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <ButtonUpload
                  id="upload_low_quality_video_background"
                  label="Upload Low Quality Video Background"
                  file={
                    uploadType == UPLOAD_TYPE.FILE
                      ? videoBackgroundFileCompressed
                      : videoBackgroundFileCompressedUrl
                  }
                  setFile={
                    uploadType == UPLOAD_TYPE.FILE
                      ? setVideoBackgroundFileCompressed
                      : setVideoBackgroundFileCompressedUrl
                  }
                  fileType={FILE_TYPE.VIDEO}
                  uploaded={videoBackGroundFileCompressedUploaded}
                  uploadType={uploadType}
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
        <div className="transparent-loading w-[50px] h-[50px]">
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
