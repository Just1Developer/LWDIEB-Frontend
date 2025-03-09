import { WikipediaEditWidgetProps } from '@/features/widget/article-of-the-day/edit/widget'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export const languages = [
  {
    value: 'bn',
    label: 'Bengali / বাংলা',
  },
  {
    value: 'de',
    label: 'German / Deutsch',
  },
  {
    value: 'el',
    label: 'Greek / Ελληνικά',
  },
  {
    value: 'en',
    label: 'English / English',
  },
  {
    value: 'he',
    label: 'Hebrew / עברית',
  },
  {
    value: 'hu',
    label: 'Hungarian / Magyar',
  },
  {
    value: 'ja',
    label: 'Japanese / 日本語',
  },
  {
    value: 'sd',
    label: 'Sindhi / سنڌي، سندھی ، सिन्ध',
  },
  {
    value: 'sv',
    label: 'Swedish / Svenska',
  },
  {
    value: 'ur',
    label: 'Urdu / 	اردو',
  },
  {
    value: 'vi',
    label: 'Vietnamese / Tiếng Việt',
  },
  {
    value: 'zh',
    label: 'Chinese / 	中文',
  },
]

export const WikipediaWidgetDetail = ({ args, updateFn }: WikipediaEditWidgetProps) => {
  const { language } = args

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(language)

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="absolute left-0 top-0 p-4">
        <p className="text-xs">Wikipedia Article of the Day Widget</p>
      </div>
      <p className="mb-2 text-sm">Select the language of the widget:</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
            {value ? languages.find((framework) => framework.value === value)?.label : 'Select framework...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Select Widget Language..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {languages.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.label}
                    onSelect={(currentValue) => {
                      const updatedValue = languages.find((framework) => framework.label === currentValue)?.value
                      if (updatedValue) {
                        setValue(updatedValue)
                        const updatedArgs = {
                          ...args,
                          language: updatedValue,
                        }
                        updateFn({ args: updatedArgs })
                      }
                      setOpen(false)
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
