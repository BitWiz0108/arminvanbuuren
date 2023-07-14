import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Layout from "@/components/Layout";
import PlayListTable from "@/components/PlayListTable";
import ButtonSettings from "@/components/ButtonSettings/index";
import PlayListMusicTable from "@/components/PlayListMusicTable";
import RadialProgress from "@/components/RadialProgress";

import { useAuthValues } from "@/contexts/contextAuth";

import usePlayList from "@/hooks/usePlayList";

import { IPlayList } from "@/interfaces/IPlayList";
import { IMusic } from "@/interfaces/IMusic";

export default function PlayList() {
  const { isSignedIn } = useAuthValues();
  const { isLoading, fetchAllPlayList, createPlayList, deletePlayList } =
    usePlayList();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [playLists, setPlayLists] = useState<Array<IPlayList>>([]);
  const [isDetailViewOpened, setIsDetailViewOpened] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [musics, setMusics] = useState<Array<IMusic>>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const clearFields = () => {
    setName("");
  };
  const onConfirm = () => {
    /*
    if ((!isEditing && !imageFile) || !name || !description) {
      toast.warn("Please type values correctly.");
      return;
    }
    createPlayList(
      imageFile!,
      name,
      description,
      releaseDate,
      uploadType,
      uploadType == UPLOAD_TYPE.FILE
        ? videoBackgroundFile!
        : videoBackgroundFileUrl,
      uploadType == UPLOAD_TYPE.FILE
        ? videoBackgroundFileCompressed!
        : videoBackgroundFileCompressedUrl
    ).then((value) => {
      if (value) {
        clearFields();
        fetchPlayLists();
        toast.success("Successfully added!");
      }
    });
    setIsDetailViewOpened(false);
*/
  };
  const fetchPlayLists = () => {
    fetchAllPlayList().then((value) => {
      if (value) {
        setPlayLists(value);
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchPlayLists();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const tableView = (
    <div className="w-full">
      <div className="w-full flex justify-start items-center p-5">
        <div className="w-40">
          <ButtonSettings
            label="Add"
            bgColor="cyan"
            onClick={() => {
              clearFields();
              setIsEditing(false);
              setIsDetailViewOpened(true);
            }}
          />
        </div>
      </div>
      <div className="w-full p-5">
        <PlayListTable
          playLists={playLists}
          deletePlayList={(id: number) =>
            deletePlayList(id).then((value) => {
              if (value) {
                fetchPlayLists();
                toast.success("Successfully deleted!");
              }
            })
          }
          updatePlayList={(id: number) => {
            setIsEditing(true);
            setSelectedId(id);
            setMusics(playLists[id].musics);
            const index = playLists.findIndex((album) => album.id == id);
            if (index >= 0) {
              setName(playLists[index].name);
              setIsDetailViewOpened(true);
            }
          }}
        />
      </div>
    </div>
  );

  const detailContentViiew = (
    <div className="relative w-full xl:w-4/5 2xl:w-2/3 flex justify-center items-center p-5">
      <div className="mt-16 p-5 w-full bg-[#2f363e] flex flex-col space-y-5 rounded-lg">
        <label className="text-3xl px-0 font-semibold">
          {isEditing ? "Edit" : "Add"} PlayList
        </label>
        <div className="w-full p-5">
          <PlayListMusicTable
            musics={musics}
            deleteMusicFromPlayList={(id: number) => {}}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex justify-center items-start overflow-x-hidden overflow-y-auto">
        {isDetailViewOpened ? detailContentViiew : tableView}

        {isLoading && (
          <div className="loading w-[50px] h-[50px]">
            <RadialProgress width={50} height={50} />
          </div>
        )}
      </div>
    </Layout>
  );
}
