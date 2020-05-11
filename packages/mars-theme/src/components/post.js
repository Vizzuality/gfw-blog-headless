import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, styled } from 'frontity';
import { Button } from 'gfw-components';
import Link from './link';
import List from './list';
import FeaturedMedia from './featured-media';
import Breadcrumbs from './breadcrumbs';
import FacebookIcon from '../assets/icons/social/facebook.svg';
import TwitterIcon from '../assets/icons/social/twitter-1.svg';
import NewsletterIcon from '../assets/icons/social/newsletter.svg';
import CategoryNameList from './category/list-name';
import {
  SMALL_ENDPOINT,
  MEDIUM_ENDPOINT,
  LARGE_ENDPOINT,
} from './heplers/css-endpoints';

const Post = ({ state, actions, libraries }) => {
  // Get information about the current URL.
  const data = state.source.get(state.router.link);
  // Get the data of the post.
  const post = state.source[data.type][data.id];
  // Get the data of the author.
  const author = state.source.author[post.author];
  // Get a human readable date.

  const date = new Date(post.date);
  const month = date.toLocaleString('en-GB', { month: 'long' });
  const dateStr = `${month} ${date.getDate()}, ${date.getFullYear()}`;

  const categories = post.categories.map((id) => {
    return state.source.category[id];
  });

  const tags = post.tags.map((id) => {
    return state.source.tag[id];
  });

  // Get the html2react component.
  const Html2React = libraries.html2react.Component;

  /**
   * Once the post has loaded in the DOM, prefetch both the
   * home posts and the list component so if the user visits
   * the home page, everything is ready and it loads instantly.
   */
  useEffect(() => {
    actions.source.fetch('/');
    List.preload();
  }, []);

  // Load the post, but only if the data is ready.
  return data.isReady ? (
    <Container id="post-content">
      <BreadCrumbsWrapper>
        <Breadcrumbs />
      </BreadCrumbsWrapper>
      {/* Look at the settings to see if we should include the featured image */}
      {state.theme.featured.showOnPost && (
        <FeaturedMedia
          id={post.featured_media}
          styles={`
            max-width: 1110px;
            margin: 0 auto;
            height: 500px;
            @media screen and (max-width: ${MEDIUM_ENDPOINT}) {
              height: 320px
            }
        `}
        />
      )}
      <TopInfoWrapper>
        <ContentWrapper>
          <SideBar>
            {/* Only display author and date on posts */}
            {data.isPost && (
              <InfoContainer>
                {author && (
                  <p>
                    <StyledLink link={author.link}>
                      <Author>
                        By&nbsp;
                        <b>{author.name}</b>
                      </Author>
                    </StyledLink>
                  </p>
                )}
                <Fecha>
                  {' '}
                  Posted on&nbsp;
                  <b>{dateStr}</b>
                </Fecha>
              </InfoContainer>
            )}
            <ButtonsContainer>
              <a
                href="https://twitter.com/globalforests"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="twitter"
              >
                <Button theme="button-light round big">
                  <img src={TwitterIcon} alt="" />
                </Button>
              </a>
              <a
                href="https://www.facebook.com/globalforests/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="facebook"
              >
                <Button theme="button-light round big">
                  <img src={FacebookIcon} alt="" />
                </Button>
              </a>
              <a href="#">
                <Button theme="button-light round big">
                  <img src={NewsletterIcon} alt="" />
                </Button>
              </a>
            </ButtonsContainer>
          </SideBar>
        </ContentWrapper>

        <div>
          <CategoriesWrapper>
            <CategoryNameList
              categories={categories}
              itemStyles={`
            margin-top: 0;
          `}
            />
          </CategoriesWrapper>
          <Title dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </div>
      </TopInfoWrapper>

      {/* Render the content using the Html2React component so the HTML is processed
       by the processors we included in the libraries.html2react.processors array. */}
      <Content>
        <Html2React html={post.content.rendered} />
        <CategoriesWrapper>
          <CategoryNameList
            categories={tags}
            styles={`
                margin-top: 1.25rem;
            `}
            itemStyles={`
              background-color: #E5E5DF;
              color: #333 !important;
          `}
          />
        </CategoriesWrapper>
      </Content>
    </Container>
  ) : null;
};

export default connect(Post);

Post.propTypes = {
  state: PropTypes.object,
  actions: PropTypes.object,
  libraries: PropTypes.object,
};

const ButtonsContainer = styled.div`
  a {
    display: inline-block;
    margin-bottom: 0;
    margin-right: 1.125rem;
    @media screen and (min-width: ${MEDIUM_ENDPOINT}) {
      margin-right: 0;
      margin-bottom: 1.25rem;
      display: block;
    }
  }
`;

const InfoContainer = styled.div`
  margin-bottom: 2.5rem;
`;

const Container = styled.div`
  margin: 0;
  padding: 0;
  padding-top: 3.125rem;
  width: 100%;
`;

const Title = styled.h1`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 8px;
  color: #333;
  max-width: 1110px;
  font-size: 1.875rem;
  line-height: 1.25;
  font-weight: 200;
  @media screen and (min-width: ${MEDIUM_ENDPOINT}) {
    font-size: 3rem;
    line-height: 3.75rem;
    padding-left: 17.8125rem;
  }
`;

const SideBar = styled.div`
  @media screen and (min-width: ${MEDIUM_ENDPOINT}) {
    position: absolute;
    top: 0;
    z-index: 2;
    width: auto;
  }
  .button-light {
    border: 0;
  }
  width: 100%;
`;

const StyledLink = styled(Link)`
  padding: 15px 0;
`;

const Author = styled.p`
  color: rgba(12, 17, 43, 0.9);
  font-size: 0.9em;
  display: inline-block;
  margin-bottom: 1.25rem;
`;

const Fecha = styled.p`
  color: rgba(12, 17, 43, 0.9);
  font-size: 0.9em;
  display: inline;
`;

const ContentWrapper = styled.div`
  position: relative;
  max-width: 1110px;
  margin: 0 auto;
  @media screen and (max-width: ${MEDIUM_ENDPOINT}) {
    width: 100%;
  }
`;

const BreadCrumbsWrapper = styled.div`
  max-width: 1110px;
  margin: 0 auto;
  margin-bottom: 1.875rem;
`;

const CategoriesWrapper = styled.div`
  max-width: 1110px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4rem;
  margin-bottom: 1rem;
  @media screen and (min-width: ${MEDIUM_ENDPOINT}) {
    margin-top: 5.625rem;
    margin-bottom: 1.875rem;
    padding-left: 17.8125rem;
    padding-right: 11.875rem;
  }
`;

const TopInfoWrapper = styled.div`
  padding: 0;
  @media screen and (max-width: ${MEDIUM_ENDPOINT}) {
    display: flex;
    flex-wrap: wrap;
    flex-flow: column-reverse;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

/**
 * This component is the parent of the `content.rendered` HTML. We can use nested
 * selectors to style that HTML.
 */
const Content = styled.div`
  & > iframe,
  & > .wp-block-pullquote {
    padding-left: 1rem;
    padding-right: 1rem;
    @media screen and (min-width: ${MEDIUM_ENDPOINT}) {
      max-width: 1110px;
      margin: 0 auto;
      width: 730px;
      padding: 0 important;
      box-sizing: content-box;
    }
  }
  & > *:not(.wp-block-gallery):not(iframe):not(.wp-block-pullquote) {
    @media screen and (min-width: ${MEDIUM_ENDPOINT}) {
      max-width: 1110px;
      margin: 0 auto;
      padding-left: 17.8125rem;
      padding-right: 11.875rem;
    }
    padding-left: 1rem;
    padding-right: 1rem;
  }

  p {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
  }

  & > .attribute {
    color: #787878;
    font-style: italic;
    font-size: 1.25rem;
    line-height: 2.25rem;
    padding-top: 2.625rem;
    padding-bottom: 2.625rem;

    @media screen and (max-width: ${MEDIUM_ENDPOINT}) {
      font-size: 1.125rem;
    }

    &::after {
      height: 1px;
      display: block;
      width: 100px;
      background-color: #aaa;
      border-right: 1px white;
      content: '';
      margin-top: 2.625rem;
    }

    &::before {
      height: 1px;
      display: block;
      width: 100px;
      background-color: #aaa;
      border-right: 1px white;
      content: '';
      margin-bottom: 2.625rem;
    }
  }

  & > hr {
    display: none;
  }

  & > * {
    font-size: 1.25rem;
    @media screen and (max-width: ${MEDIUM_ENDPOINT}) {
      font-size: 1.125rem;
    }
  }

  blockquote {
    font-size: 1.875rem;
    line-height: 1.5;
    @media screen and (max-width: ${MEDIUM_ENDPOINT}) {
      font-size: 1.5rem;
    }
  }

  iframe {
    height: fill-available;
  }

  .wp-block-pullquote {
    blockquote {
      background-color: #fff;
      border: 0;
    }
  }

  .wp-block-gallery {
    max-width: 779px;
  }

  .wp-block-gallery figure {
    width: 729px !important;
    // max-width: 729px !important;
    img {
      height: 486px;
      @media screen and (max-width: ${SMALL_ENDPOINT}) {
        height: 230px;
      }
    }
  }

  .c-carousel {
    margin-top: 1.25rem;
    margin-bottom: 3.25rem;
    @media screen and (min-width: ${LARGE_ENDPOINT}) {
      margin-top: 3.75rem;
      margin-bottom: 3.75rem;
      .slick-prev {
        left: -143px;
      }
      .slick-next {
        right: -176px;
      }
    }

    @media screen and (max-width: ${SMALL_ENDPOINT}) {
      .slick-prev {
        left: 0;
      }
      .slick-next {
        right: 0;
      }
    }

    .slick-prev,
    .slick-next {
      background-color: #333;
      border-radius: 22px;
      z-index: 7;
    }
  }

  position: relative;
  font-size: 1.25rem;
  line-height: 2.25rem;
  color: rgba(12, 17, 43, 0.8);
  word-break: break-word;

  * {
    max-width: 100%;
  }

  .c-carousel .slick-slide {
    // box-sizing: content-box;
  }

  p {
    line-height: 1.6em;
  }

  img {
    width: 150%;
    object-fit: cover;
    object-position: center;
  }

  figure {
    margin: 0 auto;
    /* next line overrides an inline style of the figure element. */
    // width: 100% !important;

    figcaption {
      font-size: 0.7em;
    }
  }

  iframe {
    display: block;
    margin: auto;
  }

  a {
    color: #97bd3d;
    text-decoration: underline;
  }

  /* Input fields styles */

  input[type='text'],
  input[type='email'],
  input[type='url'],
  input[type='tel'],
  input[type='number'],
  input[type='date'],
  textarea,
  select {
    display: block;
    padding: 6px 12px;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 4px;
    outline-color: transparent;
    transition: outline-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    margin: 8px 0 4px 0;

    &:focus {
      outline-color: #1f38c5;
    }
  }

  input[type='submit'] {
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid #1f38c5;
    padding: 12px 36px;
    font-size: 14px;
    line-height: 1.42857143;
    border-radius: 4px;
    color: #fff;
    background-color: #1f38c5;
  }

  /* WordPress Core Align Classes */

  @media (min-width: 420px) {
    img.aligncenter,
    img.alignleft,
    img.alignright {
      width: auto;
    }

    .aligncenter {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }

    .alignright {
      float: right;
      margin-left: 24px;
    }

    .alignleft {
      float: left;
      margin-right: 24px;
    }
  }
`;
