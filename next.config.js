/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/rq-ttw',
  assetPrefix: '/rq-ttw/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
