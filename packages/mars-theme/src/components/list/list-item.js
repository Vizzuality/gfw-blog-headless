import React from 'react';
import PropTypes from 'prop-types';
import { connect, styled } from 'frontity';
import Link from '../link';
import FeaturedMedia from '../featured-media';
import CategoryNameList from '../category/list-name';
import PostTitle from '../post/title';
import Excerpt from '../post/excerpt';
import { LARGE_ENDPOINT, MEDIUM_ENDPOINT } from '../heplers/css-endpoints';

/**
 * Item Component
 *
 * It renders the preview of a blog post. Each blog post contains
 * - Title: clickable title of the post
 * - Author: name of author and published date
 * - FeaturedMedia: the featured image/video of the post
 */
const Item = ({
  state,
  item,
  styles,
  media = null,
  excerpt = null,
  title = null,
}) => {
  const categories = item.categories.map((id) => {
    const { link, name } = state.source.category[id];
    return { link, name };
  });

  const Wrapper = styled.article`
    width: 31.532%;
    flex-wrap: wrap;
    margin-bottom: 2.75rem;
    position: relative;
    @media screen and (max-width: ${LARGE_ENDPOINT}) {
      width: 49%;
    }
    @media screen and (max-width: ${MEDIUM_ENDPOINT}) {
      width: 100%;
      padding: 0 1rem;
    }
    ${styles}
  `;

  const titleStyles = `
    padding-top: 0;
    padding-bottom: 1.25rem;
    line-height: 1.25;
  `;

  return (
    <Wrapper>
      {/*
       * If the want to show featured media in the
       * list of featured posts, we render the media.
       */}
      <Link link={item.link} className="post-link">
        &nbsp;
      </Link>
      <div className="feautured-media">
        {state.theme.featured.showOnList && media && media(item.featured_media)}
        {state.theme.featured.showOnList && !media && (
          <FeaturedMedia key={item.featured_media} id={item.featured_media} />
        )}
      </div>
      {/* Show categories of the post */}
      <CategoryNameList
        categories={categories}
        styles="position:relative; margin-bottom: 1.5rem;"
      />
      {/* <Link link={item.link} className="post-title-link"> */}
      {!title && (
        <PostTitle styles={titleStyles}>{item.title.rendered}</PostTitle>
      )}
      {title && title(item.title.rendered)}
      {/* </Link> */}
      {/* If the post has an excerpt (short summary text), we render it */}
      {item.excerpt && excerpt && excerpt(item.excerpt.rendered)}
      {item.excerpt && !excerpt && <Excerpt>{item.excerpt.rendered}</Excerpt>}
    </Wrapper>
  );
};

// Connect the Item to gain access to `state` as a prop
export default connect(Item);

Item.propTypes = {
  state: PropTypes.object,
  item: PropTypes.object,
  styles: PropTypes.string,
  media: PropTypes.node,
  excerpt: PropTypes.node,
  title: PropTypes.node,
};
