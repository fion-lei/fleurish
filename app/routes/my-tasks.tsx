import type { Route } from "./+types/community-tasks";
import { Navbar } from "../components/Navbar";
import { useState } from "react";
import TaskDetails from "~/components/TaskDetails";
import TaskList from "~/components/TaskList";
import type { Task } from "~/components/TaskList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Community Tasks - Fleurish" },
    { name: "description", content: "Community tasks" },
  ];
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
    status: "closed",
  },
  {
    id: 5,
    title: "Task Five",
    description: "This is task five",
    points: 7,
    status: "closed",
  },
  {
    id: 6,
    title: "Task Six",
    description: "This is task six",
    points: 4,
    status: "open",
  },
  {
    id: 7,
    title: "Task Seven",
    description: "This is task seven",
    points: 6,
    status: "closed",
  },
  {
    id: 8,
    title: "Task Eight",
    description: "This is task eight",
    points: 9,
    status: "open",
  },
];

export default function CommunityTasks() {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<"Ongoing" | "Completed">(
    "Ongoing"
  );

  const selectedTask =
    sampleTasks.find((task) => task.id === selectedTaskId) || null;
  return (
    <main className="pt-20 px-4 sm:px-6 md:px-10 lg:px-16 container mx-auto">
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4 ml-6 sm:ml-8 md:ml-40">
          My Tasks
        </h1>

        <div className="flex w-full sm:w-auto justify-center sm:justify-end pr-4">
          <div className="inline-flex shadow rounded overflow-hidden">
            <button
              onClick={() => setSelectedBoard("Ongoing")}
              className={`px-4 py-2 text-sm sm:text-base ${
                selectedBoard === "Ongoing"
                  ? "bg-sky-700"
                  : "bg-sky-600 hover:opacity-90"
              } text-white hover:cursor-pointer`}
            >
              Ongoing
            </button>

            <button
              onClick={() => setSelectedBoard("Completed")}
              className={`px-4 py-2 text-sm sm:text-base ${
                selectedBoard === "Completed"
                  ? "bg-sky-700"
                  : "bg-sky-600 hover:opacity-90"
              } text-white hover:cursor-pointer`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

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
              showButton={selectedBoard === "Ongoing"}
              buttonLabel="Complete Task"
              isCommunity={false}
              completed={selectedBoard === "Completed"}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
