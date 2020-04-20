import { WORDPRESS_GFW_API, POSTS_PER_PAGE } from './constants';

const settings = {
  name: 'gfw-blog',
  state: {
    frontity: {
      url: 'https://blog.globalforestwatch.org',
      title: 'Global Forest Watch Blog',
      description:
        'The GFW blog catalyzes conversations around improved forest management by providing timely, credible analysis on threats to global forests.',
    },
  },
  packages: [
    {
      name: '@frontity/mars-theme',
      state: {
        theme: {
          featured: {
            showOnList: true,
            showOnPost: true,
          },
        },
      },
    },
    {
      name: '@frontity/wp-source',
      state: {
        source: {
          api: WORDPRESS_GFW_API,
          params: {
            per_page: POSTS_PER_PAGE,
            type: ['post'],
          },
        },
      },
    },
    '@frontity/tiny-router',
    '@frontity/html2react',
  ],
};

export default settings;
