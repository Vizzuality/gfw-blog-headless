import React from "react";
import PropTypes from 'prop-types';
import { styled } from "frontity";

const PostTitle = ({ children, styles = '' }) => {
  const Wrapper = styled.h1`
    font-size: 2rem;
    color: rgba(12, 17, 43);
    margin: 0;
    box-sizing: border-box;
    ${styles}
  `;

  return <Wrapper dangerouslySetInnerHTML={{ __html: children }} />
}

export default PostTitle

PostTitle.propTypes = {
  styles: PropTypes.string,
}