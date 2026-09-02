import createImageUrlBuilder from '@sanity/image-url'
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
