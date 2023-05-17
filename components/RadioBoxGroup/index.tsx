import React from "react";

interface RadioBoxGroupProps {
  options: { label: string; value: string }[];
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioBoxGroup: React.FC<RadioBoxGroupProps> = ({
  options,
  name,
  selectedValue,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="w-full flex justify-center items-center text-lg space-x-10 lg:space-x-24">
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={handleChange}
          />
          <span className="pl-2">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioBoxGroup;
