import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { WikipediaWidgetDetail } from '@/features/widget/article-of-the-day/edit/details'
import { WikipediaArguments } from '@/lib/argument-types'
import { EditableComponent } from '@/lib/widget-types'
import { languages } from './details'

export interface WikipediaEditWidgetProps extends CommonEditWidgetProps {
  args: WikipediaArguments
  updateFn: ({ args }: { args: WikipediaArguments }) => void
}

export const DefaultWikipediaArgumentValues: WikipediaArguments = {
  levelOfDetail: 0,
  language: 'en',
}

export const validateWikipediaArgumentValues = ({ args }: { args: WikipediaArguments }): boolean => {
  const levelOfDetailValid = args.levelOfDetail >= 0 && args.levelOfDetail <= 3
  const languageValid = args.language.length === 2 && languages.some((lang) => lang.value === args.language)
  return languageValid && levelOfDetailValid
}

export const WikipediaEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<WikipediaArguments>[] = [
    {
      component: WikipediaWidgetDetail,
      minimumSize: {
        name: 'Wikipedia Widget with description text',
        width: 4,
        height: 4,
      },
    },
    {
      component: WikipediaWidgetDetail,
      minimumSize: {
        name: 'Wikipedia Widget without description text',
        width: 3,
        height: 3,
      },
    },
    {
      component: WikipediaWidgetDetail,
      minimumSize: {
        name: 'Wikipedia Widget with description and without button',
        width: 3,
        height: 3,
      },
    },
    {
      component: WikipediaWidgetDetail,
      minimumSize: {
        name: 'Wikipedia Widget without description text and without button',
        width: 3,
        height: 3,
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
