import { useState, useEffect } from "react";
import type { Route } from "./+types/leaderboard";
import { Navbar } from "../components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leaderboard - Fleurish" },
    { name: "description", content: "Leaderboard" },
  ];
}

interface Community {
  _id: string;
  communityName: string;
  communityPoints: number;
  rank: number;
}

interface LeaderboardData {
  topCommunities: Community[];
  userCommunityRank: Community | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Please log in to view the leaderboard");
          setLoading(false);
          return;
        }

        // Construct the full path
        console.log('API_BASE_URL:', API_BASE_URL);
        console.log('Full URL:', `${API_BASE_URL}community/leaderboard/combined`);
        
        const response = await fetch(`${API_BASE_URL}community/leaderboard/combined`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.log('Error data:', errorData);
          throw new Error(errorData.message || "Failed to fetch leaderboard data");
        }

        const data = await response.json();
        console.log('Leaderboard data:', data);
        // Extract the nested data object
        setLeaderboardData(data.data || data);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        setError(err instanceof Error ? err.message : "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9EB]">
        <Navbar />
        <main className="pt-[73.6px] p-8 flex flex-col items-center">
          <h1 className="text-4xl font-semibold text-black mb-8 mt-8 text-center">
            Top Communities
          </h1>
          <p className="text-gray-600">Loading...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF9EB]">
        <Navbar />
        <main className="pt-[73.6px] p-8 flex flex-col items-center">
          <h1 className="text-4xl font-semibold text-black mb-8 mt-8 text-center">
            Top Communities
          </h1>
          <p className="text-red-600">{error}</p>
        </main>
      </div>
    );
  }

  const topCommunities = leaderboardData?.topCommunities || [];
  const userCommunity = leaderboardData?.userCommunityRank;
  
  // Get first place community
  const firstPlace = topCommunities[0];
  
  // Get 2nd-4th place communities
  const secondToFourth = topCommunities.slice(1, 4);

  return (
    <div className="min-h-screen bg-[#FFF9EB]">
      <Navbar />
      <main className="pt-[73.6px] p-8 flex flex-col items-center">
        {/* Page Title */}
        <h1 className="text-4xl font-semibold text-black mb-8 mt-8 text-center">
          Top Communities
        </h1>

        {/* Leaderboard Container */}
        <div className="w-full max-w-4xl">
          {/* #1 Community */}
          {firstPlace && (
            <div className="flex items-center bg-fleur-purple text-white text-xl font-semibold py-5 px-8 rounded-2xl shadow-soft mb-6">
              <div className="flex items-center gap-3 w-24">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>#1</span>
              </div>
              <span className="flex-1">{firstPlace.communityName}</span>
              <span className="bg-white text-fleur-purple px-4 py-1 rounded-lg font-bold min-w-[80px] text-center">{firstPlace.communityPoints}</span>
            </div>
          )}

          {/* Green Container for #2-4 and User Community */}
          <div className="bg-[#D4E8C1] rounded-3xl p-6 space-y-3">
            {/* #2-4 Communities - always show these 3 in light green */}
            {secondToFourth.map((community) => (
              <div
                key={community._id}
                className="flex items-center bg-fleur-apple text-fleur-green text-lg font-medium py-5 px-8 rounded-2xl shadow-soft"
              >
                <span className="w-12">#{community.rank}</span>
                <span className="flex-1">{community.communityName}</span>
                <span className="bg-white text-fleur-green px-4 py-1 rounded-lg font-bold min-w-[80px] text-center">{community.communityPoints}</span>
              </div>
            ))}

            {/* Your Community - show in dark green if not #1 */}
            {userCommunity && userCommunity.rank !== 1 && (
              <div className="flex items-center bg-fleur-green text-white text-lg font-semibold py-5 px-8 rounded-2xl shadow-soft">
                <span className="w-12">#{userCommunity.rank}</span>
                <span className="flex-1">{userCommunity.communityName}</span>
                <span className="bg-white text-fleur-green px-4 py-1 rounded-lg font-bold min-w-[80px] text-center">{userCommunity.communityPoints}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
