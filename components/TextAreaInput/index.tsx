import ReactQuill from "react-quill";

type Props = {
  placeholder: string;
  value: string;
  setValue: Function;
  sname: string;
  id: string;
};

const TextAreaInput = ({ placeholder, value, setValue, sname, id }: Props) => {
  return (
    <div className="w-full py-2 flex flex-col space-y-1 pb-20">
      <label htmlFor={id} className="w-[50%] text-sm">
        {sname}
      </label>

      <ReactQuill
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(value) => setValue(value)}
        className="w-full h-60 placeholder-secondary text-sm text-primary"
      />
    </div>
  );
};

export default TextAreaInput;
