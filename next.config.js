const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/profile',
        destination: '/',
        permanent: true,
      },
    ];
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles'),
      path.join(__dirname, 'node_modules'),
    ],
  }
}

module.exports = nextConfig
