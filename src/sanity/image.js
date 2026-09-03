import { createImageUrlBuilder } from '@sanity/image-url'
import { projectId, dataset } from './client'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || 'zt9wetk3',
  dataset: dataset || 'production',
})

export const urlForImage = (source) => {
  if (!source || (!source.asset && !source._ref)) {
    return null
  }
  return imageBuilder.image(source).auto('format').fit('max')
}

/**
 * Returns an optimized Sanity CDN image URL with width, quality, and format presets.
 * Ensures images don't get fetched at unnecessary 4K resolutions.
 */
export const getOptimizedImageUrl = (source, width = 1200, quality = 80) => {
  if (!source) return null
  if (typeof source === 'string') return source

  const builder = urlForImage(source)
  if (!builder) {
    return source.asset?.url || null
  }

  return builder.width(width).quality(quality).auto('format').url()
}
