import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { NewsWidgetDetail } from '@/features/widget/news/edit/details1'
import { NewsArguments } from '@/lib/argument-types'
import { EditableComponent } from '@/lib/widget-types'

export interface NewsEditWidgetProps extends CommonEditWidgetProps {
  args: NewsArguments
  updateFn: ({ args }: { args: NewsArguments }) => void
}

export const DefaultNewsArgumentValues: NewsArguments = {
  levelOfDetail: 0,
  sourceLink: 'https://www.tagesschau.de/index~rss2.xml',
}

export const validateNewsArgumentValues = ({ args }: { args: NewsArguments }): boolean => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(:\\d+)?(\\/[-\\w%.~+]*)*' + // port and path
      '(\\?[;&\\w%.~+=-]*)?' + // query string
      '(#[-\\w]*)?$',
    'i', // fragment locator
  )

  return !(!args.sourceLink || !urlPattern.test(args.sourceLink))
}

export const NewsEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<NewsArguments>[] = [
    {
      component: NewsWidgetDetail,
      minimumSize: {
        name: 'News Widget with Only Titles',
        width: 3,
        height: 3,
      },
    },
    {
      component: NewsWidgetDetail,
      minimumSize: {
        name: 'News Widget with Description',
        width: 5,
        height: 5,
      },
    },
  ]

  return LevelOfDetails.map(
    ({ component, minimumSize }): EditableComponent =>
      toEditableComponent({
        result: FormlessEditableWidget({
          LevelOfDetail: component,
        }),
        minimumSize: minimumSize,
      }),
  )
}
