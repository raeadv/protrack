import { apiClient } from '@/utils/client'
import { Select } from '@mantine/core'
import { useState } from 'react'
import { useMount } from 'react-use'


export function DynamicDropdown({ type = '', onSelect = null, selected = null, ...props }) {
  const [options, setOptions] = useState([])

  const getOptions = async () => {
    setOptions([])
    let url = "/resources/dynamic/" + type
    const { data, status } = await apiClient.get(url)

    if (status === 200) {
      setOptions(data.options)
    }
  }

  useMount(() => {
    getOptions()
  })

  return <Select
    data={options?.length > 0 && options.map((o) => ({ value:String(o.value), label:o.label}))}
    value={String(selected || '')}
    onChange={v => onSelect?.(v)}
    {...props}
  />

}
