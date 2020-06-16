/* eslint-disable no-plusplus */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'frontity';
import { Row, Column } from 'gfw-components';

import BlogHeader from './intro';
import Search from '../../components/search';
import Tools from '../../components/tools';
import UsingGFW from '../../components/using-gfw';

import { Wrapper } from './styles';

const HomePage = ({ state }) => {
  const data = state.source.get(state.router.link);

  return (
    <Wrapper>
      <Row>
        <Column width={[1, 5 / 6, 2 / 3]}>
          <BlogHeader />
        </Column>
        <Column>
          <Search />
        </Column>
        <Column>
          <Tools items={data.items} />
          <UsingGFW />
        </Column>
      </Row>
    </Wrapper>
  );
};

HomePage.propTypes = {
  state: PropTypes.object,
};

export default connect(HomePage);
