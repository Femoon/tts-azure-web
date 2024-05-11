import { genders } from './constants'
import { ListItem } from './types'

export function saveAs(blob: Blob, name: string) {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.setAttribute('style', 'display: none')
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = name
  a.click()
  window.URL.revokeObjectURL(url)
}

interface GenderFilter {
  label: string
  value: string
}

interface GenderResult extends GenderFilter {
  show: boolean
}

export function filterAndDeduplicateByGender(data: ListItem[]): GenderResult[] {
  const genderMap: { [key: string]: GenderResult } = genders.reduce<{ [key: string]: GenderResult }>((acc, gender) => {
    acc[gender.value] = {
      ...gender,
      show: false,
    }
    return acc
  }, {})

  data.forEach((item: ListItem) => {
    const genderValue = item.Gender.charAt(0).toUpperCase() + item.Gender.slice(1).toLowerCase()
    if (genderMap[genderValue]) {
      genderMap[genderValue].show = true
    }
  })

  // Ensure all genders are reshowed, even if not show in the data
  const finalResult: GenderResult[] = Object.values(genderMap).map(gender => {
    if (!gender.show) {
      return { ...gender, show: false }
    }
    return gender
  })

  return finalResult
}
