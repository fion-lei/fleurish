import { useState } from "react";
import TaskDetails from "~/components/TaskDetails";
import TaskList from "~/components/TaskList";
import type { Task } from "~/components/TaskList";
import type { Route } from "./+types/my-tasks";
import { Navbar } from "../components/Navbar";

export function meta() {
  return [{ title: "My Tasks" }];
}

const sampleTasks: Task[] = [];

export default function MyTasks() {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const selectedTask =
    sampleTasks.find((task) => task.id === selectedTaskId) || null;
  return (
    <main className="pt-20 px-4 sm:px-6 md:px-10 lg:px-16 container mx-auto">
      <h1 className="text-2xl font-semibold mb-4 ml-6 sm:ml-8 md:ml-40">
        Request Board
      </h1>

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
              isCommunity={true}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
