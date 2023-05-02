import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import TransactionTable from "@/components/TransactionTable";
import RadialProgress from "@/components/RadialProgress";

import { useAuthValues } from "@/contexts/contextAuth";

import useTransaction from "@/hooks/useTransaction";

import { ITransaction } from "@/interfaces/ITransaction";

export default function Transaction() {
  const { isLoading, fetchTransactions } = useTransaction();
  const { isSignedIn } = useAuthValues();

  const [transactions, setTransactions] = useState<Array<ITransaction>>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const fetchTransactionsData = () => {
    fetchTransactions(page).then((data) => {
      if (data) {
        setTransactions(data.transactions);
        setTotalCount(data.pages);
      }
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchTransactionsData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, page]);

  return (
    <Layout>
      <div className="relative w-full min-h-screen justify-start md:justify-center items-center overflow-x-hidden overflow-y-auto">
        <div className="w-full p-5 pt-10">
          <TransactionTable
            transactions={transactions}
            totalCount={totalCount}
            page={page}
            setPage={(value: number) => setPage(value)}
          />
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
