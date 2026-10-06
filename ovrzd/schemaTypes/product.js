import {defineType, defineField} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'T-shirt',
  type: 'document',
  fields: [
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      description: 'Landscape photo works best (wide, 16:10). Any size is fine, it is resized automatically.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Design name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'colour',
      title: 'Colour',
      type: 'string',
      options: {
        list: ['Black', 'White', 'Grey', 'Navy', 'Beige', 'Olive', 'Red', 'Blue'],
        layout: 'radio',
      },
      initialValue: 'Black',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (LKR)',
      type: 'number',
      description: 'Numbers only, e.g. 3500. Leave empty to show "Message us for price".',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes available',
      type: 'array',
      of: [{type: 'string'}],
      options: {list: ['S', 'M', 'L', 'XL', 'XXL'], layout: 'grid'},
      initialValue: ['S', 'M', 'L', 'XL', 'XXL'],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'inStock',
      title: 'In stock',
      type: 'boolean',
      description: 'Switch off when sold out. The design stays on the site with a "Sold out" label and cannot be ordered.',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Smaller numbers show first (1 is the very first design).',
    }),
  ],
  orderings: [
    {title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', colour: 'colour', price: 'price', inStock: 'inStock', media: 'photo'},
    prepare({title, colour, price, inStock, media}) {
      return {
        title: `${title} (${colour || ''})`,
        subtitle: `${price ? 'LKR ' + price : 'No price yet'} · ${inStock === false ? 'SOLD OUT' : 'In stock'}`,
        media,
      }
    },
  },
})
