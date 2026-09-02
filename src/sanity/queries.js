import { defineQuery } from 'next-sanity'

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(featured desc, publishedAt desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readTime,
    featured,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    author->{
      _id,
      name,
      role,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      "slug": slug.current,
      color
    }
  }
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    readTime,
    featured,
    mainImage {
      asset->{
        _id,
        url
      },
      alt
    },
    author->{
      _id,
      name,
      role,
      bio,
      image {
        asset->{
          _id,
          url
        }
      }
    },
    categories[]->{
      _id,
      title,
      "slug": slug.current,
      color
    },
    syncMetadata {
      canonicalUrl,
      mediumUrl,
      devToUrl,
      hashnodeUrl
    },
    body
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`)
