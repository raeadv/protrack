import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'
import { Button, Card, Radio, Text, Textarea, TextInput } from '@mantine/core'
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
      endDate: new Date(),
      status: 0
    },
    validate: {
      title: v => v.length < 2 ? "Minimum Project's title is 3 Chracters" : null

    }
  })

  useWindowEvent("editProject", e => {
    const { project } = e.detail

    form.setValues({
      title: project.Title,
      description: project.Description.String,
      startDate: project.StartDate.Time,
      endDate: project.EndDate.Time,
      status: project.Status
    })

    setUpdateId(project.ID)
  })

  useWindowEvent('resetProjectForm', _ => {
    form.reset()
    setUpdateId(null)
  })


  const handleSubmitData = (values) => {
    onSubmit?.(values, updateId)
    setUpdateId(null)
  }

  return <>

    <Card className='max-w-[500px]' shadow='sm' withBorder padding="lg" radius='md'>
      <form onSubmit={form.onSubmit(values => handleSubmitData(values))} >
        <TextInput label="Project Title" placeholder='An Awesome Project' key={form.key('title')} {...form.getInputProps('title')} />
        <Textarea label="Project Description" placeholder='An awesome description' key={form.key('description')} {...form.getInputProps('description')} />
        <DateInput label='Start Date' key={form.key('startDate')} {...form.getInputProps('startDate')} />
        <DateInput label='End Date' key={form.key('endDate')} {...form.getInputProps('endDate')} />

        <Radio.Group
          label="Project Status"
          key={form.key('status')}
          value={String(form.getValues().status)}
          onChange={stat => form.setValues({ status: stat })}
          {...form.getInputProps('status')}
        >
          <Radio value="2" label="Inactive" />
          <Radio value="1" label="Active" />
          <Radio value="99" label="Cancelled" />
        </Radio.Group>


        <Button type='submit' color='green' fullWidth mt='md' radius='md' >
          {
            updateId ? 'Save Changes' : 'Create project'
          }
        </Button>

      </form>
    </Card>
  </>
}
