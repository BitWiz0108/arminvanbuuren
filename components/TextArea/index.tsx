import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  id: string;
  sname: string;
  placeholder: string;
  value: string;
  setValue: Function;
};

const Input = ({ id, sname, placeholder, value, setValue }: Props) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const onChange = (value: string) => {
    setValue(value);
    setDirty(true);
  };

  return (
    <div className="w-full py-2 flex flex-col space-y-1">
      <label htmlFor={id} className="w-full text-sm">
        {sname}
      </label>
      <div
        className={twMerge(
          "w-full flex flex-row bg-[#24292d] justify-start items-center py-4 font-semibold px-4 border-[0.0625rem] border-[#3e454d] rounded-lg transition-all duration-300"
        )}
      >
        <textarea
          id={id}
          className="flex w-auto flex-grow h-[100px] min-h-[100px] max-h-[100px] text-primary text-sm placeholder-secondary bg-transparent outline-none border-none focus:outline-none focus:border-none overflow-x-hidden overflow-y-auto"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Input;
