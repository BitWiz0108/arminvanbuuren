import { AnimatePresence, motion } from "framer-motion";
import X from "@/components/Icons/X";

import { IPrayerRequest } from "@/interfaces/IPrayerRequest";

type Props = {
  prayerRequest: IPrayerRequest;
  visible: boolean;
  setVisible: Function;
};

const ReplyPrayerRequestModal = ({ prayerRequest, visible, setVisible }: Props) => {

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-0 top-0 w-screen h-screen p-5 bg-[#000000aa] flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full md:w-[640px] h-fit max-h-full px-5 md:px-10 pt-16 pb-5 md:pb-10 bg-background rounded-lg overscroll-contain overflow-x-hidden overflow-y-auto">
            <div className="absolute top-5 right-5 text-primary cursor-pointer">
              <X width={24} height={24} onClick={() => setVisible(false)} />
            </div>

            <p className="w-full text-center text-xl md:text-xl lg:text-3xl text-primary font-medium select-none hover:text-blueSecondary transition-all duration-300 mb-5">
              {prayerRequest.title}
            </p>

          </div>
        </motion.div>
      )
      }
    </AnimatePresence >
  );
};

export default ReplyPrayerRequestModal;