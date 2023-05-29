import Select, { StylesConfig } from "react-select";

type Props = {
  label: string;
  defaultValue: Array<{ value: string; label: string }>;
  defaultLabel: string;
  value?: Array<{ value: string; label: string }>;
  setValue: Function;
  options: Array<{ value: string; label: string }>;
};

const MultiSelect = ({
  label,
  defaultValue,
  defaultLabel,
  value,
  setValue,
  options,
}: Props) => {
  return (
    <div className="w-full flex flex-col justify-start items-start my-2 space-y-1">
      <label htmlFor={label} className="text-sm">
        {label}
      </label>
      <Select
        options={options}
        isMulti
        className="w-full basic-multi-select"
        classNamePrefix="select"
        value={value}
        onChange={(selectOptions) =>
          setValue(selectOptions.map((obj) => parseInt(obj.value)))
        }
      />
    </div>
  );
};

export default MultiSelect;
