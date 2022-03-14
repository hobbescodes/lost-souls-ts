import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createClient } from "urql";
import ThemeChanger from "../components/ThemeChanger";
import Countdown from "react-countdown";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import { nftsState } from "../atoms/NftsAtom";
import { ethers } from "ethers";
import { limitState } from "../atoms/LimitAtom";

const Whales: NextPage = () => {
  const empty: string[] = [];
  const [whales, setWhales] = useState(empty);
  const [finalWhales, setFinalWhales] = useState(empty);
  const [isVisible, setIsVisible] = useState(false);
  const [nfts, setNfts] = useRecoilState(nftsState);
  const [limit, setLimit] = useRecoilState(limitState);
  const router = useRouter();

  //Truncates an address to the form of 0xEEEEE..EEEEEEE
  function truncateHash(hash: string, length = 35) {
    return hash.replace(hash.substring(7, length), "..");
  }

  //Filters through a subgraph query and collects addresses that own 44+ Lost Souls and resolves each address to an ENS domain when possible
  const collectWhales = (callback: any) => {
    const getWhaleAddress = async (whale: string) => {
      //@ts-ignore
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const resolve = await web3Provider.lookupAddress(whale);
      if (resolve != null) {
        whales.push(resolve);
      } else {
        whales.push(whale);
      }
    };

    for (let skip = 0; skip <= 5000; skip += 100) {
      const APIURL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

      const query = `
        query {
            users (skip: ${skip}) {
              id
              tokens {
                id
              }
            }
          }`;

      const client = createClient({
        url: APIURL!,
      });

      //@ts-ignore
      async function fetchData() {
        const response = await client.query(query).toPromise();
        response.data?.users.map((user: any) => {
          if (user.tokens.length > 43) {
            getWhaleAddress(user.id);
          }
        });
      }

      fetchData();
    }
    callback();
  };

  const getWhales = () => {
    setFinalWhales(whales);
  };

  const goHome = () => {
    setNfts([]);
    setLimit(10);
    router.push("/");
  };

  useEffect(() => {
    setFinalWhales([]);
    collectWhales(getWhales);
  }, []);

  return (
    <div className="flex h-screen flex-col items-center space-y-4 overflow-scroll scroll-smooth bg-zinc-100 text-black dark:bg-black dark:text-white">
      <div className="my-20 space-y-2">
        <Head>
          <title>4,4 Club</title>
          <meta
            name="description"
            content="Rarity Ranker designed for Lost Souls Sanctuary"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col items-center justify-center space-y-2">
          {isVisible ? (
            <div className="relative flex flex-col items-center space-y-2 text-sm">
              <div className="mb-8 flex items-center space-x-2 font-header text-3xl sm:text-7xl">
                <ThemeChanger />
                <h1>The (4,4) Hall of Fame:</h1>
              </div>
              <div className="w-200">
                <div className="my-4 flex flex-col items-center justify-center space-y-6">
                  {finalWhales
                    .sort(function (a, b) {
                      return a.length - b.length;
                    })
                    .map((address, _index) => (
                      <div
                        key={_index}
                        className="font-header text-4xl sm:text-6xl"
                      >
                        {address.endsWith(".eth")
                          ? address
                          : truncateHash(address)}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-8 flex flex-col items-center justify-center space-y-8">
              <div>
                <Image
                  src="https://gateway.ipfs.io/ipfs/QmYmAAzumMWAoNLwiBEsjbDpjT1qZYjLSU6vKEBkTbMeKC"
                  width={200}
                  height={200}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col items-center space-y-12 text-center font-header">
                <h1 className="text-3xl sm:text-6xl">
                  Have you made the coveted (4,4) Hall of Fame, anon?
                </h1>
                <h1 className="text-xl sm:text-4xl">
                  Click below to view all holders that own 44+ Lost Souls:
                </h1>
              </div>
              <Countdown date={Date.now() + 5000}>
                <div className="relative rounded-lg border border-[#14aed0] transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer dark:border-[#6a3fe4]">
                  <button
                    className="relative items-center justify-center rounded-lg bg-gray-50 px-3 py-2 text-sm text-black dark:bg-zinc-900 dark:text-white"
                    onClick={() => setIsVisible(true)}
                  >
                    View Whales
                  </button>
                </div>
              </Countdown>

              <ThemeChanger />
            </div>
          )}
        </div>
      </div>
      <div
        onClick={() => goHome()}
        className="absolute top-1 -left-3 flex w-40 cursor-pointer items-center justify-center space-x-2 font-header"
      >
        <ArrowLeftIcon className="h-6 w-6" />
        <h1 className="text-3xl">Home</h1>
      </div>
    </div>
  );
};

export default Whales;
