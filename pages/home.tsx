import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { Value } from "@wojtekmaj/react-daterange-picker/dist/cjs/shared/types";

import Layout from "@/components/Layout";
import LineGraph from "@/components/LineGraph";
import PieGraph from "@/components/PieGraph";
import BarGraph from "@/components/BarGraph";
import GraphUp from "@/components/Icons/GraphUp";
import BarChart from "@/components/Icons/BarChart";
import DoughnutGraph from "@/components/DoughnutGraph";
import ItemTag from "@/components/ItemTag";
import Music from "@/components/Icons/Music";
import Mic from "@/components/Icons/Mic";
import PolarGraph from "@/components/PolarGraph";

import { useAuthValues } from "@/contexts/contextAuth";

import useDashBoard from "@/hooks/useDashboard";

import { BEST_SELLING_TYPE, DATE_FORMAT } from "@/libs/constants";
import { bigNumberFormat } from "@/libs/utils";

import { DEFAULT_MUSIC, IMusic } from "@/interfaces/IMusic";
import { DEFAULT_ISTREAM, IStream } from "@/interfaces/IStream";
import Album from "@/components/Icons/Album";
import RadialProgress from "@/components/RadialProgress";

export default function Home() {
  const { isLoading, fetchDashboardStats, fetchBestSelling } = useDashBoard();
  const { isSignedIn, user } = useAuthValues();
  const router = useRouter();

  const [totalFans, setTotalFans] = useState<number>(0);
  const [subscribedFans, setSubscribedFans] = useState<number>(0);
  const [freeFans, setFreeFans] = useState<number>(0);
  const [songCount, setSongCount] = useState<number>(0);
  const [livestreamCount, setLivestreamCount] = useState<number>(0);
  const [albumCount, setAlbumCount] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [subscriptionIncome, setSubscriptionIncome] = useState<number>(0);
  const [donationIncome, setDonationIncome] = useState<number>(0);
  const [planCount, setPlanCount] = useState<number>(0);
  const [mostFavoriteMusic, setMostFavoriteMusic] =
    useState<IMusic>(DEFAULT_MUSIC);
  const [mostFavoriteLivestream, setMostFavoriteLivestream] =
    useState<IStream>(DEFAULT_ISTREAM);
  const [bestSellingFromDate, setBestSellingFromDate] = useState<string>(
    moment("2023-03-05").format(DATE_FORMAT)
  );
  const [bestSellingToDate, setBestSellingToDate] = useState<string>(
    moment("2023-04-30").format(DATE_FORMAT)
  );
  const [bestSellingType, setBestSellingType] = useState<BEST_SELLING_TYPE>(
    BEST_SELLING_TYPE.DAILY
  );
  const [value, onChange] = useState<any>([new Date(), new Date()]);
  const [bestSellingLabel, setBestSellingLabel] = useState<any>();
  const [bestSellingDataset, setBestSellingDataset] = useState<any>();
  const [
    bestSellingSubscriptionIncomeDataset,
    setBestSellingSubscriptionIncomeDataset,
  ] = useState<any>();

  const fetchAllAnalysticsData = () => {
    fetchDashboardStats().then((data) => {
      setTotalFans(data.numberOfUsers);
      setSongCount(data.numberOfSongs);
      setLivestreamCount(data.numberOfLivestreams);
      setAlbumCount(data.numberOfAlbums);
      setTotalIncome(data.totalIncome);
      setDonationIncome(data.totalDonation);
      setSubscriptionIncome(data.totalSubscription);
      setPlanCount(data.numberOfPlans);
      setMostFavoriteLivestream(data.mostFavoriteLivestream);
      setMostFavoriteMusic(data.mostFavoriteMusic);
      setSubscribedFans(data.numberOfSubscribedUsers);
    });
  };

  const fetchBestSellingData = (
    type: BEST_SELLING_TYPE,
    from: string,
    to: string
  ) => {
    fetchBestSelling(type, from, to).then((data) => {
      let labels = [];
      let subScriptions = [];
      let subScriptionIncomes = [];
      switch (type) {
        case BEST_SELLING_TYPE.DAILY:
          for (let i = 0; i < data.sellingsPerDay.length; i++) {
            labels.push(data.sellingsPerDay[i].date);
            subScriptions.push(data.sellingsPerDay[i].subscriptionCount);
            subScriptionIncomes.push(
              data.sellingsPerDay[i].subscriptionCount * 5
            );
          }
          setBestSellingLabel(labels);
          setBestSellingDataset(subScriptions);
          setBestSellingSubscriptionIncomeDataset(subScriptionIncomes);
          break;

        case BEST_SELLING_TYPE.WEEKLY:
          for (let i = 0; i < data.sellingsPerWeek.length; i++) {
            labels.push(data.sellingsPerWeek[i].week);
            subScriptions.push(data.sellingsPerWeek[i].subscriptionCount);
            subScriptionIncomes.push(
              data.sellingsPerWeek[i].subscriptionCount * 5
            );
          }
          setBestSellingLabel(labels);
          setBestSellingDataset(subScriptions);
          setBestSellingSubscriptionIncomeDataset(subScriptionIncomes);
          break;

        case BEST_SELLING_TYPE.MONTHLY:
          for (let i = 0; i < data.sellingsPerMonth.length; i++) {
            labels.push(data.sellingsPerMonth[i].month);
            subScriptions.push(data.sellingsPerMonth[i].subscriptionCount);
            subScriptionIncomes.push(
              data.sellingsPerMonth[i].subscriptionCount * 5
            );
          }
          setBestSellingLabel(labels);
          setBestSellingDataset(subScriptions);
          setBestSellingSubscriptionIncomeDataset(subScriptionIncomes);
          break;

        default:
          break;
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchAllAnalysticsData();
      fetchBestSellingData(
        bestSellingType,
        bestSellingFromDate,
        bestSellingToDate
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, bestSellingType, bestSellingFromDate, bestSellingToDate]);

  useEffect(() => {
    if (value) {
      setBestSellingFromDate(value[0]);
      setBestSellingToDate(value[1]);
    }
  }, [value]);

  return (
    <Layout>
      <div className="relative w-full h-full min-h-screen justify-center items-center overflow-x-hidden overflow-y-auto pb-2">
        <h1 className="text-2xl xl:text-4xl font-800 pt-8 text-center">
          {" "}
          Welcome {user.username}{" "}
        </h1>
        <div className="w-full flex flex-col xl:flex-row items-start px-8 space-x-0 space-y-5 xl:space-x-5 xl:space-y-0 pt-4">
          <div className="w-full xl:w-1/2 flex flex-row p-5 bg-[#2f363e] rounded-lg">
            <div className="w-1/2">
              <PieGraph liveStream={livestreamCount} music={songCount} />
            </div>
            <div className="w-1/2">
              <div className="w-full flex justify-end items-end">
                <DateRangePicker onChange={onChange} value={value} />
              </div>
              <BarGraph
                labelsData={bestSellingLabel}
                datasets={bestSellingDataset}
              />
            </div>
          </div>
          <div className="w-full flex xl:w-1/2 items-center justify-center p-5 bg-[#2f363e] rounded-lg">
            <div className="w-full justify-center">
              <select
                onChange={(e) => {
                  setBestSellingType(e.target.value as BEST_SELLING_TYPE);
                }}
                className=" h-4 bg-[#2f363e]  border-[#2f363e] rounded-lg outline-none focus:outline-none transition-all duration-300"
              >
                <option value={BEST_SELLING_TYPE.DAILY}>DAILY</option>
                <option value={BEST_SELLING_TYPE.WEEKLY}>WEEKLY</option>
                <option value={BEST_SELLING_TYPE.MONTHLY}>MONTHLY</option>
              </select>
              <LineGraph
                dataLabel={bestSellingLabel}
                dataSets={bestSellingSubscriptionIncomeDataset}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row px-8 space-x-0 space-y-5 xl:space-x-5 xl:space-y-0">
          <div className="w-full xl:w-1/2 flex flex-col items-start pt-10 space-y-5">
            <ItemTag
              icon={<GraphUp width={30} height={30} />}
              stext={"Total Fans"}
              ltext={bigNumberFormat(totalFans)}
              description={
                "The shows the total amount of fans you have in your network."
              }
            />
            <ItemTag
              icon={<BarChart width={30} height={30} />}
              stext={"Total Income"}
              ltext={"$" + bigNumberFormat(totalIncome)}
              description={
                "This shows your total income from your fans since you have started on the app."
              }
            />
            <ItemTag
              icon={<Album fill={"#0084D1"} width={30} height={30} />}
              stext={"Total Albums"}
              ltext={bigNumberFormat(albumCount)}
              description={"This shows total number of albums of the artist."}
            />
            <div className="w-full bg-[#2f363e] flex flex-row rounded-lg mr-0 lx:mr-2 p-5">
              <div className="w-1/2 justify-center items-center">
                <DoughnutGraph
                  subscribedFans={subscribedFans}
                  freeFans={totalFans - subscribedFans}
                />
              </div>
              <div className="w-1/3 flex items-center">
                <div className="space-y-5">
                  <div className="w-full">Total Fans: {totalFans}</div>
                  <div className="w-full">
                    Subscribed Fans: {bigNumberFormat(subscribedFans)}
                  </div>
                  <div className="w-full">
                    Free Fans: {bigNumberFormat(totalFans - subscribedFans)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-1/2  pt-10">
            <div className="w-full bg-[#2f363e] flex flex-row rounded-lg p-5">
              <div className="w-2/3 justify-center items-center">
                <PolarGraph
                  totalIncome={totalIncome}
                  totalDonation={donationIncome}
                  totalSubscription={subscriptionIncome}
                />
              </div>
              <div className="w-1/3 flex items-center">
                <div className="space-y-5">
                  <div className="w-full">
                    Total Income: {bigNumberFormat(totalIncome)}
                  </div>
                  <div className="w-full">
                    Total Subscriptions: {bigNumberFormat(subscriptionIncome)}
                  </div>
                  <div className="w-full">
                    Total Donations: {bigNumberFormat(donationIncome)}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-[#2f363e] rounded-lg p-5 mt-8">
              <h1 className="text-2xl">Trending Items</h1>
              <div className="flex flex-row items-center space-x-5 border-b-[1px] border-gray-600 ">
                <h1 className="w-[5%] text-gray-500 font-bold text-xl">#1</h1>
                <Mic
                  className="w-[5%]"
                  width={36}
                  height={36}
                  color="#0084D1"
                />
                <h1 className="w-[65%] text-lg lg:text-xl">
                  {mostFavoriteLivestream?.title}
                </h1>
                <div className="w-[15%] flex flex-col justify-center items-center">
                  <h1 className="text-xl font-bold text-[#0084D1]">
                    {bigNumberFormat(mostFavoriteLivestream?.favorites?.length)}
                  </h1>
                  {mostFavoriteLivestream?.favorites?.length > 1 ? (
                    <h1 className="text-sm">Likes</h1>
                  ) : (
                    <h1 className="text-sm">Like</h1>
                  )}
                  {/* <h1 className="text-xl font-bold text-[#0084D1]">454,301</h1> */}
                </div>
                <BarChart className="w-[10%]" width={30} height={30} />
              </div>
              <div className="flex flex-row items-center space-x-5 pt-5">
                <h1 className="w-[5%] text-gray-500 font-bold text-xl">#1</h1>
                <Music
                  className="w-[5%]"
                  width={36}
                  height={36}
                  color="#0084D1"
                />
                <h1 className="w-[65%] text-lg lg:text-xl">
                  {mostFavoriteMusic?.title}
                </h1>
                <div className="w-[15%] flex flex-col justify-center items-center">
                  <h1 className="text-xl font-bold text-[#0084D1]">
                    {bigNumberFormat(mostFavoriteMusic?.favorites?.length)}
                  </h1>
                  {mostFavoriteMusic?.favorites?.length > 1 ? (
                    <h1 className="text-sm">Likes</h1>
                  ) : (
                    <h1 className="text-sm">Like</h1>
                  )}
                </div>
                <BarChart className="w-[10%]" width={30} height={30} />
              </div>
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
