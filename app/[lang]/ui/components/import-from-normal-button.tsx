import { useState, ReactElement } from 'react'
import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react'
import { toast } from 'sonner'

import { generateSSML } from '@/app/lib/tools'
import { Tran } from '@/app/lib/types'
import { useTTSStore } from '@/app/lib/stores'

export const ImportFromNormalButton = ({ t, buttonIcon }: { t: Tran; buttonIcon: ReactElement }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const { normalModeCache, setInput } = useTTSStore()

  const handleImport = () => {
    if (!normalModeCache || !normalModeCache.input.trim()) {
      toast.error(t['import-from-normal-no-content'])
      return
    }

    const generatedSSML = generateSSML(
      {
        input: normalModeCache.input,
        config: normalModeCache.config,
      },
      { compression: false },
    ) // Use non-compressed format for better readability

    setInput(generatedSSML)
    setIsModalOpen(false)
    toast.success(t['import-from-normal-success'])
  }

  const handleButtonClick = () => {
    if (!normalModeCache || !normalModeCache.input.trim()) {
      toast.error(t['import-from-normal-no-content'])
      return
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <div onClick={handleButtonClick}>{buttonIcon}</div>

      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="md">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">{t['import-from-normal']}</ModalHeader>
              <ModalBody>
                <p>{t['import-from-normal-confirm']}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  {t.cancel}
                </Button>
                <Button color="primary" onPress={handleImport}>
                  {t.confirm}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
