import { createTheme, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';

const myColor = [
  '#e6f2ff',
  '#cddfff',
  '#9bbdff',
  '#6498ff',
  '#3879fe',
  '#1c65fe',
  '#0055ff',
  '#004ce4',
  '#0043cd',
  '#0039b5'
];
const theme = createTheme({
  // colors: myColor
});

const queryClient = new QueryClient()

export function AppLayout({ children }) {


  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
