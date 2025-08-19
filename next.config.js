/** @type {import("next").NextConfig} */
const config = {
  async rewrites() {
    return [
      {
        source: "/public/:path*",
        destination: "/api/public/:path*", // redirect requests
      },
    ];
  },
};

export default config;
