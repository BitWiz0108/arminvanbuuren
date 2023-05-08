import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

import Layout from "@/components/Layout";
import TextInput from "@/components/TextInput";
import ButtonSettings from "@/components/ButtonSettings";
import RadialProgress from "@/components/RadialProgress";

import { useAuthValues } from "@/contexts/contextAuth";

import usePayment from "@/hooks/usePayment";

export default function EmailTemplate() {
  const { isSignedIn } = useAuthValues();

  const { isLoading, fetchPaymentSettings, updatePaymentSettings } = usePayment();

  const [paypalClientId, setPaypalClientId] = useState<string>("");
  const [paypalClientSecret, setPaypalClientSecret] = useState<string>("");
  const [stripePublicApiKey, setStripePublicApiKey] = useState<string>("");
  const [stripeSecretKey, setStripeSecretKey] = useState<string>("");


  const onSavePaymentSettings = () => {
    updatePaymentSettingsData();
  };

  const fetchPaymentSettingsData = () => {
    fetchPaymentSettings().then((value) => {
      if (value) {
        setPaypalClientId(value.paypalClientId);
        setPaypalClientSecret(value.paypalClientSecret);
        setStripePublicApiKey(value.stripePublicApiKey);
        setStripeSecretKey(value.stripeSecretKey);
      }
    });
  };

  const updatePaymentSettingsData = () => {
    if (!paypalClientId || !paypalClientSecret || !stripePublicApiKey || !stripeSecretKey) {
      toast.warn("Please enter all values correctly.");
      return;
    }

    updatePaymentSettings(
      paypalClientId,
      paypalClientSecret,
      stripePublicApiKey,
      stripeSecretKey,
    ).then((value) => {
      if (value) {
        setPaypalClientId(value.paypalClientId);
        setPaypalClientSecret(value.paypalClientSecret);
        setStripePublicApiKey(value.stripePublicApiKey);
        setStripeSecretKey(value.stripeSecretKey);
        toast.success("Successfully updated!");
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchPaymentSettingsData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <Layout>
      <div className="realtive w-full flex justify-center items-start">
        <div className="relative w-full xl:w-4/5 2xl:w-2/3 min-h-screen flex flex-col justify-start items-center p-5">
          <div className="mt-10 w-full p-5 bg-[#2f363e] rounded-lg">
            <label className="text-3xl font-semibold">Payment Settings</label>

            <div className="w-full mb-5">
              <div className="flex flex-col sm:flex-row">
                <TextInput
                  sname="Paypal Client Id"
                  label=""
                  placeholder="Paypal Client Id"
                  type="text"
                  value={paypalClientId}
                  setValue={setPaypalClientId}
                />
              </div>
              <div className="flex flex-col sm:flex-row">
                <TextInput
                  sname="Paypal Client Secret"
                  label=""
                  placeholder="Paypal Client Secret"
                  type="text"
                  value={paypalClientSecret}
                  setValue={setPaypalClientSecret}
                />
              </div>
              <div className="flex flex-col sm:flex-row mt-5">
                <TextInput
                  sname="Stripe Public Api Key"
                  label=""
                  placeholder="Stripe Public Api Key"
                  type="text"
                  value={stripePublicApiKey}
                  setValue={setStripePublicApiKey}
                />
              </div>
              <div className="flex flex-col sm:flex-row">
                <TextInput
                  sname="Stripe Secret Key"
                  label=""
                  placeholder="Stripe Secret KeySecret"
                  type="text"
                  value={stripeSecretKey}
                  setValue={setStripeSecretKey}
                />
              </div>
            </div>

            <div className="w-full">
              <ButtonSettings
                bgColor="cyan"
                label="Save"
                onClick={onSavePaymentSettings}
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="loading">
          <RadialProgress width={50} height={50} />
        </div>
      )}
    </Layout>
  );
}
