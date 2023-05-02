import { useState, useRef } from "react";

type Props = {
  label: string;
  placeholder: string;
  setValue: Function;
  sname?: string;
  id?: string;
  accept_file?: string;
};

const ButtonUpload = ({ sname, id, accept_file, setValue }: Props) => {
  const fileRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);

  const onSelectFile = () => {
    if (fileRef) {
      // @ts-ignore
      fileRef.current.click();
    }
  };

  const onFileSelected = (files: FileList | null) => {
    if (files && files.length > 0) {
      if (files[0]) {
        setFile(files[0]);
        setValue(files[0]);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#24292d] rounded-lg p-5 my-1 space-y-1">
      <label htmlFor={id} className="w-full text-sm">
        {sname}
      </label>
      <div className="flex">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => onFileSelected(e.target.files)}
          accept={accept_file}
        />
        <button
          className="bg-white p-2 flex-grow overflow-hidden text-black text-md outline-none readonly font-bold cursor-pointer transition-all duration-300 rounded-tl-md rounded-bl-md truncate"
          onClick={() => onSelectFile()}
        >
          {file && <span className="w-full truncate">{file.name}</span>}
        </button>
        <div
          onClick={() => onSelectFile()}
          className="bg-bluePrimary hover:bg-blueSecondary flex justify-center items-center py-2 px-5 text-md font-bold cursor-pointer rounded-tr-md rounded-br-md"
        >
          UPLOAD
        </div>
      </div>
    </div>
  );
};

export default ButtonUpload;
