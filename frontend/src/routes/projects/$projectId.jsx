import { apiClient } from '@/utils/client'
import { useSetState } from '@mantine/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { useMount } from 'react-use'

export const Route = createFileRoute('/projects/$projectId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  const [project, setProject] = useSetState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date()
  })

  const getProjectData = async () => {
    const { data, status } = await apiClient.get("/projects/" + projectId)

    console.log({ data, status })

    const { project } = data

    setProject({
      title: project.Title,
      description: project.Description,
      startDate: project.StartDate.Time,
      endDate: project.EndDate.Time
    })

  }


  useMount(() => {
    getProjectData()
  })



  return <div>
    <div>Hello "/projects/$projectId"! id: {projectId}</div>

    <div>{JSON.stringify(project)}
    </div>
  </div>
}
