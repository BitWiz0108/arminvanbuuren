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

import { IUser } from "@/interfaces/IUser";
import { DEFAULT_COUNTRY, ICountry } from "@/interfaces/ICountry";
import { DEFAULT_STATE, IState } from "@/interfaces/IState";
import { DEFAULT_CITY, ICity } from "@/interfaces/ICity";

export default function User() {
  const avatarImageRef = useRef(null);

  const { isSignedIn } = useAuthValues();
  const {
    isLoading,
    fetchUsers,
    updateUser,
    deleteUser,
    fetchCountries,
    fetchStates,
    fetchCities,
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
  const [country, setCountry] = useState<ICountry>(DEFAULT_COUNTRY);
  const [state, setState] = useState<IState>(DEFAULT_STATE);
  const [city, setCity] = useState<ICity>(DEFAULT_CITY);
  const [zipcode, setZipcode] = useState<string>("");
  const [avatarImagePreview, setAvatarImagePreview] =
    useState<string>(DEFAULT_AVATAR_IMAGE);
  const [avatarImageFile, setAvatarImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const [isAvatarImageHover, setIsAvatarImageHover] = useState<boolean>(false);
  const [countries, setCountries] = useState<Array<ICountry>>([]);
  const [states, setStates] = useState<Array<IState>>([]);
  const [cities, setCities] = useState<Array<ICity>>([]);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const clearFields = () => {
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setGender(GENDER.MALE);
    setDob(moment().format(DATETIME_FORMAT));
    setAddress("");
    setCountry(DEFAULT_COUNTRY);
    setState(DEFAULT_STATE);
    setCity(DEFAULT_CITY);
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
        country.id,
        state.id,
        city.id,
        zipcode
      ).then((value) => {
        if (value) {
          clearFields();
          fetchUserList();

          toast.success("Successfully updated!");
        }
      });
    }

    setIsDetailViewOpened(false);
  };

  const fetchUserList = () => {
    fetchUsers(page).then((value) => {
      if (value) {
        setTotalCount(value.pages);
        setUsers(value.users);
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchUserList();
      fetchCountries().then((value) => {
        setCountries(value);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, page]);

  useEffect(() => {
    fetchStates(country.id).then((value) => {
      setStates(value);
    });
    fetchCities(state.id).then((value) => {
      setCities(value);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, state]);

  const tableView = (
    <div className="w-full">
      <div className="w-full p-5 pt-10">
        <UserTable
          users={users}
          page={page}
          setPage={(value: number) => setPage(value)}
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
              setCountry(users[index].country ?? DEFAULT_COUNTRY);
              setState(users[index].state ?? DEFAULT_STATE);
              setCity(users[index].city ?? DEFAULT_CITY);
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
              />
            </div>
          </div>

          <div className="w-full flex flex-col xl:flex-row space-x-0 xl:space-x-5">
            <Select
              label="Country"
              defaultValue={""}
              defaultLabel="Country"
              options={countries.map((value) => {
                return {
                  label: value.iso,
                  value: value.id ? value.id.toString() : "",
                };
              })}
              value={country.id ?? ""}
              setValue={(value: string) => {
                const id = Number(value);
                const index = countries.findIndex((country) => {
                  return country.id == id;
                });
                if (index >= 0) {
                  setCountry(countries[index]);
                }
              }}
            />
            <Select
              label="State"
              defaultValue={""}
              defaultLabel="State"
              options={states.map((value) => {
                return {
                  label: value.name,
                  value: value.id ? value.id.toString() : "",
                };
              })}
              value={state.id ?? ""}
              setValue={(value: string) => {
                const id = Number(value);
                const index = states.findIndex((state) => {
                  return state.id == id;
                });
                if (index >= 0) {
                  setState(states[index]);
                }
              }}
            />
            <Select
              label="City"
              defaultValue={""}
              defaultLabel="City"
              options={cities.map((value) => {
                return {
                  label: value.name,
                  value: value.id ? value.id.toString() : "",
                };
              })}
              value={city.id ?? ""}
              setValue={(value: string) => {
                const id = Number(value);
                const index = cities.findIndex((city) => {
                  return city.id == id;
                });
                if (index >= 0) {
                  setCity(cities[index]);
                }
              }}
            />
          </div>
          <div className="w-full flex flex-col xl:flex-row space-x-0 xl:space-x-5">
            <TextInput
              sname="Address"
              label=""
              placeholder="1234 Main St"
              type="text"
              value={address}
              setValue={setAddress}
            />
            <TextInput
              sname="Zip code"
              label=""
              placeholder="Zip code"
              type="text"
              value={zipcode}
              setValue={setZipcode}
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
