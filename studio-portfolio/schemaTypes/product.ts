import { defineField, defineType } from 'sanity'

export const product = defineType({
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
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and screen readers.',
          validation: (rule) => rule.required(),
        },
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
