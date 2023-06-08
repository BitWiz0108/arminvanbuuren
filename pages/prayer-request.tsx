import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Layout from "@/components/Layout";
import RadialProgress from "@/components/RadialProgress";
import PrayerRequestTable from "@/components/PrayerRequestTable";

import { useAuthValues } from "@/contexts/contextAuth";

import usePost from "@/hooks/usePost";
import usePrayerRequest from "@/hooks/usePrayerRequest";
import useArtist from "@/hooks/useArtist";

import { IPrayerRequest } from "@/interfaces/IPrayerRequest";

export default function FanClub() {
  const { isSignedIn, user } = useAuthValues();
  const { isLoading: isWorkingPost } = usePost();

  const { fetchPrayerRequests, deletePrayerRequest, setApproved } =
    usePrayerRequest();

  const { isLoading: isWorkingArtist } = useArtist();

  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [posts, setPosts] = useState<Array<IPrayerRequest>>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchPosts = () => {
    fetchPrayerRequests(page).then((data) => {
      if (data) {
        setTotalCount(data.pages);
        setPosts(data.posts);
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchPosts();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, page]);

  const tableView = (
    <div className="w-full">
      <div className="w-full p-5">
        <PrayerRequestTable
          prayerRequests={posts}
          page={page}
          setPage={(value: number) => setPage(value)}
          totalCount={totalCount}
          setApprove={(id: number, isApproved: boolean) => {
            setApproved(id, !isApproved).then((value) => {
              if (value) {
                fetchPosts();
                if (isApproved) {
                  toast.warn("Prayer request disapproved!");
                } else {
                  toast.success("Prayer request approved!");
                }
              }
            });
          }}
          deletePost={(id: number) =>
            deletePrayerRequest(id).then((value) => {
              if (value) {
                fetchPosts();
                toast.success("Successfully deleted!");
              }
            })
          }
        />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto">
        {tableView}
      </div>

      {(isWorkingPost || isWorkingArtist) && (
        <div className="loading">
          <RadialProgress width={50} height={50} />
        </div>
      )}
    </Layout>
  );
}
