import { useState, useEffect } from "react";
import type { Route } from "./+types/community-tasks";
import { Navbar } from "../components/Navbar";
import TaskList from "~/components/TaskList";
import TaskDetails from "~/components/TaskDetails";
import type { Task } from "~/components/TaskList";
import { useAuth } from "~/components/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Community Tasks - Fleurish" }, { name: "description", content: "Community tasks" }];
}

export default function CommunityTasks() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      // Wait for auth to complete
      if (authLoading) {
        return;
      }

      console.log("User object:", user);
      console.log("Community ID:", user?.communityId);

      if (!user?.communityId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_BASE_URL}tasks/community/${user.communityId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        console.log("Fetched tasks:", data);
        // Handle nested response structure and map backend fields to frontend Task interface
        const tasksArray = data.data || [];
        const mappedTasks = tasksArray.map((task: any) => ({
          id: task._id,
          title: task.taskName,
          description: task.taskDescription,
          points: task.taskPoints,
          status: task.status,
        }));
        setTasks(mappedTasks);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.communityId, authLoading]);

  const handleAcceptTask = async (taskId: string) => {
    console.log("Accept task clicked, taskId:", taskId);
    console.log("User:", user);
    console.log("User ID:", user?.id);

    if (!user?.id) {
      console.error("No user ID available");
      return;
    }

    setIsAccepting(true);
    try {
      const token = localStorage.getItem("auth_token");
      console.log("Making PUT request to:", `${API_BASE_URL}tasks/${taskId}`);

      const response = await fetch(`${API_BASE_URL}tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "in_progress",
          completedUserId: user.id,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Failed to accept task");
      }

      const result = await response.json();
      console.log("Task accepted successfully:", result);

      // Update the task in local state
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: "in_progress" } : task)));
    } catch (err) {
      console.error("Error accepting task:", err);
      alert(err instanceof Error ? err.message : "Failed to accept task");
    } finally {
      setIsAccepting(false);
    }
  };

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  return (
    <div className="min-h-screen bg-[#FFF9EB]">
      <Navbar />
      <main className="pt-16 px-4 sm:px-6 md:px-8 lg:px-12 container mx-auto max-w-7xl">
        <h1 className="text-xl font-semibold mb-3 ml-4 sm:ml-6">Community Tasks</h1>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-red-600">{error}</p>
          </div>
        ) : !user?.communityId ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-600">You need to join a community first.</p>
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
                  showButton={true}
                  buttonLabel="Accept Task"
                  onAccept={handleAcceptTask}
                  isAccepting={isAccepting}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
