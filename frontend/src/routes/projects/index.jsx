import { createFileRoute } from '@tanstack/react-router'
import { apiClient } from '@/utils/client'
import { ProjectForm } from '@/components/forms/ProjectForm'
import dayjs from 'dayjs'
import { ProjectsTable } from '@/components/tables/ProjectsTable'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ArrowDown10 } from 'lucide-react'

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
})

function RouteComponent() {

  const [opened, { open, close }] = useDisclosure(false)
  const queryClient = useQueryClient()

  const submitProject = async (formData) => {

    const { data, status } = await apiClient.post('/projects', {
      ...formData,
      startDate: dayjs(formData.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(formData.endDate).format('YYYY-MM-DD'),
      status: 1
    })


    queryClient.invalidateQueries({ queryKey: ['projects'] })

  }

  const handleEdit = async (id) => {

    const { data, status } = await apiClient("/projects/" + id)

    if (status === 200) {
      open()
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("editProject", {
            detail: {
              project: data.project,
              id: data.project.ID
            }
          })
        )
      }, 100)

    }

  }

  const handleDelete = async (id) => {
    let confirmation = confirm("delete?")
    if (confirmation) {
      console.log("delete this", id)
    }

    const { status } = await apiClient.delete('/projects/' + id)
    if (status === 200) {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    }


  }

  return <>

    <h4>Your Projects</h4>
    <div>
      <Button variant='filled' onClick={() => open()}>New Project</Button>
    </div>

    <Modal title="Project Form" opened={opened} onClose={close}>
      <ProjectForm onSubmit={(values, updateId) => {
        console.log("project form submitted", { values, updateId })
        submitProject(values)
      }} />
    </Modal>

    <ProjectsTable
      onEdit={handleEdit}
      onDelete={handleDelete}
    />

  </>
}
