import React from 'react';
import dayjs from 'dayjs'
import { apiClient } from '@/utils/client'
import { LoadingOverlay, Table, Box, Button } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { TrashIcon, PencilIcon, CheckSquare2Icon } from 'lucide-react'
import { Link } from '@tanstack/react-router';

export function ProjectsTable({ onDelete = null, onEdit = null }) {

  const getProjects = async () => {

    const res = await apiClient.get('/projects', {
      params: {
        Limit: 10,
        Offset: 0
      }
    })

    // console.log(res)

    return res.data.projects
  }

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  const rows = data?.map((d) => (
    <Table.Tr key={d.ID}>
      <Table.Td>{d.Title}</Table.Td>
      <Table.Td>{d.Description.String}</Table.Td>
      <Table.Td>{dayjs(d.StartDate?.Time).format('DD-MM-YYYY')}</Table.Td>
      <Table.Td>{dayjs(d.EndDate?.Time).format('DD-MM-YYYY')}</Table.Td>
      <Table.Td>
        <Link to={`/projects/${d.ID}`}>
          <Button variant='filled' color='gray' size='compact-sm' onClick={() => onEdit?.(d.ID)}><CheckSquare2Icon className='size-4 shrink-0' /></Button>
        </Link>
      </Table.Td>
      <Table.Td>
        <Button variant='filled' color='yellow' size='compact-sm' onClick={() => onEdit?.(d.ID)}><PencilIcon className='size-4 shrink-0' /></Button>
      </Table.Td>
      <Table.Td>
        <Button variant='filled' color='red' size='compact-sm' onClick={() => onDelete?.(d.ID)} ><TrashIcon className='size-4 shrink-0' /></Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box pos="relative" className="card">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ children: 'Loading...' }} />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Start Date</Table.Th>
            <Table.Th>End Date</Table.Th>
            <Table.Th>Details</Table.Th>
            <Table.Th>Edit</Table.Th>
            <Table.Th>Delete</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data && data.length > 0 && rows}
        </Table.Tbody>
      </Table>
    </Box>
  );
}

