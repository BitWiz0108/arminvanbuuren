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
import PlayListCreateModal from "@/components/PlayListCreateModal";
import X from "@/components/Icons/X";

export default function PlayList() {
  const { isSignedIn } = useAuthValues();
  const {
    isLoading,
    fetchAllPlayList,
    createPlayList,
    deletePlayList,
    deleteMusicFromPlayList,
  } = usePlayList();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [playLists, setPlayLists] = useState<Array<IPlayList>>([]);
  const [isDetailViewOpened, setIsDetailViewOpened] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number>(0);
  const [isPlayListCreateModalVisible, setIsPlayListCreateModalVisible] =
    useState<boolean>(false);

  const clearFields = () => {
    setName("");
  };

  const onHandleCreatePlayList = async (name: string) => {
    await createPlayList(name);
    fetchPlayLists();
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
            label="New playlist"
            bgColor="cyan"
            onClick={() => {
              clearFields();
              setIsPlayListCreateModalVisible(true);
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
            const index = playLists.findIndex((album) => album.id == id);
            setIsEditing(true);
            setSelectedId(index);
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
      <div className="mt-16 p-5 w-full flex flex-col space-y-5 rounded-lg">
        <div className="w-full top-5 px-8 items-center justify-center flex text-primary cursor-pointer">
          <label className="text-center text-2xl px-0 font-thin">{name}</label>
          <div className="ml-auto">
            <X
              width={24}
              height={24}
              onClick={() => setIsDetailViewOpened(false)}
            />
          </div>
        </div>
        <div className="w-full p-5">
          {playLists[selectedId]?.musics.length > 0 ? (
            <PlayListMusicTable
              musics={playLists[selectedId]?.musics}
              deleteMusicFromPlayList={(musicId: number) => {
                deleteMusicFromPlayList(playLists[selectedId].id, musicId).then(
                  () => {
                    fetchPlayLists();
                  }
                );
              }}
            />
          ) : (
            <div className="w-full h-20 top-10 flex items-center justify-center">
              <label>There is no music in this playlist.</label>
            </div>
          )}
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

        {isPlayListCreateModalVisible && (
          <PlayListCreateModal
            visible={isPlayListCreateModalVisible}
            createPlayList={(value: string) => {
              onHandleCreatePlayList(value);
            }}
            setVisible={setIsPlayListCreateModalVisible}
          />
        )}
      </div>
    </Layout>
  );
}
