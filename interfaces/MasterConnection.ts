import { toast } from "react-toastify";
import * as AWS from "aws-sdk";
import * as KVSWebRTC from "amazon-kinesis-video-streams-webrtc";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "@/libs/constants";
import { printPeerConnectionStateInfo, printSignalingLog } from "@/libs/aws";

class MasterConnection {
  private master: Master = {
    localView: null,
    kinesisVideoClient: null,
    signalingClient: null,
    storageClient: null,
    channelARN: "",
    streamARN: "",
    peerConnectionByClientId: {},
    dataChannelByClientId: {},
    localStream: null,
    remoteStreams: [],
    peerConnectionStatsInterval: null,
  };

  public async createSignalingChannel(channelName: string) {
    try {
      console.log(
        "[CREATE_SIGNALING_CHANNEL] Attempting to create signaling channel with name",
        channelName
      );
      // Create KVS client
      const kinesisVideoClient = new AWS.KinesisVideo({
        region: AWS_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      });

      // Get signaling channel ARN
      await kinesisVideoClient
        .createSignalingChannel({
          ChannelName: channelName,
        })
        .promise();

      // Get signaling channel ARN
      const describeSignalingChannelResponse = await kinesisVideoClient
        .describeSignalingChannel({
          ChannelName: channelName,
        })
        .promise();
      const channelARN =
        describeSignalingChannelResponse.ChannelInfo?.ChannelARN!;
      console.log(
        "[CREATE_SIGNALING_CHANNEL] Success! Channel ARN:",
        channelARN
      );

      toast.success("Successfully created channel!");
    } catch (e: any) {
      console.error("[CREATE_SIGNALING_CHANNEL] Encountered error:", e);
      if (e.name == "ResourceInUseException") {
        toast.error("Channel is already in use.");
      } else {
        toast.error(
          "Encountered error while creating channel! Please try again."
        );
      }
    }
  }

  public async startMaster(
    localView: HTMLVideoElement,
    channelName: string,
    widescreen: boolean,
    ingestMedia: boolean,
    onStatsReport: (value: RTCStatsReport) => void,
    onRemoteDataMessage: Function
  ) {
    try {
      this.master.localView = localView;

      // Create KVS client
      const kinesisVideoClient = new AWS.KinesisVideo({
        region: AWS_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        correctClockSkew: true,
      });
      this.master.kinesisVideoClient = kinesisVideoClient;

      // Get signaling channel ARN
      const describeSignalingChannelResponse = await kinesisVideoClient
        .describeSignalingChannel({
          ChannelName: channelName,
        })
        .promise();
      const channelARN =
        describeSignalingChannelResponse.ChannelInfo?.ChannelARN;
      console.log("[MASTER] Channel ARN:", channelARN);

      this.master.channelARN = channelARN!;

      const protocols = ["WSS", "HTTPS"];

      // Ingest media
      if (ingestMedia) {
        const describeMediaStorageConfigurationResponse =
          await kinesisVideoClient
            .describeMediaStorageConfiguration({
              ChannelARN: this.master.channelARN,
            })
            .promise();
        const mediaStorageConfiguration =
          describeMediaStorageConfigurationResponse.MediaStorageConfiguration;

        if (
          mediaStorageConfiguration?.Status !== "ENABLED" ||
          mediaStorageConfiguration?.StreamARN === null
        ) {
          console.error(
            "[MASTER] The media storage configuration is not yet configured for this channel."
          );
          return false;
        }

        this.master.streamARN = mediaStorageConfiguration.StreamARN!;
        console.log(`[MASTER] Stream ARN: ${this.master.streamARN}`);

        protocols.push("WEBRTC");
      } else {
        this.master.streamARN = "";
      }

      // Get signaling channel endpoints
      const getSignalingChannelEndpointResponse = await kinesisVideoClient
        .getSignalingChannelEndpoint({
          ChannelARN: this.master.channelARN,
          SingleMasterChannelEndpointConfiguration: {
            Protocols: protocols,
            Role: KVSWebRTC.Role.MASTER,
          },
        })
        .promise();
      const endpointsByProtocol =
        getSignalingChannelEndpointResponse.ResourceEndpointList?.reduce(
          (endpoints, endpoint) => {
            // @ts-ignore
            endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            return endpoints;
          },
          {}
        );
      console.log("[MASTER] Endpoints:", endpointsByProtocol);

      // Create Signaling Client
      this.master.signalingClient = new KVSWebRTC.SignalingClient({
        channelARN: this.master.channelARN,
        // @ts-ignore
        channelEndpoint: endpointsByProtocol?.WSS,
        role: KVSWebRTC.Role.MASTER,
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
        systemClockOffset: kinesisVideoClient.config.systemClockOffset,
      });

      if (ingestMedia) {
        this.master.storageClient = new AWS.KinesisVideoWebRTCStorage({
          region: AWS_REGION,
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
          // @ts-ignore
          endpoint: endpointsByProtocol?.WEBRTC,
        });
      }

      // Get ICE server configuration
      const kinesisVideoSignalingChannelsClient =
        new AWS.KinesisVideoSignalingChannels({
          region: AWS_REGION,
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
          // @ts-ignore
          endpoint: endpointsByProtocol?.HTTPS,
          correctClockSkew: true,
        });
      const getIceServerConfigResponse =
        await kinesisVideoSignalingChannelsClient
          .getIceServerConfig({
            ChannelARN: this.master.channelARN,
          })
          .promise();
      const iceServers = [];
      // Don't add stun if user selects TURN only or NAT traversal disabled
      iceServers.push({
        urls: `stun:stun.kinesisvideo.${AWS_REGION}.amazonaws.com:443`,
      });
      console.log("[MASTER] ICE servers:", iceServers);

      const configuration = {
        iceServers,
        iceTransportPolicy: "all",
      } as RTCConfiguration;

      const resolution = widescreen
        ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }
        : { width: { ideal: 640 }, height: { ideal: 480 } };
      const constraints = {
        video: resolution,
        audio: true,
      };

      // Get a stream from the webcam and display it in the local view.
      // If no video/audio needed, no need to request for the sources.
      // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
      try {
        this.master.localStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        localView.srcObject = this.master.localStream;
      } catch (e) {
        console.error(
          `[MASTER] Could not find ${Object.keys(constraints).filter(
            // @ts-ignore
            (k) => constraints[k]
          )} input device.`,
          e
        );
        return false;
      }

      this.master.signalingClient.on("open", async () => {
        console.log("[MASTER] Connected to signaling service");
        if (ingestMedia && this.master.streamARN) {
          try {
            console.log("[MASTER] Joining storage session...");
            await this.master
              .storageClient!.joinStorageSession({
                channelArn: this.master.channelARN,
              })
              .promise();

            console.log(
              "[MASTER] Joined storage session. Media is being recorded to",
              this.master.streamARN
            );
          } catch (e) {
            console.error("[MASTER] Error joining storage session", e);
          }
        }
      });

      this.master.signalingClient.on(
        "sdpOffer",
        async (offer, remoteClientId) => {
          printSignalingLog(
            "[MASTER] Received SDP offer from client",
            remoteClientId
          );
          console.debug("SDP offer:", offer);

          // Create a new peer connection using the offer from the given client
          const peerConnection = new RTCPeerConnection(configuration);
          this.master.peerConnectionByClientId[remoteClientId] = peerConnection;

          this.master.dataChannelByClientId[remoteClientId] =
            peerConnection.createDataChannel("kvsDataChannel");
          peerConnection.ondatachannel = (event) => {
            // @ts-ignore
            event.channel.onmessage = onRemoteDataMessage;
          };

          // Poll for connection stats
          if (!this.master.peerConnectionStatsInterval) {
            this.master.peerConnectionStatsInterval = setInterval(
              () => peerConnection.getStats().then(onStatsReport),
              10000
            );
          }

          peerConnection.addEventListener(
            "connectionstatechange",
            async (event) => {
              printPeerConnectionStateInfo(event, "[MASTER]", remoteClientId);
            }
          );

          // Send any ICE candidates to the other peer
          peerConnection.addEventListener("icecandidate", ({ candidate }) => {
            if (candidate) {
              printSignalingLog(
                "[MASTER] Generated ICE candidate for client",
                remoteClientId
              );
              console.debug("ICE candidate:", candidate);

              // When trickle ICE is enabled, send the ICE candidates as they are generated.
              printSignalingLog(
                "[MASTER] Sending ICE candidate to client",
                remoteClientId
              );
              this.master.signalingClient?.sendIceCandidate(
                candidate,
                remoteClientId
              );
            } else {
              printSignalingLog(
                "[MASTER] All ICE candidates have been generated for client",
                remoteClientId
              );

              // When trickle ICE is disabled, send the answer now that all the ICE candidates have ben generated.
              printSignalingLog(
                "[MASTER] Sending SDP answer to client",
                remoteClientId
              );
              console.debug("SDP answer:", peerConnection.localDescription);
              this.master.signalingClient?.sendSdpAnswer(
                peerConnection.localDescription!,
                remoteClientId
              );
            }
          });

          // As remote tracks are received, add them to the remote view
          peerConnection.addEventListener("track", (event) => {
            printSignalingLog(
              "[MASTER] Received remote track from client",
              remoteClientId
            );
          });

          // If there's no video/audio, this.master.localStream will be null. So, we should skip adding the tracks from it.
          if (this.master.localStream) {
            this.master.localStream
              .getTracks()
              .forEach((track) =>
                peerConnection.addTrack(track, this.master.localStream!)
              );
          }
          await peerConnection.setRemoteDescription(offer);

          // Create an SDP answer to send back to the client
          printSignalingLog(
            "[MASTER] Creating SDP answer for client",
            remoteClientId
          );
          await peerConnection.setLocalDescription(
            await peerConnection.createAnswer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            })
          );

          // When trickle ICE is enabled, send the answer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
          printSignalingLog(
            "[MASTER] Sending SDP answer to client",
            remoteClientId
          );
          console.debug("SDP answer:", peerConnection.localDescription);
          this.master.signalingClient?.sendSdpAnswer(
            peerConnection.localDescription!,
            remoteClientId
          );
          printSignalingLog(
            "[MASTER] Generating ICE candidates for client",
            remoteClientId
          );
        }
      );

      this.master.signalingClient.on(
        "iceCandidate",
        async (candidate, remoteClientId) => {
          printSignalingLog(
            "[MASTER] Received ICE candidate from client",
            remoteClientId
          );
          console.debug("[MASTER] ICE candidate:", candidate);

          // Add the ICE candidate received from the client to the peer connection
          const peerConnection =
            this.master.peerConnectionByClientId[remoteClientId];
          peerConnection.addIceCandidate(candidate);
        }
      );

      this.master.signalingClient.on("close", () => {
        console.log("[MASTER] Disconnected from signaling channel");
      });

      this.master.signalingClient.on("error", (error) => {
        console.error("[MASTER] Signaling client error", error);
      });

      console.log("[MASTER] Starting master connection");
      this.master.signalingClient.open();

      toast.success("Successfully started master connection!");

      return true;
    } catch (e) {
      console.error("[MASTER] Encountered error starting:", e);
      toast.error(
        "Encountered error while starting master connection! Please try again."
      );
    }
    return false;
  }

  public stopMaster() {
    try {
      console.log("[MASTER] Stopping master connection");
      if (this.master.signalingClient) {
        this.master.signalingClient.close();
        this.master.signalingClient = null;
      }

      Object.keys(this.master.peerConnectionByClientId).forEach((clientId) => {
        this.master.peerConnectionByClientId[clientId].close();
      });
      this.master.peerConnectionByClientId = {};

      if (this.master.localStream) {
        this.master.localStream.getTracks().forEach((track) => track.stop());
        this.master.localStream = null;
      }

      this.master.remoteStreams.forEach((remoteStream) =>
        remoteStream.getTracks().forEach((track: any) => track.stop())
      );
      this.master.remoteStreams = [];

      if (this.master.peerConnectionStatsInterval) {
        clearInterval(this.master.peerConnectionStatsInterval);
        this.master.peerConnectionStatsInterval = null;
      }

      if (this.master.localView) {
        this.master.localView.srcObject = null;
      }

      if (this.master.dataChannelByClientId) {
        this.master.dataChannelByClientId = {};
      }

      toast.success("Successfully stopped master connection!");

      return true;
    } catch (e) {
      console.error("[MASTER] Encountered error stopping", e);

      toast.error(
        "Encountered error while stopping master connection! Please try again."
      );
    }
    return false;
  }

  public sendMasterMessage(message: string) {
    if (message === "") {
      console.warn("[MASTER] Trying to send an empty message?");
      return false;
    }
    if (Object.keys(this.master.dataChannelByClientId).length === 0) {
      console.warn("[MASTER] No viewers have connected yet!");
      return false;
    }

    let sent = false;
    Object.keys(this.master.dataChannelByClientId).forEach((clientId) => {
      try {
        this.master.dataChannelByClientId[clientId].send(message);
        console.log("[MASTER] Sent", message, "to", clientId);
        sent = true;
      } catch (e: any) {
        console.error("[MASTER] Send DataChannel:", e.toString());
      }
    });
    return sent;
  }
}

interface Master {
  localView: HTMLVideoElement | null;
  kinesisVideoClient: AWS.KinesisVideo | null;
  signalingClient: KVSWebRTC.SignalingClient | null;
  storageClient: AWS.KinesisVideoWebRTCStorage | null;
  channelARN: string;
  streamARN: string;
  peerConnectionByClientId: { [clientId: string]: RTCPeerConnection };
  dataChannelByClientId: { [clientId: string]: RTCDataChannel };
  localStream: MediaStream | null;
  remoteStreams: MediaStream[];
  peerConnectionStatsInterval: NodeJS.Timeout | null;
}

export default MasterConnection;
