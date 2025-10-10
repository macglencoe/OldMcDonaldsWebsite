/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            }
        ]
    },
    async redirects() {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'oldmcdonaldspumpkinpatchwv.com',
            },
          ],
          destination: 'https://www.oldmcdonaldspumpkinpatchwv.com/:path*',
          permanent: true,
        },
        {
          source: '/night-maze',
          destination: '/activities/night-maze',
          permanent: true
        },
        {
          source: '/rates-hours',
          destination: '/',
          permanent: true
        },
        {
          source: '/about-the-farm-1',
          destination: '/about',
          permanent: true
        },
        {
          source: '/birthday-parties-1',
          destination: '/reservations',
          permanent: true
        },
        {
          source: '/corn-maze',
          destination: '/activities/corn-maze',
          permanent: true
        },
        {
          source: '/pumpkin-patch',
          destination: '/activities/pumpkin-patch',
          permanent: true
        },
        {
          source: '/location',
          destination: '/visit',
          permanent: true
        }
      ]
    },
    webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /raw/,        // only when you append `?raw`
      type: 'asset/source',        // emit the raw file contents
    })
    return config
  }
};

export default nextConfig;
