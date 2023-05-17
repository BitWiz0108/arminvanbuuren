import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  EMAIL_TEMPLATE_TYPE,
  FILE_TYPE,
  PLACEHOLDER_IMAGE,
} from "@/libs/constants";

import Layout from "@/components/Layout";
import TextInput from "@/components/TextInput";
import ButtonSettings from "@/components/ButtonSettings";
import RadialProgress from "@/components/RadialProgress";
import ButtonUpload from "@/components/ButtonUpload";
import Select from "@/components/Select";

import { useAuthValues } from "@/contexts/contextAuth";

import useEmailTemplate from "@/hooks/useEmailTemplate";

const TextAreaInput = dynamic(() => import("@/components/TextAreaInput"), {
  ssr: false,
});

export default function EmailTemplate() {
  const { isSignedIn } = useAuthValues();

  const {
    isLoading,
    loadingProgress,
    fetchEmailTemplate,
    updateEmailTemplate,
  } = useEmailTemplate();

  const [emailType, setEmailType] = useState<EMAIL_TEMPLATE_TYPE>(
    EMAIL_TEMPLATE_TYPE.THANK
  );
  const [id, setId] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [fromName, setFromName] = useState<string>("");
  const [fromEmail, setFromEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUploaded, setImageFileUploaded] = useState<string>("");

  const onSaveTemplate = () => {
    updateEmailTemplateData();
  };

  const fetchEmailTemplateData = (emailType: EMAIL_TEMPLATE_TYPE) => {
    fetchEmailTemplate(emailType).then((value) => {
      if (value) {
        setId(value.id);
        setTitle(value.title);
        setFromEmail(value.fromEmail);
        setFromName(value.fromName);
        setSubject(value.subject);
        setContent(value.content);
        setImageFileUploaded(value.logoImage ?? PLACEHOLDER_IMAGE);
      }
    });
  };

  const updateEmailTemplateData = () => {
    if (!title || !content) {
      toast.warn("Please enter values correctly.");
      return;
    }

    updateEmailTemplate(
      id,
      emailType,
      title,
      fromName,
      fromEmail,
      subject,
      content,
      imageFile
    ).then((value) => {
      if (value) {
        setId(value.id);
        setTitle(value.title);
        setFromEmail(value.fromEmail);
        setFromName(value.fromName);
        setSubject(value.subject);
        setContent(value.content);
        toast.success("Successfully updated!");
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchEmailTemplateData(emailType);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, emailType]);

  return (
    <Layout>
      <div className="realtive w-full flex justify-center items-start">
        <div className="relative w-full xl:w-4/5 2xl:w-2/3 min-h-screen flex flex-col justify-start items-center p-5">
          <div className="mt-10 w-full p-5 bg-[#2f363e] rounded-lg">
            <label className="text-3xl font-semibold">Email Template</label>

            <div className="w-full mb-5">
              <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-5">
                <Select
                  defaultValue={EMAIL_TEMPLATE_TYPE.THANK}
                  defaultLabel="Thank you email"
                  label="Type"
                  value={emailType}
                  options={[
                    {
                      label: "Password reset email",
                      value: EMAIL_TEMPLATE_TYPE.PASSWORD_RESET,
                    },
                    {
                      label: "Verification email",
                      value: EMAIL_TEMPLATE_TYPE.EMAIL_VERIFICATION,
                    },
                  ]}
                  setValue={(value: string) => {
                    setEmailType(value as EMAIL_TEMPLATE_TYPE);
                    switch (value) {
                      case EMAIL_TEMPLATE_TYPE.THANK:
                        setId(1);
                        break;
                      case EMAIL_TEMPLATE_TYPE.PASSWORD_RESET:
                        setId(2);
                        break;
                      case EMAIL_TEMPLATE_TYPE.EMAIL_VERIFICATION:
                        setId(3);
                        break;
                    }
                  }}
                />
                <TextInput
                  sname="Email Title"
                  label=""
                  placeholder="Enter Email Title"
                  type="text"
                  value={title}
                  setValue={setTitle}
                />
              </div>

              <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-5">
                <TextInput
                  sname="From name"
                  label=""
                  placeholder="Enter From name"
                  type="text"
                  value={fromName}
                  setValue={setFromName}
                />
                <TextInput
                  sname="From email"
                  label=""
                  placeholder="Enter From email"
                  type="text"
                  value={fromEmail}
                  setValue={setFromEmail}
                />
              </div>
              <TextInput
                sname="Subject"
                label=""
                placeholder="Enter Subject"
                type="text"
                value={subject}
                setValue={setSubject}
              />
              <TextAreaInput
                id="emailcontent"
                sname="Email Body"
                placeholder="Enter email body here"
                value={content}
                setValue={setContent}
              />
              <ButtonUpload
                id="upload_email_logo_image"
                label="Upload Email Logo Image"
                file={imageFile}
                setFile={setImageFile}
                fileType={FILE_TYPE.IMAGE}
                uploaded={imageFileUploaded}
              />
            </div>

            <div className="w-full">
              <ButtonSettings
                bgColor="cyan"
                label="Save"
                onClick={onSaveTemplate}
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="loading w-[50px] h-[50px]">
          {loadingProgress > 0 ? (
            <div className="w-20 h-20">
              <CircularProgressbar
                styles={buildStyles({
                  pathColor: "#0052e4",
                  textColor: "#ffffff",
                  trailColor: "#888888",
                })}
                value={loadingProgress}
                maxValue={100}
                text={`${loadingProgress}%`}
              />
            </div>
          ) : (
            <RadialProgress width={50} height={50} />
          )}
        </div>
      )}
    </Layout>
  );
}
