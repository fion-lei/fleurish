import type { Task } from "~/components/TaskList";

type TaskDetailsProps = {
  task: Task | null;
  showButton?: boolean;
  buttonLabel?: string;
  onAccept?: (taskId: string) => void;
  isAccepting?: boolean;
  isCommunity?: boolean;
  completed?: boolean;
};

export default function TaskDetails({ task, showButton, buttonLabel, onAccept, isAccepting, isCommunity, completed }: TaskDetailsProps) {
  if (!task) {
    return <div className={`p-3 border rounded-lg shadow text-gray-500 text-sm max-h-[calc(100vh-140px)] ${isCommunity ? "bg-fleur-purple" : "bg-orange-300"}`}>Select a task to view details.</div>;
  }

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
    <div className={`p-3 border rounded-lg shadow h-full flex flex-col max-h-[calc(100vh-140px)] ${isCommunity ? "bg-fleur-purple" : "bg-orange-300"}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{task.title}</h2>
          <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium text-white rounded ${getStatusColor(task.status)}`}>{getStatusLabel(task.status)}</span>
        </div>
        <p className="text-sm font-medium ml-2">{task.points} gems</p>
      </div>

      <p className="text-sm text-gray-700 flex-1">{task.description}</p>

      {showButton && (
        <button
          onClick={() => onAccept?.(task.id)}
          disabled={isAccepting}
          className="mt-3 self-center px-4 py-2 bg-fleur-green text-white text-sm rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAccepting ? "Processing..." : buttonLabel}
        </button>
      )}

      {completed && <p className="mt-auto text-center font-medium text-gray-700">You have completed this task!</p>}
    </div>
  );
}
