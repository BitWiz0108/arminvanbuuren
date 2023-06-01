import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  placeholder: string;
  type: "text" | "email" | "number" | "password";
  value: string | number;
  setValue: Function;
  icon?: any;
  sname?: string;
  id?: string;
  readOnly?: boolean;
};

const Input = ({
  label,
  placeholder,
  type,
  value,
  setValue,
  sname,
  id,
  icon = null,
  readOnly = false,
}: Props) => {
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
          "w-full flex flex-row bg-[#24292d] justify-start items-center py-4 font-semibold px-4 border-[0.0625rem] border-[#3e454d] rounded-lg transition-all duration-300",
          icon ? "space-x-2" : "space-x-0"
        )}
      >
        {icon}
        {readOnly == true ? (
          <input
            readOnly
            type={type}
            id={id}
            className="flex w-auto flex-grow text-secondary text-sm placeholder-secondary bg-transparent outline-none border-none focus:outline-none focus:border-none"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            type={type}
            id={id}
            className="flex w-auto flex-grow text-primary text-sm placeholder-secondary bg-transparent outline-none border-none focus:outline-none focus:border-none"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {icon && <div className="w-5"></div>}
      </div>
    </div>
  );
};

export default Input;
