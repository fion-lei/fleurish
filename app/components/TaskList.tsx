import React from "react";
import { useState } from "react";

export type Task = {
  id: number;
  title: string;
  description: string;
  points: number;
  status: string;
};

type TaskListProps = {
  tasks: Task[];
  selectedTask: number | null;
  onSelect?: (id: number) => void;
};

export default function TaskList({
  tasks,
  selectedTask,
  onSelect,
}: TaskListProps) {
  //   const [selectedTask, setSelectedTask] = useState<number | null>(null);

  return (
    <div className="p-4 border rounded-lg bg-fleur-melon shadow h-full flex flex-col max-h-[80vh]">
      <h2 className="text-xl font-semibold mb-4">Task Board</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet.</p>
      ) : (
        <div className="overflow-y-auto flex-1 pr-1 max-h-[60vh]">
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                onClick={() => onSelect(task.id)}
                className={`p-3 border rounded-md shadow-sm hover:cursor-pointer
                ${selectedTask === task.id ? "bg-fleur-green" : "bg-fleur-melon hover:border-fleur-green hover:text-fleur-green"}`}
              >
                <span className="font-medium">{task.title}</span>
                {/* <p className="text-sm text-gray-600">{task.description}</p> */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
