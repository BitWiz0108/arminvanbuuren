import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import moment from "moment";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings/index";
import TextInput from "@/components/TextInput";
import RadialProgress from "@/components/RadialProgress";
import UserTable from "@/components/UserTable";

import { useAuthValues } from "@/contexts/contextAuth";
import Edit from "@/components/Icons/Edit";
import Profile from "@/components/Icons/Profile";
import Select from "@/components/Select";
import DateInput from "@/components/DateInput";
import Switch from "@/components/Switch";

import useUser from "@/hooks/useUser";

import {
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  IMAGE_SM_BLUR_DATA_URL,
  GENDER,
} from "@/libs/constants";
import { checkContainsSpecialCharacters } from "@/libs/utils";

import {
  DEFAULT_USERQUERYPARAM,
  IUser,
  IUserQueryParam,
} from "@/interfaces/IUser";

export default function User() {
  const avatarImageRef = useRef(null);

  const { isSignedIn } = useAuthValues();
  const {
    isLoading,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    fetchLocation,
  } = useUser();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [isDetailViewOpened, setIsDetailViewOpened] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<GENDER>(GENDER.MALE);
  const [dob, setDob] = useState<string>(moment().format(DATETIME_FORMAT));
  const [address, setAddress] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [avatarImagePreview, setAvatarImagePreview] =
    useState<string>(DEFAULT_AVATAR_IMAGE);
  const [avatarImageFile, setAvatarImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const [isAvatarImageHover, setIsAvatarImageHover] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [queryParams, setQueryParams] = useState<IUserQueryParam>(
    DEFAULT_USERQUERYPARAM
  );

  const changeQueryParam = (key: string, value: number | string) => {
    setQueryParams({ ...queryParams, [key]: value });
  };

  const clearFields = () => {
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setGender(GENDER.MALE);
    setDob(moment().format(DATETIME_FORMAT));
    setAddress("");
    setZipcode("");
    setAvatarImagePreview(DEFAULT_AVATAR_IMAGE);
    setAvatarImageFile(null);
    setStatus(false);
  };

  const onConfirm = () => {
    if (!gender || gender == GENDER.NONE) {
      toast.error("Please select gender.");
      return;
    }

    if (!username || !email) {
      toast.error("Username and email can't be empty.");
      return;
    }

    if (username.includes(" ") || checkContainsSpecialCharacters(username)) {
      toast.error("Username can't contain space or a special character.");
      return;
    }

    if (isEditing) {
      updateUser(
        selectedId,
        username,
        firstName,
        lastName,
        email,
        avatarImageFile,
        gender,
        dob,
        status,
        address,
        country,
        state,
        city,
        zipcode
      ).then((value) => {
        if (value) {
          clearFields();
          fetchUserList();

          toast.success("Successfully updated!");
        }
      });
    } else if (!isEditing) {
      addUser(
        username,
        firstName,
        lastName,
        email,
        password,
        avatarImageFile,
        gender,
        dob,
        status,
        address,
        country,
        state,
        city,
        zipcode
      ).then((value) => {
        if (value) {
          clearFields();
          fetchUserList();

          toast.success("Successfully added!");
        }
      });
    }

    setIsDetailViewOpened(false);
  };

  const fetchUserList = () => {
    fetchUsers(queryParams).then((value) => {
      if (value) {
        setTotalCount(value.pages);
        setUsers(value.users);
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchUserList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSignedIn,
    isSignedIn,
    queryParams.page,
    queryParams.limit,
    queryParams.fullName,
    queryParams.email,
    queryParams.status,
    queryParams.createdAt,
  ]);

  const tableView = (
    <div className="w-full">
      <div className="w-full flex justify-end items-center p-5">
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
      <div className="w-full p-5 pt-10">
        <UserTable
          users={users}
          queryParam={queryParams}
          changeQueryParam={changeQueryParam}
          totalCount={totalCount}
          deleteUser={(id: number) =>
            deleteUser(id).then((value) => {
              if (value) {
                fetchUserList();

                toast.success("Successfully deleted!");
              }
            })
          }
          updateUser={(id: number) => {
            setIsEditing(true);
            const index = users.findIndex((user) => user.id == id);
            if (index >= 0) {
              setUsername(users[index].username ?? "");
              setFirstName(users[index].firstName ?? "");
              setLastName(users[index].lastName ?? "");
              setEmail(users[index].email ?? "");
              setGender(users[index].gender ?? GENDER.MALE);
              setDob(users[index].dob ?? moment().format(DATETIME_FORMAT));
              setAddress(users[index].address ?? "");
              setCountry(users[index].country ?? "");
              setState(users[index].state ?? "");
              setCity(users[index].city ?? "");
              setZipcode(users[index].zipcode ?? "");
              setAvatarImagePreview(
                users[index].avatarImage ?? DEFAULT_AVATAR_IMAGE
              );
              setAvatarImageFile(null);
              setStatus(users[index].status ? true : false);
              setSelectedId(id);
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
        <div className="w-full px-0 flex flex-col">
          <div className="w-full flex justify-center -mt-16 mb-10">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden border border-secondary cursor-pointer bg-third"
              onMouseEnter={() => setIsAvatarImageHover(true)}
              onMouseLeave={() => setIsAvatarImageHover(false)}
              onClick={() => {
                if (avatarImageRef) {
                  // @ts-ignore
                  avatarImageRef.current.click();
                }
              }}
            >
              <input
                ref={avatarImageRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    if (files[0]) {
                      setAvatarImageFile(files[0]);

                      const reader = new FileReader();
                      reader.onload = () => {
                        setAvatarImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(files[0]);
                    }
                  }
                }}
                accept="image/*"
              />
              <Image
                className="w-full h-full object-cover"
                src={avatarImagePreview ?? DEFAULT_AVATAR_IMAGE}
                width={200}
                height={200}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_SM_BLUR_DATA_URL}
              />
              {isAvatarImageHover && (
                <div className="absolute left-0 top-0 w-full h-full bg-[#000000aa] flex justify-center items-center">
                  <Edit width={26} height={26} />
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex justify-center items-center relative mb-5">
            <Switch
              label="Active"
              labelPos="right"
              checked={status}
              setChecked={setStatus}
            />
          </div>

          <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-5">
            <TextInput
              sname="First name"
              label=""
              placeholder="First Name"
              type="text"
              value={firstName}
              setValue={setFirstName}
            />
            <TextInput
              sname="Last name"
              label=""
              placeholder="Last Name"
              type="text"
              value={lastName}
              setValue={setLastName}
            />
          </div>

          <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-5">
            <div className="w-full flex">
              <TextInput
                sname="Username"
                label=""
                placeholder="Username"
                type="text"
                value={username}
                setValue={setUsername}
                icon={<Profile width={20} height={20} />}
              />
            </div>
            <div className="w-full flex">
              <TextInput
                sname="Email"
                label=""
                placeholder="Email"
                type="text"
                value={email}
                setValue={setEmail}
              />
            </div>
            {!isEditing && (
              <div className="w-full flex">
                <TextInput
                  sname="Password"
                  label=""
                  placeholder="Password"
                  type="text"
                  value={password}
                  setValue={setPassword}
                />
              </div>
            )}{" "}
          </div>

          <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-5">
            <div className="w-full flex">
              <Select
                label="Gender"
                defaultValue={GENDER.NONE}
                defaultLabel="Gender"
                options={[GENDER.MALE, GENDER.FEMALE].map((value) => {
                  return { label: value, value };
                })}
                value={gender}
                setValue={setGender}
              />
            </div>
            <div className="w-full flex">
              <DateInput
                sname="DOB"
                label=""
                placeholder="Date of birth"
                value={dob}
                setValue={setDob}
                isTime={false}
              />
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-5">
            <TextInput
              sname="Zip code"
              label=""
              placeholder="Zip code"
              type="text"
              value={zipcode}
              setValue={(zipcode: string) => {
                setZipcode(zipcode);

                if (zipcode) {
                  fetchLocation(zipcode).then((value) => {
                    if (value) {
                      setCountry(value.country);
                      setState(value.state);
                      setCity(value.city);
                    }
                  });
                }
              }}
            />
            <TextInput
              sname="Address"
              label=""
              placeholder="1234 Main St"
              type="text"
              value={address}
              setValue={setAddress}
            />
          </div>

          <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-5">
            <TextInput
              sname="Country"
              label=""
              placeholder="Country"
              type="text"
              value={country}
              setValue={setCountry}
            />
            <TextInput
              sname="State"
              label=""
              placeholder="State"
              type="text"
              value={state}
              setValue={setState}
            />
            <TextInput
              sname="City"
              label=""
              placeholder="City"
              type="text"
              value={city}
              setValue={setCity}
            />
          </div>

          <div className="w-full flex flex-row space-x-5 mt-5">
            <ButtonSettings
              label="Cancel"
              onClick={() => setIsDetailViewOpened(false)}
            />
            <ButtonSettings bgColor="cyan" label="Save" onClick={onConfirm} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="relative w-full min-h-screen flex justify-center items-start overflow-x-hidden overflow-y-auto">
        {isDetailViewOpened ? detailContentViiew : tableView}

        {isLoading && (
          <div className="loading">
            <RadialProgress width={50} height={50} />
          </div>
        )}
      </div>
    </Layout>
  );
}
