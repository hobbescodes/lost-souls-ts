import Image from "next/image";
import Navigation from "./Navigation";

function Header() {
  return (
    <header className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between space-y-4 bg-zinc-100 text-black dark:bg-black dark:text-white lg:space-y-0 lg:space-x-4 xl:flex-row">
      <div className="m-4 flex h-auto flex-col items-center justify-between sm:flex-row">
        <div className="flex items-center justify-center space-x-4">
          <Image
            className="rounded-full"
            src="https://pbs.twimg.com/profile_images/1472478237548851204/SOZnLpqj_400x400.jpg"
            width={75}
            height={75}
          />
          <p className="hidden font-header text-4xl md:inline-flex">
            Lost Souls Rarity
          </p>
        </div>
      </div>

      <div className="relative flex md:right-8 xl:right-0">
        <Navigation />
      </div>
    </header>
  );
}

export default Header;
