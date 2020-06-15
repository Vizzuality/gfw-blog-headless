import React from 'react';
import PropTypes from 'prop-types';
import { Head, connect, decode } from 'frontity';

const AppHead = ({ state }) => {
  // Get data about the current URL.
  const data = state.source.get(state.router.link);
  // Set the default title.
  const { title: frontityTitle } = state.frontity;
  let title = frontityTitle;
  const {
    query: { s: searchQuery },
  } = data;

  if (data.isTaxonomy) {
    // Add titles to taxonomies, like 'Category: Nature - Blog Name' or 'Tag: Japan - Blog Name'.
    // 1. Get the taxonomy entity from the state to get its taxonomy term and name.
    const { name } = state.source[data.taxonomy][data.id];
    // 2. Uppercase first letter of the taxonomy term (from 'category' to 'Category').
    // 3. Render the proper title.
    title = `${decode(name)} | ${state.frontity.title}`;
  } else if (data.isAuthor) {
    // Add titles to authors, like 'Author: Jon Snow - Blog Name'.
    // 1. Get the author entity from the state to get its name.
    const { name } = state.source.author[data.id];
    // 2. Render the proper title.
    title = `${decode(name)} | ${state.frontity.title}`;
  } else if (data.isPostType) {
    // Add titles to posts and pages, using the title and ending with the Blog Name.
    // 1. Get the post entity from the state and get its title.
    const postTitle = state.source[data.type][data.id].title.rendered;
    // 2. Remove any HTML tags found in the title.
    const cleanTitle = decode(postTitle);
    // 3. Render the proper title.
    title = `${cleanTitle} | ${state.frontity.title}`;
  } else if (data.is404) {
    // Add titles to 404's.
    title = `404 Not Found | ${state.frontity.title}`;
  } else if (searchQuery) {
    title = `Search: ${decodeURI(searchQuery)} | ${state.frontity.title}`;
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={state.frontity.description} />
      <link
        href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap"
        rel="stylesheet"
      />
      <script type="text/javascript">
        {'window.liveSettings={api_key:"8e47889f7d5c4c6ba7b7b3e9453864e1"};'}
      </script>
      <script type="text/javascript" src="//cdn.transifex.com/live.js" />
      <html lang="en" />
    </Head>
  );
};

AppHead.propTypes = {
  state: PropTypes.object,
};

export default connect(AppHead);
