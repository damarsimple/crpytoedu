/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "192.168.1.231",
      "source.unsplash.com",
      "i.ytimg.com",
      "localhost",
      "crpyto.damaral.my.id",
      "joinchampiontrading.com",
      "gql.joinchampiontrading.com",
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
