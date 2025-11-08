import { ProjectAssigmentForm } from '@/components/forms/project/ProjectAssigmentForm'
import { TaskForm } from '@/components/forms/tasks/TaskForm'
import { apiClient } from '@/utils/client'
import { Box, Card, LoadingOverlay, Text, Group, TextInput, Button } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useBoolean, useMount } from 'react-use'

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  const [loading, toggle] = useBoolean(false)
  const { projectId } = Route.useParams()
  const [project, setProject] = useSetState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date()
  })


  const getProjectData = async () => {
    toggle(true)
    const { data, status } = await apiClient.get("/projects/" + projectId)
    const { project } = data

    setProject({
      title: project.Title,
      description: project.Description.String,
      startDate: project.StartDate.Time,
      endDate: project.EndDate.Time,
      status: project.Status
    })

    setTimeout(() => toggle(false), 1000)
  }

  useMount(() => {
    getProjectData()
  })

  return <div>

    <Box pos="relative" className='min-w-[100%] min-h-[60px]'>
      <Card title='Project Information' pos="relative" withBorder shadow='md' className='rounded-md'>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <Text className='text-center uppercase' fw={800}>{project.title}</Text>
        <Group justify='space-between' mt="md" mb="md">
          <Text><span className='font-semibold'>Start :</span> {dayjs(project.startDate).format("DD/MM/YYYY")}</Text>
          <Text><span className='font-semibold'>End :</span> {dayjs(project.endDate).format("DD/MM/YYYY")}</Text>
        </Group>
        <Text className='text-left' fw={600}>Description :</Text>
        <Text className='text-justify' fw={400}>{project.description}</Text>
      </Card>

      <ProjectAssigmentForm
        projectId={projectId}
      />

      <TaskForm projectId={projectId} />


    </Box>
  </div>


}
