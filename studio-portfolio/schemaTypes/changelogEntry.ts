import { defineType, defineField, defineArrayMember } from 'sanity'

export const changelogEntry = defineType({
  name: 'changelogEntry',
  title: 'Changelog Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Release Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Release Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      initialValue: () => new Date().toISOString().split('T')[0],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g. Chatbot, Performance, Realtime, Infrastructure, UI/UX',
      options: {
        list: [
          { title: 'AI Assistant', value: 'Chatbot' },
          { title: 'Realtime & Relay', value: 'Realtime' },
          { title: 'Performance & Architecture', value: 'Performance' },
          { title: 'UI & Design', value: 'Design' },
          { title: 'Security & Infrastructure', value: 'Infrastructure' },
        ],
      },
      initialValue: 'Chatbot',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'e.g. Feature, Fix, Improvement, Security',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
        }),
      ],
      description: 'Summary of the release, features, or architectural enhancements.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      category: 'category',
    },
    prepare({ title, subtitle, category }) {
      return {
        title,
        subtitle: `${subtitle || 'Draft'} • ${category || 'General'}`,
      }
    },
  },
})
