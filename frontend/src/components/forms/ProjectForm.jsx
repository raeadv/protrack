import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { Button, Card, Text, Textarea, TextInput } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useWindowEvent } from '@mantine/hooks'

export function ProjectForm({
  onSubmit = null,
}) {

  const [updateId, setUpdateId] = useState(null)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date()
    },
    validate: {
      title: v => v.length < 2 ? "Minimum Project's title is 3 Chracters" : null

    }
  })

  useWindowEvent("editProject", e => {
    const { project } = e.detail

    form.setValues({
      title: project.Title,
      description: project.Description,
      startDate: project.StartDate.Time,
      endDate: project.EndDate.Time
    })
  })

  return <>

    <Card className='max-w-[500px]' shadow='sm' withBorder padding="lg" radius='md'>
      <form onSubmit={form.onSubmit(values => onSubmit?.(values, updateId))} >
        <TextInput label="Project Title" placeholder='An Awesome Project' key={form.key('title')} {...form.getInputProps('title')} />
        <Textarea label="Project Description" placeholder='An awesome description' key={form.key('description')} {...form.getInputProps('description')} />
        <DateInput label='Start Date' key={form.key('startDate')} {...form.getInputProps('startDate')} />
        <DateInput label='End Date' key={form.key('endDate')} {...form.getInputProps('endDate')} />

        <Button type='submit' color='green' fullWidth mt='md' radius='md' >
          Create Project
        </Button>

      </form>
    </Card>
  </>
}
