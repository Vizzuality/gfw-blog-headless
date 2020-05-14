import image from '@frontity/html2react/processors/image';
import iframe from '@frontity/html2react/processors/iframe';
import { Carousel } from 'gfw-components';
import Blockquote from './components/blockqoute';
import Theme from './components';

const gutenbergGallery = {
  test: ({ component, props }) =>
    component === 'ul' && props.className === 'blocks-gallery-grid',
  processor: () => {
    return {
      component: Carousel,
      props: {
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          lazyLoad: false,
          infinite: true,
          focusOnSelect: true,
        },
      },
    };
  },
};

const blockquote = {
  test: ({ component }) => component === 'blockquote',
  processor: () => {
    return {
      component: Blockquote,
    };
  },
};

const allCategoriesHandler = {
  name: 'allCategories',
  priority: 10,
  pattern: 'all-categories',
  func: async ({ route, state, libraries }) => {
    const { api } = libraries.source;

    // 1. fetch the data you want from the endpoint page
    const response = await api.get({
      endpoint: 'categories',
      params: {
        per_page: 100, // To make sure you get all of them
      },
    });

    // 2. get an array with each item in json format
    const items = await response.json();

    // 3. add data to source
    const currentPageData = state.source.data[route];

    Object.assign(currentPageData, {
      items,
    });
  },
};

const categoryOrPostHandler = {
  name: 'categoryOrPostType',
  priority: 19,
  pattern: '/(.*)?/:slug',
  func: async ({ route, params, state, libraries }) => {
    // 1. try with category.
    try {
      const category = libraries.source.handlers.find(
        (handler) => handler.name === 'category'
      );
      await category.func({ route, params, state, libraries });
    } catch (e) {
      // It's not a category
      const postType = libraries.source.handlers.find(
        (handler) => handler.name === 'post type'
      );
      await postType.func({ link: route, params, state, libraries });
    }
  },
};

const marsTheme = {
  name: '@frontity/mars-theme',
  roots: {
    /**
     *  In Frontity, any package can add React components to the site.
     *  We use roots for that, scoped to the `theme` namespace.
     */
    theme: Theme,
  },
  state: {
    /**
     * State is where the packages store their default settings and other
     * relevant state. It is scoped to the `theme` namespace.
     */
    theme: {
      isContactUsOpen: false,
      featured: {
        showOnList: false,
        showOnPost: true,
      },
    },
    googleAnalytics: {
      trackingId: process.env.GOOGLE_ANALYTICS,
    },
  },
  /**
   * Actions are functions that modify the state or deal with other parts of
   * Frontity like libraries.
   */
  actions: {
    theme: {
      toggleContactUsModal: ({ state }) => {
        state.theme.isContactUsOpen = !state.theme.isContactUsOpen;
      },
      beforeSSR: ({ actions }) => async () => {
        await actions.source.fetch('all-categories');
      },
    },
  },
  libraries: {
    html2react: {
      /**
       * Add a processor to `html2react` so it processes the `<img>` tags
       * inside the content HTML. You can add your own processors too
       */
      processors: [image, iframe, gutenbergGallery, blockquote],
    },
    source: {
      handlers: [allCategoriesHandler, categoryOrPostHandler],
    },
  },
};

export default marsTheme;
