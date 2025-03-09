import { WikipediaWidgetView } from '@/features/widget/article-of-the-day/view/view'
import { WikipediaArguments, WikipediaDataArguments } from '@/lib/argument-types'

const dataFetchArgs: WikipediaArguments = {
  levelOfDetail: 3,
  language: 'en',
}

const data: WikipediaDataArguments = {
  title: 'Article of the Day',
  image: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
  extract: 'This is an example extract from a Wikipedia article used for preview purposes.',
  url: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
}

export const WikipediaWidgetPreviewAlternative = () => {
  const View = WikipediaWidgetView({ showButton: false, showDescription: true })
  return <View args={{ dataFetchArgs, data, currentSize: { width: 3, height: 3 } }} />
}
