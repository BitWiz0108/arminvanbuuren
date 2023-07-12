import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Layout from "@/components/Layout";
import AlbumTable from "@/components/AlbumTable";
import ButtonSettings from "@/components/ButtonSettings/index";
import TextInput from "@/components/TextInput";
import ButtonUpload from "@/components/ButtonUpload";
import RadialProgress from "@/components/RadialProgress";

import {
  DATETIME_FORMAT,
  FILE_TYPE,
  PLACEHOLDER_IMAGE,
  UPLOAD_TYPE,
} from "@/libs/constants";

import { useAuthValues } from "@/contexts/contextAuth";

import useAlbum from "@/hooks/useAlbum";

import { IAlbum } from "@/interfaces/IAlbum";
import moment from "moment";
import DateInput from "@/components/DateInput";
import RadioBoxGroup from "@/components/RadioBoxGroup";

export default function Album() {
  const { isSignedIn } = useAuthValues();
  const {
    isLoading,
    loadingProgress,
    fetchAllAlbum,
    createAlbum,
    updateAlbum,
    deleteAlbum,
  } = useAlbum();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [albums, setAlbums] = useState<Array<IAlbum>>([]);
  const [isDetailViewOpened, setIsDetailViewOpened] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUploaded, setImageFileUploaded] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [releaseDate, setReleaseDate] = useState<string>(
    moment().format(DATETIME_FORMAT)
  );
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
    setName("");
    setDescription("");
    setReleaseDate(moment().format(DATETIME_FORMAT));
    setImageFile(null);
  };

  const onConfirm = () => {
    if ((!isEditing && !imageFile) || !name || !description) {
      toast.warn("Please type values correctly.");
      return;
    }

    if (isEditing) {
      updateAlbum(
        selectedId,
        imageFile,
        name,
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
          fetchAlbums();

          toast.success("Successfully updated!");
        }
      });
    } else {
      createAlbum(
        imageFile!,
        name,
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
          fetchAlbums();
          toast.success("Successfully added!");
        }
      });
    }

    setIsDetailViewOpened(false);
  };

  const fetchAlbums = () => {
    fetchAllAlbum().then((value) => {
      if (value) {
        setAlbums(value);
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchAlbums();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const tableView = (
    <div className="w-full">
      <div className="w-full flex justify-start items-center p-5">
        <div className="w-40">
          <ButtonSettings
            label="Add"
            bgColor="cyan"
            onClick={() => {
              clearFields();
              setIsEditing(false);
              setIsDetailViewOpened(true);
            }}
          />
        </div>
      </div>
      <div className="w-full p-5">
        <AlbumTable
          albums={albums}
          deleteAlbum={(id: number) =>
            deleteAlbum(id).then((value) => {
              if (value) {
                fetchAlbums();

                toast.success("Successfully deleted!");
              }
            })
          }
          updateAlbum={(id: number) => {
            setIsEditing(true);
            const index = albums.findIndex((album) => album.id == id);
            if (index >= 0) {
              setName(albums[index].name);
              setDescription(albums[index].description);
              setImageFileUploaded(albums[index].image ?? PLACEHOLDER_IMAGE);
              setReleaseDate(
                albums[index].releaseDate ?? moment().format(DATETIME_FORMAT)
              );
              setVideoBackgroundFile(null);
              setVideoBackgroundFileUploaded(albums[index].videoBackground);
              setVideoBackgroundFileUrl(albums[index].videoBackground);
              setVideoBackgroundFileCompressed(null);
              setVideoBackgroundFileCompressedUploaded(
                albums[index].videoBackgroundCompressed
              );
              setVideoBackgroundFileCompressedUrl(
                albums[index].videoBackgroundCompressed
              );
              setImageFile(null);
              setSelectedId(id);
              setIsDetailViewOpened(true);
            }
          }}
        />
      </div>
    </div>
  );

  const detailContentViiew = (
    <div className="relative w-full xl:w-4/5 2xl:w-2/3 flex justify-center items-center p-5">
      <div className="mt-16 p-5 w-full bg-[#2f363e] flex flex-col space-y-5 rounded-lg">
        <label className="text-3xl px-0 font-semibold">
          {isEditing ? "Edit" : "Add"} Album
        </label>
        <div className="w-full px-0 flex flex-col">
          <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
            <TextInput
              sname="Album Name"
              label=""
              placeholder="Enter Album Name"
              type="text"
              value={name}
              setValue={setName}
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
            <TextInput
              sname="Short Description"
              label=""
              placeholder="Enter Short Description"
              type="text"
              value={description}
              setValue={setDescription}
            />
          </div>
          <ButtonUpload
            id="album_cover_image"
            label="Upload Album Cover Image"
            file={imageFile}
            setFile={setImageFile}
            fileType={FILE_TYPE.IMAGE}
            uploaded={imageFileUploaded}
          />

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

          <div className="flex space-x-2 mt-5">
            <ButtonSettings
              label="Cancel"
              onClick={() => setIsDetailViewOpened(false)}
            />
            <ButtonSettings bgColor="cyan" label="Save" onClick={onConfirm} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex justify-center items-start overflow-x-hidden overflow-y-auto">
        {isDetailViewOpened ? detailContentViiew : tableView}

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
      </div>
    </Layout>
  );
}
