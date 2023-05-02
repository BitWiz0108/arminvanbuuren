import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Layout from "@/components/Layout";
import ButtonSettings from "@/components/ButtonSettings/index";
import TextInput from "@/components/TextInput";
import RadialProgress from "@/components/RadialProgress";
import CurrencyTable from "@/components/CurrencyTable";

import { useAuthValues } from "@/contexts/contextAuth";

import useCurrency from "@/hooks/useCurrency";

import { ICurrency } from "@/interfaces/ICurrency";

export default function Currency() {
  const { isSignedIn } = useAuthValues();
  const {
    isLoading,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
  } = useCurrency();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currencies, setCurrencies] = useState<Array<ICurrency>>([]);
  const [isDetailViewOpened, setIsDetailViewOpened] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const clearFields = () => {
    setName("");
    setCode("");
    setSymbol("");
  };

  const onConfirm = () => {
    if (!name || !code || !symbol) {
      toast.warn("Please type values correctly.");
      return;
    }

    if (isEditing) {
      updateCurrency(selectedId, name, code, symbol).then((value) => {
        if (value) {
          clearFields();
          fetchCurrencies().then((value) => {
            setCurrencies(value);
          });

          toast.success("Successfully updated!");
        }
      });
    } else {
      createCurrency(name, code, symbol).then((value) => {
        if (value) {
          clearFields();
          fetchCurrencies().then((value) => {
            setCurrencies(value);
          });

          toast.success("Successfully added!");
        }
      });
    }

    setIsDetailViewOpened(false);
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchCurrencies().then((value) => {
        setCurrencies(value);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

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
      <div className="w-full p-5">
        <CurrencyTable
          currencies={currencies}
          deleteCurrency={(id: number) =>
            deleteCurrency(id).then((value) => {
              if (value) {
                fetchCurrencies().then((value) => {
                  setCurrencies(value);
                });

                toast.success("Successfully deleted!");
              }
            })
          }
          updateCurrency={(id: number) => {
            setIsEditing(true);
            const index = currencies.findIndex((currency) => currency.id == id);
            if (index >= 0) {
              setName(currencies[index].name);
              setCode(currencies[index].code);
              setSymbol(currencies[index].symbol);
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
        <label className="text-3xl px-0 font-semibold">
          {isEditing ? "Edit" : "Add"} Currency
        </label>
        <div className="flex">
          <div className="w-full px-0 flex flex-col">
            <div className="w-full flex flex-col lg:flex-row justify-start items-center space-x-0 md:space-x-2">
              <TextInput
                sname="Name"
                label=""
                placeholder="US Dollar"
                type="text"
                value={name}
                setValue={setName}
              />
              <TextInput
                sname="Code"
                label=""
                placeholder="USD"
                type="text"
                value={code}
                setValue={setCode}
              />
              <TextInput
                sname="Symbol"
                label=""
                placeholder="$"
                type="text"
                value={symbol}
                setValue={setSymbol}
              />
            </div>

            <div className="flex space-x-2 mt-5">
              <ButtonSettings
                label="Cancel"
                onClick={() => setIsDetailViewOpened(false)}
              />
              <ButtonSettings bgColor="cyan" label="Save" onClick={onConfirm} />
            </div>
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
