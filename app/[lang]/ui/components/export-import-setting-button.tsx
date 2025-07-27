import { useState, useCallback, ReactElement } from 'react'
import { Button } from '@nextui-org/button'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover'
import { toast } from 'sonner'

import { getFormatDate, saveAs } from '@/app/lib/tools'
import { Tran } from '@/app/lib/types'

export const ExportImportSettingsButton = ({
  t,
  getExportData,
  importSSMLSettings,
  buttonIcon,
}: {
  t: Tran
  getExportData: () => string
  importSSMLSettings: (ssml: string) => void
  buttonIcon: ReactElement
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)

  const handleExport = () => {
    const data = getExportData()
    const blob = new Blob([data], { type: 'text/plain' })

    const fileName = `Azure-SSML-${getFormatDate(new Date())}.txt`

    saveAs(blob, fileName)
    setIsPopoverOpen(false)
    toast.success(t['export-ssml-settings-success'])
  }

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt'
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        if (!file.name.endsWith('.txt')) {
          toast.error(t['import-ssml-settings-error-file-type'])
          return
        }

        const reader = new FileReader()
        reader.onload = e => {
          const content = e.target?.result as string
          importSSMLSettings(content)
          toast.success(t['import-ssml-settings-success'])
        }
        reader.onerror = error => {
          console.error('Error reading file:', error)
          toast.error(t['import-ssml-settings-error'])
        }
        reader.readAsText(file)
      }
    }
    input.click()
    setIsPopoverOpen(false)
  }, [importSSMLSettings, t])

  return (
    <Popover placement="right" isOpen={isPopoverOpen} onOpenChange={open => setIsPopoverOpen(open)}>
      <PopoverTrigger>{buttonIcon}</PopoverTrigger>
      <PopoverContent>
        <div className="px-3 pt-2 text-left font-bold w-full select-none">{t['export-import-settings']}</div>
        <div className="px-1 py-2 w-full flex flex-col gap-2">
          <Button color="primary" onClick={handleExport} className="w-full">
            {t['export-ssml-settings']}
          </Button>
          <Button color="secondary" onClick={handleImport} className="w-full">
            {t['import-ssml-settings']}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
