import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Summary',
      type: 'text',
      rows: 3,
      description: 'Brief summary shown on blog preview cards and SEO meta descriptions.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories & Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'readTime',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      initialValue: 5,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Highlight this post at the top of the blog page.',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'syncMetadata',
      title: 'Cross-Platform Sync Settings',
      type: 'object',
      description: 'Metadata for future syncing with Medium, Dev.to, Hashnode, etc.',
      fields: [
        {
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'Original URL of this article to prevent SEO duplication penalties.',
        },
        {
          name: 'mediumUrl',
          title: 'Medium Story URL',
          type: 'url',
        },
        {
          name: 'devToUrl',
          title: 'Dev.to Article URL',
          type: 'url',
        },
        {
          name: 'hashnodeUrl',
          title: 'Hashnode Article URL',
          type: 'url',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      date: 'publishedAt',
    },
    prepare(selection) {
      const { author, date } = selection
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'Draft'
      return {
        ...selection,
        subtitle: `${author ? `by ${author} • ` : ''}${formattedDate}`,
      }
    },
  },
})
