type Props = {
  label: string;
  defaultValue: string | number;
  defaultLabel: string;
  value: string | number;
  setValue: Function;
  options: Array<{ value: string; label: string }>;
};

const Select = ({
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
      <select
        id={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full flex flex-row bg-[#24292d] justify-start items-center py-4 font-semibold px-4 border-[0.0625rem] border-[#3e454d] rounded-lg outline-none focus:outline-none transition-all duration-300"
      >
        <option value={defaultValue}>{defaultLabel}</option>
        {options.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
