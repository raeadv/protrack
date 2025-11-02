import { Paper, Burger, Divider } from "@mantine/core";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export function Navigation() {
  return <Paper style={{ zIndex: 20 }} className="sticky top-0 left-0 p-2  z-10">
    <div className="flex gap-2 items-center">
      <Burger size='md' />
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/projects" className="[&.active]:font-bold">
        Projects
      </Link>{" "}
      <Link to="/tasks" className="[&.active]:font-bold">
        Tasks
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
    <Divider my='xs' />
  </Paper>

}
