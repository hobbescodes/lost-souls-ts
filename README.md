This is a Rarity Ranking App that is customly designed for the Lost Souls Sanctuary collection.
It provides utility to:

1. Search by Token ID for individual rarity stats
2. Search by address or ENS domain for comprehensive stats about a wallets LSS holdings
3. Filter by attribute type
4. Provides Rarity floor statistics fetched from the Ecto API about floor prices of a given rarity rank
5. Provides a "Hall of Fame" of the top holders
6. Provides current listing price of an individual token (if it is listed on OpenSea)

Some unique statistics (unique to the LSS collection) that it provides are:

1. Total Quark value of a searched wallet address (or ENS domain)
2. Total available land for a searched wallet address (or ENS domain)

The rarity rankings presented are put together to line up directly with Rarity Tools (given room for rounding).

If you want to learn more about the LSS collection and the place they fit into the Ectoverse,
please visit https://docs.ecto.xyz/lost-souls/about

If you would like to fork the project, and tinker around, the directions below should guide you.
This project was bootstrapped with Create Next App and is currently in constant development.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
