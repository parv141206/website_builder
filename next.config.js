/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

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
