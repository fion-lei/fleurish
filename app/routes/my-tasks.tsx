import { useState, useEffect } from "react";
import TaskDetails from "~/components/TaskDetails";
import TaskList from "~/components/TaskList";
import type { Task } from "~/components/TaskList";
import type { Route } from "./+types/my-tasks";
import { Navbar } from "../components/Navbar";
import { useAuth } from "~/components/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function meta() {
  return [{ title: "My Tasks" }];
}

const statusOrder = { in_progress: 0, completed: 1 };

export default function MyTasks() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (authLoading) {
        return;
      }

      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_BASE_URL}tasks/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        const tasksArray = data.data || [];
        const mappedTasks = tasksArray.map((task: any) => ({
          id: task._id,
          title: task.taskName,
          description: task.taskDescription,
          points: task.taskPoints,
          status: task.status,
        }));

        // Sort tasks: in_progress first, then completed
        const sortedTasks = mappedTasks.sort((a: Task, b: Task) => {
          return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
        });

        setTasks(sortedTasks);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.id, authLoading]);

  const handleCompleteTask = async (taskId: string) => {
    if (!user?.id) return;

    setIsCompleting(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to complete task");
      }

      // Update the task in local state
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)));
    } catch (err) {
      console.error("Error completing task:", err);
      alert(err instanceof Error ? err.message : "Failed to complete task");
    } finally {
      setIsCompleting(false);
    }
  };

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  return (
    <div className="min-h-screen bg-[#FFF9EB]">
      <Navbar />
      <main className="pt-16 px-4 sm:px-6 md:px-8 lg:px-12 container mx-auto max-w-7xl">
        <h1 className="text-xl font-semibold mb-3 ml-4 sm:ml-6">My Tasks</h1>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-red-600">{error}</p>
          </div>
        ) : !user?.id ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-600">Please log in to view your tasks.</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-h-[calc(100vh-140px)]">
              <div className="w-full">
                <TaskList
                  tasks={tasks}
                  selectedTask={selectedTaskId}
                  onSelect={setSelectedTaskId}
                />
              </div>

              <div className="w-full">
                <TaskDetails
                  task={selectedTask}
                  showButton={selectedTask?.status === "in_progress"}
                  buttonLabel="Complete Task"
                  onAccept={handleCompleteTask}
                  isAccepting={isCompleting}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
