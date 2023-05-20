import { useState, useRef, useEffect } from "react";
import Image from "next/image";

import TextInput from "@/components/TextInput";

import {
  FILE_TYPE,
  IMAGE_MD_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
  UPLOAD_TYPE,
} from "@/libs/constants";

type Props = {
  id: string;
  label: string;
  fileType: FILE_TYPE | null; // null means music
  file: File | string | null;
  setFile: Function;
  uploaded?: string | null;
  uploadType?: UPLOAD_TYPE;
};

const ACCEPT_VIDEO = "video/*";
const ACCEPT_AUDIO = "audio/*";
const ACCEPT_IMAGE = "image/*";

const ButtonUpload = ({
  id,
  label,
  fileType,
  file,
  setFile,
  uploaded = null,
  uploadType = UPLOAD_TYPE.FILE,
}: Props) => {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [accept, setAccept] = useState<string>("*/");

  const onSelectFile = () => {
    if (fileRef) {
      // @ts-ignore
      fileRef.current.click();
    }
  };

  const onFileSelected = (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const preview: string = e.target?.result as string;
          if (preview) {
            setPreview(preview);
          }
        };

        reader.readAsDataURL(selectedFile);
        setFile(selectedFile);
      }
    }
  };

  useEffect(() => {
    switch (fileType) {
      case FILE_TYPE.IMAGE:
        setAccept(ACCEPT_IMAGE);
        break;
      case FILE_TYPE.VIDEO:
        setAccept(ACCEPT_VIDEO);
        break;
      case null:
        setAccept(ACCEPT_AUDIO);
        break;
      default:
        setAccept("*/*");
    }
  }, [fileType]);

  return (
    <div className="w-full h-full flex flex-col bg-[#24292d] rounded-lg p-5 my-1 space-y-2">
      <label htmlFor={id} className="w-full text-sm">
        {label}
      </label>
      {uploadType == UPLOAD_TYPE.FILE ? (
        <div className="flex flex-col justify-center items-center space-y-2">
          {preview ? (
            fileType == FILE_TYPE.IMAGE ? (
              <Image
                className="w-full md:w-32 h-auto md:h-32 object-cover rounded-md"
                src={preview ?? PLACEHOLDER_IMAGE}
                width={1600}
                height={900}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_MD_BLUR_DATA_URL}
                priority
              />
            ) : fileType == FILE_TYPE.VIDEO ? (
              <video
                loop
                muted
                autoPlay
                playsInline
                className="w-full md:w-32 h-auto md:h-32 object-cover rounded-md"
                src={preview}
              />
            ) : (
              <div className="rounded-md">
                <audio
                  className="h-10 w-max-72"
                  playsInline
                  controlsList="nodownload nopictureinpicture noplaybackrate"
                  controls
                  src={preview}
                />
              </div>
            )
          ) : uploaded ? (
            fileType == FILE_TYPE.IMAGE ? (
              <Image
                className="w-full md:w-32 h-auto md:h-32 object-cover rounded-md"
                src={uploaded ?? PLACEHOLDER_IMAGE}
                width={1600}
                height={900}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_MD_BLUR_DATA_URL}
                priority
              />
            ) : fileType == FILE_TYPE.VIDEO ? (
              <video
                loop
                muted
                autoPlay
                playsInline
                className="w-full md:w-32 h-auto md:h-32 object-cover rounded-md"
                src={uploaded}
              />
            ) : (
              <div className="rounded-md">
                <audio
                  className="h-10 w-max-72"
                  playsInline
                  controlsList="nodownload nopictureinpicture noplaybackrate"
                  controls
                  src={uploaded}
                />
              </div>
            )
          ) : (
            <Image
              className="w-full md:w-32 h-auto md:h-32 object-cover rounded-md"
              src={PLACEHOLDER_IMAGE}
              width={1600}
              height={900}
              alt=""
              placeholder="blur"
              blurDataURL={IMAGE_MD_BLUR_DATA_URL}
              priority
            />
          )}

          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => onFileSelected(e.target.files)}
            accept={accept}
          />

          <div className="w-full flex">
            <div
              className="bg-white p-2 flex-grow overflow-hidden text-black text-md outline-none readonly font-bold cursor-pointer transition-all duration-300 rounded-tl-md rounded-bl-md truncate"
              onClick={() => onSelectFile()}
            >
              <span className="w-full truncate">
                {file && typeof file != "string" ? file.name : label}
              </span>
            </div>
            <button
              id={id}
              onClick={() => onSelectFile()}
              className="flex bg-bluePrimary hover:bg-blueSecondary py-2 px-5 text-md rounded-tr-md rounded-br-md justify-center items-center font-sans cursor-pointer"
            >
              UPLOAD
            </button>
          </div>
        </div>
      ) : (
        <div>
          <TextInput
            sname=""
            label=""
            placeholder=""
            type="text"
            value={file as string}
            setValue={setFile}
          />
        </div>
      )}
    </div>
  );
};

export default ButtonUpload;
