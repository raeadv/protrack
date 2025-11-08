import { apiClient } from '@/utils/client'
import { Autocomplete, Button, Card, Text, Textarea, TextInput } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import { PlusIcon } from 'lucide-react'
import React from 'react'

export function TaskForm({ projectId = null }) {

  const [task, setTask] = useSetState({
    title: '',
    description: '',
    projectId: projectId
  })


  return <Card withBorder shadow='md' className='my-2 rounded-md' pos='relative'>

    <Text className='text-center' fw={600}>Add Task</Text>
    {
      !projectId && <Autocomplete label='Project' />
    }

    <TextInput label='Title' />
    <Textarea label='Description' />

    <Button variant='filled' fullWidth ><PlusIcon className='size-4 shrink-0' onClick={addTask} /> Add Task</Button>


  </Card>


  async function addTask() {

    console.log(task)
    // const { data, status } = await apiClient.post('/tasks')


  }


}
