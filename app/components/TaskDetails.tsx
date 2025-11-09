import type { Task } from "~/components/TaskList";

type TaskDetailsProps = {
  task: Task | null;
  showButton?: boolean;
  buttonLabel?: string;
  isCommunity?: boolean;
  completed?: boolean;
};

export default function TaskDetails({
  task,
  showButton,
  buttonLabel,
  isCommunity,
  completed,
}: TaskDetailsProps) {
  if (!task) {
    return (
      <div
        className={`p-4 border rounded-l shadow text-gray-500 ${isCommunity ? "bg-fleur-purple" : "bg-orange-300"}`}
      >
        Select a task to view details.
      </div>
    );
  }

  return (
    <div
      className={`p-4 border rounded-lg shadow h-full flex flex-col max-h-[80vh] ${isCommunity ? "bg-fleur-purple" : "bg-orange-300"}`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{task.title}</h2>
        <p>{task.points} points</p>
      </div>

      <p className="mt-2 text-gray-700">{task.description}</p>

      {showButton && (
        <button
          className="mt-auto self-center px-4 py-2 bg-fleur-green text-white rounded hover:opacity-90 hover:cursor-pointer"
          onClick={() => {
            // Placeholder for button action
          }}
        >
          {buttonLabel}
        </button>
      )}

      {completed && (
        <p className="mt-auto text-center font-medium text-gray-700">
          You have completed this task!
        </p>
      )}
    </div>
  );
}
