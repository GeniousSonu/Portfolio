import { defineConfig, defineField, defineType, defineArrayMember } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

// ── Schema Types ────────────────────────────────────────────

const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
        ],
        annotations: [
          defineArrayMember({
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              defineField({ title: 'URL', name: 'href', type: 'url' }),
              defineField({ title: 'Open in new tab', name: 'blank', type: 'boolean', initialValue: true }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alternative Text', description: 'Important for SEO and accessibility.' }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
      ],
    }),
    defineArrayMember({
      name: 'codeBlock',
      title: 'Code Snippet',
      type: 'object',
      fields: [
        defineField({
          name: 'language',
          title: 'Language',
          type: 'string',
          options: {
            list: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'JSX/TSX', value: 'tsx' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'Bash/Shell', value: 'bash' },
              { title: 'JSON', value: 'json' },
              { title: 'Python', value: 'python' },
              { title: 'Rust', value: 'rust' },
              { title: 'Go', value: 'go' },
              { title: 'SQL', value: 'sql' },
              { title: 'GraphQL', value: 'graphql' },
            ],
          },
          initialValue: 'javascript',
        }),
        defineField({ name: 'filename', title: 'Filename (optional)', type: 'string' }),
        defineField({ name: 'code', title: 'Code', type: 'text', rows: 10 }),
      ],
    }),
    defineArrayMember({
      name: 'callout',
      title: 'Callout Box',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'Info (Blue)', value: 'info' },
              { title: 'Tip (Green/Cyan)', value: 'tip' },
              { title: 'Warning (Amber)', value: 'warning' },
              { title: 'Quote / Highlight (Purple)', value: 'highlight' },
            ],
          },
          initialValue: 'info',
        }),
        defineField({ name: 'title', title: 'Callout Title', type: 'string' }),
        defineField({ name: 'content', title: 'Content', type: 'text', rows: 3 }),
      ],
    }),
  ],
})

const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: 'role', title: 'Role / Headline', type: 'string', description: 'e.g. Full-Stack Developer & AI Specialist' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 3 }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
})

const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'color', title: 'Badge Color (Hex or Tag)', type: 'string', description: 'e.g. #3b82f6 or cyan, purple, amber, emerald' }),
  ],
})

const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: 'excerpt', title: 'Excerpt / Summary', type: 'text', rows: 3, description: 'Brief summary shown on blog preview cards and SEO meta descriptions.', validation: (rule) => rule.max(300) }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({
      name: 'mainImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alternative Text', description: 'Important for SEO and accessibility.' }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Categories & Tags',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'category' }],
        }),
      ],
    }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'readTime', title: 'Estimated Read Time (minutes)', type: 'number', initialValue: 5 }),
    defineField({ name: 'featured', title: 'Featured Post', type: 'boolean', description: 'Highlight this post at the top of the blog page.', initialValue: false }),
    defineField({ name: 'body', title: 'Body Content', type: 'blockContent' }),
    defineField({
      name: 'syncMetadata',
      title: 'Cross-Platform Sync Settings',
      type: 'object',
      description: 'Metadata for future syncing with Medium, Dev.to, Hashnode, etc.',
      fields: [
        defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url', description: 'Original URL of this article to prevent SEO duplication penalties.' }),
        defineField({ name: 'mediumUrl', title: 'Medium Story URL', type: 'url' }),
        defineField({ name: 'devToUrl', title: 'Dev.to Article URL', type: 'url' }),
        defineField({ name: 'hashnodeUrl', title: 'Hashnode Article URL', type: 'url' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', author: 'author.name', media: 'mainImage', date: 'publishedAt' },
    prepare(selection) {
      const { author, date } = selection
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'Draft'
      return { ...selection, subtitle: `${author ? `by ${author} • ` : ''}${formattedDate}` }
    },
  },
})

const product = defineType({
  name: 'product',
  title: 'Affiliate Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and screen readers.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Concise summary of why you recommend this item.',
      validation: (rule) => rule.max(350),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Dev Tools', value: 'Dev Tools' },
          { title: 'Desk Setup', value: 'Desk Setup' },
          { title: 'Hardware', value: 'Hardware' },
          { title: 'Software & SaaS', value: 'Software' },
          { title: 'Books & Learning', value: 'Books' },
        ],
      },
      initialValue: 'Dev Tools',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Approximate Price',
      type: 'string',
      description: 'e.g. $49, $199, ₹2,499 (affiliate prices may vary over time).',
    }),
    defineField({
      name: 'affiliateUrl',
      title: 'Affiliate / Purchase URL',
      type: 'url',
      validation: (rule) => rule.required().uri({
        scheme: ['http', 'https'],
      }),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Item',
      type: 'boolean',
      description: 'Highlight this product as a top pick at the top of the store page.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
      price: 'price',
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title,
        subtitle: `${subtitle || 'Uncategorized'}${price ? ` • ${price}` : ''}`,
        media,
      }
    },
  },
})

// ── Embedded Studio Config ───────────────────────────────────

export default defineConfig({
  name: 'portfolio-studio',
  title: 'SK Sahinur — Blog Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zt9wetk3',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: [post, author, category, blockContent, product],
  },
})
