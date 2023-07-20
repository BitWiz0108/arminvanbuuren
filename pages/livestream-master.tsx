import { useState, useRef } from "react";

import ButtonSettings from "@/components/ButtonSettings";
import TextInput from "@/components/TextInput";
import Layout from "@/components/Layout";
import RadialProgress from "@/components/RadialProgress";

import MasterConnection from "@/interfaces/MasterConnection";
import { toast } from "react-toastify";

const LivestreamMaster = () => {
  const localViewRef = useRef<HTMLVideoElement>(null);

  const [channelName, setChannelName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const masterConnection = new MasterConnection();

  const onCreateChannel = async () => {
    if (!channelName) {
      toast.warn("Please enter channel name correctly.");
      return;
    }

    setIsLoading(true);
    await masterConnection.createSignalingChannel(channelName);
    setIsLoading(false);
  };

  const onStart = async () => {
    setIsLoading(true);
    const result = await masterConnection.startMaster(
      localViewRef.current!,
      channelName,
      true,
      false,
      (report: any) => {
        // Only print these to the console, as this prints a LOT of stuff.
        console.debug("[STATS]", Object.fromEntries([...report.entries()]));
      },
      (event: any) => {
        console.log(`Message: ${event.data}\n`);
      }
    );
    setIsConnected(result);
    setIsLoading(false);
  };

  const onStop = () => {
    setIsConnected(!masterConnection.stopMaster());
  };

  return (
    <Layout>
      <div className="realtive w-screen flex flex-col justify-start items-center">
        <div className="w-full flex justify-center items-center">
          <div className="w-full md:w-1/2 flex flex-col justify-start items-center p-2 space-y-2">
            <TextInput
              sname="Channel Name"
              label=""
              placeholder="Channel Name"
              type="text"
              value={channelName}
              setValue={setChannelName}
            />

            {channelName && (
              <div className="w-full flex justify-start items-center space-x-2">
                {isConnected ? (
                  <ButtonSettings
                    disabled={isLoading}
                    label="Stop Master"
                    bgColor={"1"}
                    onClick={onStop}
                  />
                ) : (
                  <>
                    <ButtonSettings
                      disabled={isLoading}
                      label="Create Channel"
                      bgColor={"1"}
                      onClick={onCreateChannel}
                    />
                    <ButtonSettings
                      disabled={isLoading}
                      label="Start Master"
                      bgColor={"1"}
                      onClick={onStart}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <video
          ref={localViewRef}
          className="w-full"
          autoPlay
          playsInline
          controls
          muted
        />

        {isLoading && (
          <div className="loading">
            <RadialProgress width={50} height={50} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LivestreamMaster;
