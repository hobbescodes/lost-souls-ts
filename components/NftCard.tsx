import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { LinkIcon as OpenSea, XIcon } from "@heroicons/react/outline";
import { useMoralis } from "react-moralis";
import { createClient } from "urql";

function NftCard({ nft }: any) {
  let [isOpen, setIsOpen] = useState(false);
  const [owner, setOwner] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [tokenPrice, setTokenPrice] = useState("");
  const [rarityClass, setRarityClass] = useState("");
  const [nftQuarks, setNftQuarks] = useState(0);
  const { Moralis } = useMoralis();

  //Opens Modal for each NFT and triggers function to find owner of clicked NFT + that NFTs details
  function openModal() {
    setIsOpen(true);
    tokenDetails(nft.id);
    findOwner(nft.id);
  }

  //Closes Modal for each NFT, resets variables
  function closeModal() {
    setIsOpen(false);
    setOwner("");
    setIsCopied(false);
    setTokenPrice("");
  }

  //Finds the current owner of a given NFT, provided a Token ID. Checks to see if there is an ENS domain attached to owner's wallet address
  const findOwner = async (tokenId: number) => {
    const APIURL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;

    const query = `
  query {
      tokens (where: {id: ${tokenId.toString()}}) {
        id
        owner {
          id
        }
      }
  }`;

    const client = createClient({
      url: APIURL!,
    });

    async function fetchData() {
      await Moralis.start({
        serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
        appId: process.env.NEXT_PUBLIC_APP_ID,
      });

      const response = await client.query(query).toPromise();
      const options = { address: response.data?.tokens[0].owner.id };
      try {
        const resolve = await Moralis.Web3API.resolve.resolveAddress(options);
        setOwner(resolve.name);
      } catch {
        setOwner(response.data?.tokens[0].owner.id);
      }
    }

    fetchData();
  };

  //Truncates an address to the form of 0xEE..EEEE
  function truncateHash(hash: string, length = 38) {
    return hash.replace(hash.substring(4, length), "..");
  }

  //Copies value to clipboard, unsure if this works on all browsers/OS
  function copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    setIsCopied(true);
  }

  //Fetch token listing price if available from Ecto API
  const tokenDetails = (tokenId: string) => {
    const options = { method: "GET" };

    fetch(
      `${process.env.NEXT_PUBLIC_PROXY_URL}https://test.ecto.xyz/analytics/token/${tokenId}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        //console.log(response);
        if (response.listingStatus == "listed") {
          // console.log(response);
          setTokenPrice(response.msg.price);
        } else {
          // console.log(response);
          setTokenPrice("Not Listed");
        }
      })
      .catch((err) => console.error(err));
  };

  //Uses IPFS gateway in order to render image
  const resolveURL = (url: string) => {
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  };

  //Defines rarity class and quark value for an individual NFT
  const classRarity = (nft: any) => {
    if (nft.rarity_rank < 22) {
      setRarityClass("Super Rare");
      setNftQuarks(400000);
    } else if (nft.rarity_rank > 21 && nft.rarity_rank < 1402) {
      setRarityClass("Rare");
      setNftQuarks(100000);
    } else if (nft.rarity_rank > 1401 && nft.rarity_rank < 5001) {
      setRarityClass("Uncommon");
      setNftQuarks(10000);
    } else {
      setRarityClass("Common");
      setNftQuarks(5000);
    }
  };

  //Finds rarity class and quark value for a given NFT on state change
  useEffect(() => {
    classRarity(nft);
  }, [nft]);

  return (
    <div>
      <div
        className={`relative m-4 shadow-sm transition-all duration-150 ease-out hover:scale-110 hover:cursor-pointer ${
          rarityClass === "Super Rare" && "shadow-orange-400"
        } ${rarityClass === "Rare" && "shadow-green-400"} ${
          rarityClass === "Uncommon" && "shadow-blue-400"
        } ${rarityClass === "Common" && "shadow-purple-400"}`}
      >
        <div
          className={`text-md absolute top-3 -right-1 h-7 w-[2px] rounded-r-lg ${
            rarityClass === "Super Rare" && "bg-orange-400"
          } ${rarityClass === "Rare" && "bg-green-400"} ${
            rarityClass === "Uncommon" && "bg-blue-400"
          } ${
            rarityClass === "Common" && "bg-purple-400"
          } p-1 text-black shadow shadow-black`}
        ></div>
        <div className="relative bg-zinc-200 pb-3 text-black dark:bg-zinc-900 dark:text-white">
          <div
            onClick={openModal}
            className="flex flex-col items-center space-y-2 rounded-lg"
          >
            <div className="relative h-52 w-52">
              <div
                className={`absolute top-2 -right-1 z-10 w-20 rounded-l-md rounded-tr-md text-center ${
                  rarityClass === "Super Rare" && "bg-orange-400"
                } ${rarityClass === "Rare" && "bg-green-400"} ${
                  rarityClass === "Uncommon" && "bg-blue-400"
                } ${
                  rarityClass === "Common" && "bg-purple-400"
                } p-1 text-xs font-bold text-black shadow shadow-black`}
              >
                {rarityClass}
              </div>
              <Image
                src={nft ? resolveURL(nft.image) : "/images/Loading.gif"}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p>{`Lost Soul ${nft.id}`}</p>
            {nft.rarity_rank < 22 ? (
              <p>Rank #1</p>
            ) : (
              <p>{`Rank #${nft.rarity_rank}`}</p>
            )}

            <p>{`Quarks: ${nftQuarks / 1000}K`}</p>
          </div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-50 p-6 text-left align-middle text-black shadow-xl transition-all dark:bg-black dark:text-white">
                <div className="flex flex-col items-center justify-between space-y-3 py-4 sm:flex-row sm:space-y-0">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-black dark:text-white"
                    >
                      {`Lost Soul #${nft.id}`}
                    </Dialog.Title>
                    <div className="relative h-48 w-48">
                      <div className="absolute top-1 -left-1 z-50 rounded-r-md rounded-tl-md bg-green-400 p-1 text-xs font-bold text-black shadow shadow-black">
                        {nft.rarity_rank < 22 ? (
                          <p>Rank #1</p>
                        ) : (
                          <p>{`Rank #${nft.rarity_rank}`}</p>
                        )}
                      </div>
                      <div className="text-md absolute top-[4px] -left-1 h-8 w-[2px] rounded-l-lg bg-green-400 p-1 text-black shadow shadow-black"></div>
                      <Image
                        className="rounded-md"
                        src={
                          nft ? resolveURL(nft.image) : "/images/Loading.gif"
                        }
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    {owner != "" ? (
                      <div
                        onClick={() => copyToClipboard(owner)}
                        className="group flex cursor-pointer flex-col items-center justify-center space-y-1"
                      >
                        <p className="text-green-400">Owner:</p>
                        {owner.endsWith(".eth") ? (
                          <p className="group-hover:underline">{owner}</p>
                        ) : (
                          <p className="group-hover:underline">
                            {truncateHash(owner)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <p className="text-green-400">Owner:</p>
                        <p>Fetching...</p>
                      </div>
                    )}
                    {isCopied ? <p className="text-xs">Copied!</p> : null}
                    {tokenPrice != "" ? (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <p className="text-green-400">Price:</p>
                        <div className="flex space-x-2 p-2">
                          {tokenPrice != "Not Listed" ? (
                            <Image
                              className=""
                              src="/images/eth-logo.png"
                              width={15}
                              height={15}
                            />
                          ) : null}
                          <p className="">{tokenPrice}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <p className="text-green-400">Price:</p>
                        <p>Fetching...</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between space-y-1 divide-y divide-solid px-3 text-sm">
                    <div className="flex justify-between space-x-2">
                      <p className="font-bold">Score:</p>
                      {nft.rarity_score < 22 ? (
                        <p className="font-normal text-green-400">5000</p>
                      ) : (
                        <p className="font-normal text-green-400">{`+${nft.rarity_score.toFixed(
                          2
                        )}`}</p>
                      )}
                    </div>

                    {nft.attributes.map((e: any, index: number) => {
                      if (e.trait_type != "TraitCount") {
                        return (
                          <div
                            key={index}
                            className="flex justify-between space-x-8 space-y-2 py-2"
                          >
                            <div className="flex flex-col">
                              <p className="font-bold">{e.trait_type}:</p>
                              <p className="text-xs font-bold text-gray-400">
                                {e.value}
                              </p>
                            </div>
                            <p className="font-normal text-blue-400">{`+${e.rarity_score.toFixed(
                              2
                            )}`}</p>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </div>
                </div>
                <div className="absolute right-3 top-2 hover:cursor-pointer hover:opacity-50">
                  <XIcon className="h-5 w-5" onClick={closeModal} />
                </div>
                <div className="absolute left-5 bottom-2 flex items-center justify-center space-x-1 text-blue-400 hover:underline">
                  <OpenSea className="h-4 w-4" />
                  <div>
                    <a
                      rel="noreferrer"
                      href={`https://opensea.io/assets/0x0fb69d1dc9954a7f60e83023916f2551e24f52fc/${nft.id}`}
                      className="focus:outline-none"
                      target="_blank"
                    >
                      OpenSea
                    </a>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default NftCard;
