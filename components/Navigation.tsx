import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, SearchIcon } from "@heroicons/react/outline";
import { isAddress } from "ethers/lib/utils";
import { Fragment, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { useRecoilState } from "recoil";
import { limitState } from "../atoms/LimitAtom";
import { nftsState } from "../atoms/NftsAtom";
import { totalQuarksState } from "../atoms/QuarksAtom";
import {
  backgrounds,
  bodies,
  shirts,
  headware,
  faces,
} from "../exports/traitArray";
import ThemeChanger from "./ThemeChanger";
import { totalLandState } from "../atoms/LandAtom";
import { useRouter } from "next/router";
import { errorResultState } from "../atoms/ErrorResult";

function Navigation() {
  const empty: string[] = [];
  const [tokenOrAddress, setTokenOrAddress] = useState("");
  const { Moralis } = useMoralis();
  const [nfts, setNfts] = useRecoilState(nftsState);
  const [finalAddressNfts, setFinalAddressNfts] = useState(empty);
  const [limit, setLimit] = useRecoilState(limitState);
  const [totalQuarks, setTotalQuarks] = useRecoilState(totalQuarksState);
  const [totalLand, setTotalLand] = useRecoilState(totalLandState);
  const [errorResult, setErrorResult] = useRecoilState(errorResultState);
  const [addressTokenIds, setAddressTokenIds] = useState(empty);
  const router = useRouter();

  const allHeadware = headware.sort();

  const allFaces = faces.sort();

  const allShirts = shirts.sort();

  // Get individual NFT
  const getNFT = (tokenId: number) => {
    setNfts([]);

    const options = { method: "GET" };

    fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}https://test.ecto.xyz/analytics/rarity`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        let singleNFT = response.filter((nft: any) => nft.id === tokenId);
        setNfts(singleNFT);
      })
      .catch((err) => console.error(err));
  };

  // Filter NFTs by specified trait value
  const filteredNFTs = async (index: number, traitValue: string) => {
    setNfts([]);

    const options = { method: "GET" };

    fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}https://test.ecto.xyz/analytics/rarity`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        let filteredNFTs = response.filter(
          (nft: any) => nft.attributes[index].value === traitValue
        );
        setNfts(filteredNFTs);
      })
      .catch((err) => console.error(err));
  };

  // Get Token IDs of each Lost Soul for a given wallet address
  const addressNFTs = async (address: string) => {
    const options = { method: "GET" };
    let addressTokenIds: string[] = [];

    fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}https://test.ecto.xyz/analytics/address/${address}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        for (let i = 0; i < response.ownedNotListed.length; i++) {
          addressTokenIds.push(response.ownedNotListed[i]);
        }
        setAddressTokenIds(addressTokenIds);
        fetchTotalAddressNFTs(addressTokenIds);
      })
      .catch((err) => console.error(err));
  };

  //Given an array of token IDs, fetches information about said NFTs for a given wallet
  const fetchTotalAddressNFTs = (tokenIdArray: string[]) => {
    const options = { method: "GET" };
    let totalAddressNfts: any[] = [];

    fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}https://test.ecto.xyz/analytics/rarity`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        for (let i = 0; i < tokenIdArray.length; i++) {
          for (let j = 0; j < response.length; j++) {
            if (response[j].id == Number(tokenIdArray[i])) {
              totalAddressNfts.push(response[j]);
            }
          }
        }
        let finalNfts = totalAddressNfts.sort(
          (a, b) => a.rarity_rank - b.rarity_rank
        );
        let totalQuarks = 0;
        totalAddressNfts.forEach((nft) => {
          if (nft.rarity_rank < 22) {
            totalQuarks += 400000;
          } else if (nft.rarity_rank > 21 && nft.rarity_rank < 1402) {
            totalQuarks += 100000;
          } else if (nft.rarity_rank > 1401 && nft.rarity_rank < 5001) {
            totalQuarks += 10000;
          } else {
            totalQuarks += 5000;
          }
        });
        //@ts-ignore
        setNfts(finalNfts);
        setTotalQuarks(totalQuarks);
      })
      .catch((err) => console.error(err));
  };

  //Reset function to eliminate any filters
  const resetNFTs = async () => {
    const options = { method: "GET" };

    fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}https://test.ecto.xyz/analytics/rarity`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setNfts(response);
      })
      .catch((err) => console.error(err));
    setLimit(10);
    setTotalQuarks(0);
    setTotalLand(0);
  };

  //Fetches the total Available Land for a given address using the Ecto API
  const addressDetails = (ownerAddress: string) => {
    const options = { method: "GET" };

    fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}https://test.ecto.xyz/analytics/address/${ownerAddress}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setTotalLand(response.totalAvailableLand);
      })
      .catch((err) => console.error(err));
  };

  //OnClick for Address: 1) resets variables 2) Checks if input is a valid address or ENS domain, if not resets other variables
  const retrieveAddressNFTs = async () => {
    setNfts([]);
    setLimit(10);
    setTotalQuarks(0);
    setErrorResult(false);

    if (isAddress(tokenOrAddress) == true) {
      addressNFTs(tokenOrAddress);
      addressDetails(tokenOrAddress);
    } else {
      try {
        const web3Provider = await Moralis.enableWeb3();
        const address = await web3Provider.resolveName(tokenOrAddress);
        if (address != null) {
          addressNFTs(address);
          addressDetails(address);
        } else {
          setTotalQuarks(0);
          setTotalLand(0);
          setErrorResult(true);
        }
      } catch {
        setTotalQuarks(0);
        setTotalLand(0);
        setErrorResult(true);
      }
    }
  };

  //OnClick for Find a Soul: 1) reset variables, 2) Checks if input is a valid integer 1-9999 (valid token ID), if not reset other variables
  const retrieveNFT = () => {
    setTotalQuarks(0);
    setTotalLand(0);
    setErrorResult(false);
    if (
      Number(tokenOrAddress) % 1 == 0 &&
      Number(tokenOrAddress) > 0 &&
      Number(tokenOrAddress) < 10000
    ) {
      getNFT(Number(tokenOrAddress));
    } else {
      setTotalQuarks(0);
      setTotalLand(0);
      setErrorResult(true);
    }
  };

  //OnClick for Filter menu: 1) resets variables, calls the filter function for given trait
  const retrieveFilteredNFTs = (index: number, traitValue: string) => {
    setErrorResult(false);
    setLimit(10);
    setTotalQuarks(0);
    setTotalLand(0);
    filteredNFTs(index, traitValue);
  };

  //OnClick for Reset: first setNft(undefined) to clear nfts
  const reset = () => {
    resetNFTs();
    setErrorResult(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center space-y-4 bg-zinc-100 text-black dark:bg-black dark:text-white md:right-2 md:flex-row md:space-y-0 md:space-x-4">
      <div className="flex items-center justify-center space-x-2">
        <div className="relative mb-4 rounded-md transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer md:mb-0">
          <ThemeChanger />
        </div>
        <div className="relative mb-4 rounded-md md:mb-0">
          <div className="pointer-events-none absolute inset-y-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="block w-full rounded-md border-gray-300 bg-gray-50 pl-10 text-sm text-black selection:bg-blue-200 focus:border-[#486cdc] focus:ring-[#486cdc]"
            type="text"
            placeholder="Token ID or Address"
            onChange={(e) => setTokenOrAddress(e.target.value)}
          />
        </div>
        <div className="navBtnContainer mb-4 md:mb-0">
          <button className="navBtn" onClick={() => router.push("/whales")}>
            4,4
          </button>
        </div>
      </div>

      <div className="relative right-8 flex items-center justify-center space-x-2 md:right-0">
        <div className="navBtnContainer">
          <button className="navBtn" onClick={() => retrieveNFT()}>
            Find a Soul
          </button>
        </div>
        <div className="navBtnContainer">
          <button className="navBtn" onClick={() => retrieveAddressNFTs()}>
            Address
          </button>
        </div>
        <div className="navBtnContainer">
          <button className="navBtn" onClick={() => reset()}>
            Reset
          </button>
        </div>
        <div className="relative z-20 w-[20px] items-center justify-center">
          <Menu as="div" className="relative inline-block text-left">
            <div className="rounded-lg border border-[#14aed0] dark:border-[#6a3fe4]">
              <Menu.Button className="relative inline-flex w-full justify-center rounded-md bg-gray-50 px-4 py-2 text-sm text-black dark:bg-zinc-900 dark:text-white">
                <div className="flex">
                  Filter
                  <ChevronDownIcon
                    className="ml-2 -mr-1 h-5 w-5 text-cyan-700 hover:text-cyan-500 dark:text-violet-700 dark:hover:text-violet-500"
                    aria-hidden="true"
                  />
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-solid divide-gray-500 rounded-md bg-white shadow-lg focus:outline-none">
                <div className="max-h-[240px] overflow-y-scroll px-1 py-1">
                  {backgrounds.map((background: string, index: number) => (
                    <Menu.Item key={index}>
                      <button
                        onClick={() => retrieveFilteredNFTs(0, background)}
                        className="menuItemBtn group"
                      >
                        Background: {background}
                      </button>
                    </Menu.Item>
                  ))}

                  {bodies.map((body: string, index: number) => (
                    <Menu.Item key={index}>
                      <button
                        onClick={() => retrieveFilteredNFTs(1, body)}
                        className="menuItemBtn group"
                      >
                        Body: {body}
                      </button>
                    </Menu.Item>
                  ))}

                  {allHeadware.map((headware: string, index: number) => (
                    <Menu.Item key={index}>
                      <button
                        onClick={() => retrieveFilteredNFTs(2, headware)}
                        className="menuItemBtn group"
                      >
                        Headware: {headware}
                      </button>
                    </Menu.Item>
                  ))}

                  {allFaces.map((face: string, index: number) => (
                    <Menu.Item key={index}>
                      <button
                        onClick={() => retrieveFilteredNFTs(3, face)}
                        className="menuItemBtn group"
                      >
                        Face: {face}
                      </button>
                    </Menu.Item>
                  ))}

                  {allShirts.map((shirt: string, index: number) => (
                    <Menu.Item key={index}>
                      <button
                        onClick={() => retrieveFilteredNFTs(4, shirt)}
                        className="menuItemBtn group"
                      >
                        Shirt: {shirt}
                      </button>
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
