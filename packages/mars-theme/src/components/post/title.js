import React from 'react';
import PropTypes from 'prop-types';
import { styled } from 'frontity';

const PostTitle = ({ children, styles = '' }) => {
  const Wrapper = styled.h1`
    font-size: 1.375rem;
    margin: 0;
    box-sizing: border-box;
    width: 100%;
    ${styles}
  `;

  return <Wrapper dangerouslySetInnerHTML={{ __html: children }} />;
};

export default PostTitle;

PostTitle.propTypes = {
  styles: PropTypes.string,
  children: PropTypes.node,
};