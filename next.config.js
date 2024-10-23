/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles'), path.join(__dirname, 'components')],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);

    config.module.rules.push({
      test: /\.glsl$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },
};

module.exports = nextConfig;
