import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Results from "../components/Results";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen flex-col items-center space-y-4 overflow-scroll scroll-smooth bg-zinc-100 text-black dark:bg-black dark:text-white">
      <div className="my-4 space-y-2">
        <Head>
          <title>Lost Souls Rarity</title>
          <meta
            name="description"
            content="Rarity Ranker designed for Lost Souls Sanctuary"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <div className="mb-1">
          <Results />
        </div>
      </div>
    </div>
  );
};

export default Home;
