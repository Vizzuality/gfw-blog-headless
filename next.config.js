const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');
const fetch = require('node-fetch');
const btoa = require('btoa');

module.exports = withPlugins(
  [[optimizedImages, { handleImages: ['jpeg', 'png', 'webp', 'gif'] }]],
  {
    basePath: '/blog',
    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: { svgoConfig: { plugins: { removeViewBox: false } } },
          },
        ],
      });

      return config;
    },
    trailingSlash: true,
    async redirects() {
      const userPassword = btoa(
        `${process.env.NEXT_PUBLIC_AUTH_USER}:${process.env.NEXT_PUBLIC_AUTH_TOKEN}`
      );
      const fetchConfig = {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${userPassword}`,
        },
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/redirection/v1/redirect?per_page=5&filterBy[status]=enabled`,
        fetchConfig
      );
      const json = await response.json();
      const totalPages = Math.ceil(parseInt(json.total, 10) / 50);
      const redirectPages = await Promise.all(
        Array.from(Array(totalPages).keys()).map((page) =>
          fetch(
            `${
              process.env.NEXT_PUBLIC_WORDPRESS_URL
            }/redirection/v1/redirect?per_page=50&page=${
              page + 1
            }&filterBy[status]=enabled`,
            fetchConfig
          )
        )
      );
      const allResponses = await Promise.all(
        redirectPages.map((res) => res.json())
      );
      const allRedirects = allResponses.reduce(
        (arr, res) => [...arr, ...res.items],
        []
      );

      return allRedirects.map((r) => ({
        source: `${r.url}/`,
        destination: `${r.action_data.url}/`,
        permanent: true,
      }));
    },
  }
);
