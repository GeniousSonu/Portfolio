import { defineType, defineArrayMember } from 'sanity'

export const blockContent = defineType({
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
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    defineArrayMember({
      name: 'codeBlock',
      title: 'Code Snippet',
      type: 'object',
      fields: [
        {
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
        },
        {
          name: 'filename',
          title: 'Filename (optional)',
          type: 'string',
        },
        {
          name: 'code',
          title: 'Code',
          type: 'text',
          rows: 10,
        },
      ],
    }),
    defineArrayMember({
      name: 'callout',
      title: 'Callout Box',
      type: 'object',
      fields: [
        {
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
        },
        {
          name: 'title',
          title: 'Callout Title',
          type: 'string',
        },
        {
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 3,
        },
      ],
    }),
  ],
})
