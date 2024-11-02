import React from 'react'
import { Tran } from '@/app/lib/types'

const Announcement = ({ t }: { t: Tran }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto text-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{t['announcement']}</h3>
        <p className="text-gray-600 dark:text-gray-300">{t['announcement-content']}</p>
      </div>
    </div>
  )
}

export default function Web({ t }: { t: Tran }) {
  return (
    <div>
      <Announcement t={t} />
    </div>
  )
}
