import react from 'react'
import { Card, Text, Button } from '@mantine/core'
import { DynamicDropdown } from '@/components/input/DynamicDropdown'
import { useSetState } from 'react-use'
import { apiClient } from '@/utils/client'
import { PlusIcon } from 'lucide-react'

export function ProjectAssigmentForm({ projectId = null }) {

  const [assignments, setAssigments] = useSetState({
    userId: null,
    roleId: null,
    projectId: projectId
  })


  return <Card title='Assignments' pos="relative" withBorder shadow='md' className='rounded-md mt-4'>
    <Text className='text-center' fw={800}>Assignments</Text>
    <div className='flex flex-row space-x-2 items-end justify-start'>
      <DynamicDropdown type='users' label="User" className="min-w-[300px] w-full"
        selected={assignments.userId}
        onSelect={selected => setAssigments({ userId: selected })}
      />
      <DynamicDropdown type='roles' label="Role" className="min-w-[300px] w-full"
        selected={assignments.roleId}
        onSelect={selected => setAssigments({ roleId: selected })}
        searchable
        maxDropdownHeight={200}
      />
      <Button variant='filled' onClick={addAssignments} className='min-w-16' >
        <PlusIcon className='size-4 shrink-0' />
      </Button>
    </div>
  </Card>

  async function addAssignments() {

    setAssigments({ projectId: projectId })

    // const { data, status } = await apiClient.post(`/assignments`, assignments)


    console.log(assignments)

  }


}
