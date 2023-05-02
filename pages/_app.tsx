import "@/styles/globals.scss";
import "react-multi-carousel/lib/styles.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "@/contexts/contextAuth";
import { SizeProvider } from "@/contexts/contextSize";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SizeProvider>
        <ToastContainer
          theme="colored"
          position="top-right"
          bodyClassName="toastBody"
        />
        <Component {...pageProps} />
      </SizeProvider>
    </AuthProvider>
  );
}
