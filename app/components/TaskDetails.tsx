import type { Task } from "~/components/TaskList";

type TaskDetailsProps = {
  task: Task | null;
  showButton?: boolean;
  buttonLabel?: string;
};

export default function TaskDetails({
  task,
  showButton,
  buttonLabel,
}: TaskDetailsProps) {
  if (!task) {
    return (
      <div className="p-4 border rounded-lg bg-fleur-purple shadow text-gray-500">
        Select a task to view details.
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-fleur-purple shadow h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{task.title}</h2>
        <p>{task.points} points</p>
      </div>

      <p className="mt-2 text-gray-700">{task.description}</p>

      {showButton && (
        <button className="mt-auto self-center px-4 py-2 bg-fleur-green text-white rounded hover:opacity-90">
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
