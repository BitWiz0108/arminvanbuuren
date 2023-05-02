import { useState } from "react";
import { toast } from "react-toastify";
import { getAWSSignedURL } from "@/libs/aws";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IEmailTemplate } from "@/interfaces/IEmailTemplate";
import { useAuthValues } from "@/contexts/contextAuth";

import { EMAIL_TEMPLATE_TYPE } from "@/libs/constants";

const useEmailTemplate = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        const logoImg = await getAWSSignedURL(emailData.logoImage);
        emailData.logoImage = logoImg;
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
  ) => {
    setIsLoading(true);

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

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/email-templates`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const emailData = data as IEmailTemplate;
      emailData.logoImage = await getAWSSignedURL(emailData.logoImage);

      return emailData;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating the email template.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  return { isLoading, fetchEmailTemplate, updateEmailTemplate };
};
export default useEmailTemplate;
