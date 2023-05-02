import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  width?: number;
  onClick: Function;
  bgColor?: string;
};

const ButtonSettings = ({ label, onClick, bgColor }: Props) => {
  return (
    <button
      className={twMerge(
        "inline-flex font-semibold justify-center w-full items-center text-primary text-xl px-2 py-2 rounded-md transition-all duration-300 cursor-pointer",
        bgColor
          ? "bg-bluePrimary hover:bg-blueSecondary"
          : "bg-[#dc3545] hover:bg-[#ff5061]"
      )}
      onClick={() => onClick()}
    >
      <span>{label}</span>
    </button>
  );
};

export default ButtonSettings;
