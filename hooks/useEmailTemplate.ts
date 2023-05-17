import { useState } from "react";
import { toast } from "react-toastify";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IEmailTemplate } from "@/interfaces/IEmailTemplate";
import { useAuthValues } from "@/contexts/contextAuth";

import { EMAIL_TEMPLATE_TYPE } from "@/libs/constants";

const useEmailTemplate = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  const fetchEmailTemplate = async (type: EMAIL_TEMPLATE_TYPE) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/email-templates?type=${type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      if (response) {
        const data = await response.json();
        const emailData = data as IEmailTemplate;
        return emailData;
      }
    }

    setIsLoading(false);
    return null;
  };

  const updateEmailTemplate = async (
    id: number | null,
    type: EMAIL_TEMPLATE_TYPE,
    title: string,
    fromName: string,
    fromEmail: string,
    subject: string,
    content: string,
    imageFile: File | null
  ): Promise<IEmailTemplate | null> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setLoadingProgress(0);

      const formData = new FormData();
      if (id) formData.append("id", id.toString());
      else formData.append("id", "");
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }
      formData.append("title", title.toString());
      formData.append("fromName", fromName.toString());
      formData.append("fromEmail", fromEmail.toString());
      formData.append("subject", subject.toString());
      formData.append("content", content.toString());

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", `${API_BASE_URL}/${API_VERSION}/admin/email-templates`);

      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round(
            (event.loaded / event.total) * 100
          );
          setLoadingProgress(percentCompleted);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201 || xhr.status === 202) {
          setIsLoading(false);
          const data = JSON.parse(xhr.response);
          const music = data as IEmailTemplate;

          resolve(music);
        } else {
          if (xhr.status === 500) {
            toast.error("Error occurred while updating the email template.");
            setIsLoading(false);
          } else {
            const data = JSON.parse(xhr.responseText);
            toast.error(data.message);
            setIsLoading(false);
          }

          reject(xhr.statusText);
        }
      };

      xhr.onloadend = () => {
        setLoadingProgress(0);
      };

      xhr.send(formData);
    });
  };

  return {
    isLoading,
    loadingProgress,
    fetchEmailTemplate,
    updateEmailTemplate,
  };
};
export default useEmailTemplate;
