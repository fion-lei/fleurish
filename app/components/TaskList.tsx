import React from "react";
import { useState } from "react";

export type Task = {
  id: string;
  title: string;
  description: string;
  points: number;
  status: string;
};

type TaskListProps = {
  tasks: Task[];
  selectedTask: string | null;
  onSelect?: (id: string) => void;
};

export default function TaskList({ tasks, selectedTask, onSelect }: TaskListProps) {
  //   const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "in_progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "New";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="p-3 border rounded-lg bg-fleur-melon shadow h-full flex flex-col max-h-[calc(100vh-140px)]">
      <h2 className="text-lg font-semibold mb-3">Task Board</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet.</p>
      ) : (
        <div className="overflow-y-auto flex-1 pr-1 max-h-[60vh]">
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                onClick={() => onSelect?.(task.id)}
                className={`p-2.5 border rounded-md shadow-sm cursor-pointer transition-colors
                ${selectedTask === task.id ? "bg-fleur-green" : "bg-fleur-melon"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm flex-1">{task.title}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium text-white rounded whitespace-nowrap ${getStatusColor(task.status)}`}>{getStatusLabel(task.status)}</span>
                </div>
                {/* <p className="text-sm text-gray-600">{task.description}</p> */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
