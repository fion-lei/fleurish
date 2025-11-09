import { useState } from "react";
import TaskDetails from "~/components/TaskDetails";
import type { Task } from "~/components/TaskList";
import TaskList from "~/components/TaskList";
import { Navbar } from "../components/Navbar";

export function meta() {
  return [{ title: "My Tasks" }];
}

const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Task One",
    description: "This is task one",
    points: 5,
    status: "open",
  },
  {
    id: 2,
    title: "Task Two",
    description: "This is task two",
    points: 3,
    status: "open",
  },
  {
    id: 3,
    title: "Task Three",
    description: "This is task three",
    points: 8,
    status: "open",
  },
  {
    id: 4,
    title: "Task Four",
    description: "This is task four",
    points: 2,
    status: "open",
  },
  {
    id: 5,
    title: "Task Five",
    description: "This is task five",
    points: 7,
    status: "open",
  },
];

export default function MyTasks() {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const selectedTask =
    sampleTasks.find((task) => task.id === selectedTaskId) || null;
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-2xl font-semibold p-4">Request Board</h1>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-[calc(100vh-5rem)]">
          <div className="min-w-lg w-full">
            <Navbar />
            <TaskList
              tasks={sampleTasks}
              selectedTask={selectedTaskId}
              onSelect={setSelectedTaskId}
            />
          </div>

          <div className="min-w-lg w-full">
            <TaskDetails
              task={selectedTask}
              showButton={true}
              buttonLabel="Accept Task"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
