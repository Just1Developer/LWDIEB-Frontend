import { NewsEditWidgetProps } from '@/features/widget/news/edit/widget'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { NewsArguments } from '@/lib/argument-types'
import { cn } from '@/lib/utils'

const news = [
  {
    value: 'https://www.tagesschau.de/index~rss2.xml',
    label: 'Tagesschau',
  },
  {
    value: 'http://rss.focus.de/fol/XML/rss_folnews.xml',
    label: 'FOCUS-Online-Nachrichten',
  },
  {
    value: 'https://www.t-online.de/nachrichten/feed.rss',
    label: 'T-Online Politik',
  },
  {
    value: 'https://www.n-tv.de/rss',
    label: 'n-tv',
  },
  {
    value: 'https://web.de/feeds/rss/index.rss',
    label: 'web.de',
  },
  {
    value: 'https://www.spiegel.de/schlagzeilen/index.rss',
    label: 'SPIEGEL',
  },
  {
    value: 'https://www.welt.de/feeds/latest.rss',
    label: 'WELT',
  },
  {
    value: 'https://www.zdf.de/rss/zdf/nachrichten',
    label: 'ZDF Heute Nachrichten',
  },
  {
    value: 'https://newsfeed.zeit.de/index',
    label: 'ZEIT',
  },
  {
    value: 'https://www.kit.edu/pi.rss',
    label: 'KIT Presseinformationen',
  },
]

/**
 * NewsWidgetDetail component allows users to select or input a custom news feed link.
 *
 * @param {NewsEditWidgetProps} props - The properties for the component.
 * @param {object} props.args - The arguments for the news widget.
 * @param {function} props.updateFn - The function to update the news widget arguments.
 *
 * @returns {JSX.Element} The rendered NewsWidgetDetail component.
 *
 * @component
 *
 * @example
 * <NewsWidgetDetail args={args} updateFn={updateFn} />
 *
 * @function
 * @name NewsWidgetDetail
 *
 * @description
 * This component provides a UI for selecting a predefined news feed or entering a custom news feed link.
 * It uses a combination of state hooks and controlled components to manage the input and selection states.
 * The component also uses the Popover and Command components from the `@/components/ui` directory to display a list of predefined news feeds.
 */
export const NewsWidgetDetail = ({ args, updateFn }: NewsEditWidgetProps) => {
  const [open, setOpen] = React.useState(false)
  const [sourceLink, setSourceLink] = React.useState(args.sourceLink)
  const [customFeed, setCustomFeed] = React.useState(news.some((framework) => framework.value === sourceLink))

  const handleSourceLinkChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceLink(event.target.value)
  }

  const updateSourceLinkChange = () => {
    try {
      const updatedArgs: NewsArguments = {
        ...args,
        sourceLink: sourceLink,
      }
      updateFn({ args: updatedArgs })
      updateFn({ args: updatedArgs })
    } catch (error) {
      return
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="absolute left-0 top-0 p-4">
        <p className="text-xs text-accent-foreground/50">Newsfeed Widget</p>
      </div>
      <p className="mb-2 text-sm text-accent-foreground/50">Select your news-feed or select your own:</p>
      <Switch checked={customFeed} onCheckedChange={(checked) => setCustomFeed(checked)} className="mb-4" />
      {customFeed ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
              {sourceLink ? news.find((framework) => framework.value === sourceLink)?.label : 'Select newsfeed'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="h-[150px] w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Select Newsfeed..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {news.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.label}
                      onSelect={(currentValue) => {
                        const updatedValue = news.find((framework) => framework.label === currentValue)?.value
                        if (updatedValue) {
                          setSourceLink(updatedValue)
                          const updatedArgs = {
                            ...args,
                            sourceLink: updatedValue,
                          }
                          updateFn({ args: updatedArgs })
                        }
                        setOpen(false)
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', sourceLink === framework.value ? 'opacity-100' : 'opacity-0')} />
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex h-[150px] w-[200px] items-center justify-center border border-dashed border-gray-300">
          <textarea className="h-full w-full" value={sourceLink} onChange={handleSourceLinkChange} onBlur={updateSourceLinkChange} />
        </div>
      )}
    </div>
  )
}
