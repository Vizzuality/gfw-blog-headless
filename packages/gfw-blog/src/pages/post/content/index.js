import React from 'react';
import PropTypes from 'prop-types';

import ContentWrapper from './styles';

const PostContent = ({ children }) => (
  <ContentWrapper className="notranslate">{children}</ContentWrapper>
);

PostContent.propTypes = {
  children: PropTypes.node,
};

export default PostContent;
