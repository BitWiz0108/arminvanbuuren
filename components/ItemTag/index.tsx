type Props = {
  icon: any;
  stext: string;
  ltext: string;
  description: string;
};

const ItemTag = ({ icon, stext, ltext, description }: Props) => {
  return (
    <div className="w-full flex flex-col items-start">
      <div className="w-full flex flex-row p-5 bg-[#2f363e] rounded-lg space-x-5">
        <div className="flex items-center">
          {icon}
        </div>
        <div className="flex items-center space-x-5">
          <div className="flex flex-col">
            <div className="text-sm">
              {stext}
            </div>
            <div className="text-3xl">
              {ltext}
            </div>
          </div>
          <p className="text-sm text-gray-500 font-bold">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemTag;
