import { useState, useEffect } from "react";
import type { Route } from "./+types/community-tasks";
import TaskDetails from "~/components/TaskDetails";
import TaskList from "~/components/TaskList";
import type { Task } from "~/components/TaskList";
import { Navbar } from "../components/Navbar";
import { useAuth } from "~/components/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusOrder = { new: 0, in_progress: 1, completed: 2 };

export function meta({}: Route.MetaArgs) {
  return [{ title: "Community - Fleurish" }, { name: "description", content: "Community hub" }];
}

interface CommunityMember {
  _id: string;
  username: string;
  coins: number;
  gems: number;
  totalWealth: number;
}

export default function CommunityTasks() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (authLoading) {
        return;
      }

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
        const tasksArray = data.data || [];
        const mappedTasks = tasksArray.map((task: any) => ({
          id: task._id,
          title: task.taskName,
          description: task.taskDescription,
          points: task.taskPoints,
          status: task.status,
        }));

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
  }, [user?.communityId, authLoading]);

  useEffect(() => {
    const fetchCommunityMembers = async () => {
      if (authLoading) {
        return;
      }

      if (!user?.communityId) {
        setMembersLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_BASE_URL}users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = await response.json();
        const usersData = data.data?.users || data.users || data.data || [];

        // Filter users in the same community and fetch their garden names
        const memberPromises = usersData
          .filter((userData: any) => userData.communityId === user.communityId)
          .map(async (userData: any) => {
            const gardenId = userData.gardenId;
            const coins = userData.coins || 0;
            const gems = userData.gems || 0;

            if (!gardenId) return null;

            try {
              const gardenResponse = await fetch(`${API_BASE_URL}gardens/${gardenId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!gardenResponse.ok) return null;

              const gardenData = await gardenResponse.json();
              const garden = gardenData.data || gardenData;

              return {
                _id: userData.userId || userData._id,
                username: garden.gardenName || "Unknown",
                coins,
                gems,
                totalWealth: coins + gems,
              };
            } catch {
              return null;
            }
          });

        const membersList = (await Promise.all(memberPromises)).filter((member): member is CommunityMember => member !== null);

        // Sort by total wealth (coins + gems) descending
        membersList.sort((a, b) => b.totalWealth - a.totalWealth);

        setMembers(membersList);
      } catch (err) {
        console.error("Error fetching community members:", err);
      } finally {
        setMembersLoading(false);
      }
    };

    fetchCommunityMembers();
  }, [user?.communityId, authLoading]);

  const handleAcceptTask = async (taskId: string) => {
    if (!user?.id) {
      console.error("No user ID available");
      return;
    }

    setIsAccepting(true);
    try {
      const token = localStorage.getItem("auth_token");
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to accept task");
      }

      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: "in_progress" } : task)));
      await refreshUser();
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
        <h1 className="text-3xl font-semibold mb-6 ml-4 sm:ml-6">Community</h1>

        {!user?.communityId ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-600">You need to join a community first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks Section - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold ml-4 sm:ml-6">Community Tasks</h2>

              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <p className="text-gray-600">Loading tasks...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-48">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TaskList
                    tasks={tasks}
                    selectedTask={selectedTaskId}
                    onSelect={setSelectedTaskId}
                  />
                  <TaskDetails
                    task={selectedTask}
                    showButton={selectedTask?.status === "new"}
                    buttonLabel="Accept Task"
                    onAccept={handleAcceptTask}
                    isAccepting={isAccepting}
                    isCommunity={true}
                  />
                </div>
              )}
            </div>

            {/* Leaderboard Section - 1/3 width */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">People in your community</h2>

              <div className="bg-white rounded-2xl shadow-soft p-6 max-h-[600px] overflow-y-auto">
                {membersLoading ? (
                  <p className="text-gray-600 text-center">Loading members...</p>
                ) : members.length === 0 ? (
                  <p className="text-gray-600 text-center">No members found</p>
                ) : (
                  <div className="space-y-3">
                    {members.map((member, index) => (
                      <div
                        key={member._id}
                        className={`flex items-center justify-between p-4 rounded-xl ${index === 0 ? "bg-fleur-purple text-white" : index === 1 ? "bg-fleur-green text-white" : index === 2 ? "bg-fleur-apple text-fleur-green" : "bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-semibold min-w-[30px]">#{index + 1}</span>
                          <span className={`font-medium ${member._id === user.id ? "font-bold" : ""}`}>
                            {member.username}
                            {member._id === user.id && " (You)"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <img
                              src="/images/gem.svg"
                              alt="Gems"
                              className="w-5 h-5"
                            />
                            <span className="font-bold">{member.gems}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <img
                              src="/images/coin.svg"
                              alt="Coins"
                              className="w-5 h-5"
                            />
                            <span className="font-bold">{member.coins}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
