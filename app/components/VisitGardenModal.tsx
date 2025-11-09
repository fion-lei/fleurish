import { useState, useMemo, useEffect } from "react";
import { getAllUsers } from "../api/users";

export interface GardenListItem {
  id: string;
  name: string;
  ownerId: string;
  coins?: number;
  gems?: number;
  communityName?: string;
}

interface VisitGardenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisit: (gardenId: string) => void;
}

export function VisitGardenModal({ isOpen, onClose, onVisit }: VisitGardenModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [gardens, setGardens] = useState<GardenListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load gardens when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const loadGardens = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get all users with their garden info, coins, gems, and community
        const users = await getAllUsers();
        console.log("getAllUsers result:", users);

        // Map users to garden list items
        const gardensList = users
          .filter((user) => user.gardenId)
          .map((user) => ({
            id: user.gardenId!,
            name: user.username || "Someone's Garden",
            ownerId: user._id,
            coins: user.coins,
            gems: user.gems,
            communityName: user.communityName,
          }));
        
        console.log("Final gardens list:", gardensList);
        setGardens(gardensList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gardens");
      } finally {
        setIsLoading(false);
      }
    };

    loadGardens();
  }, [isOpen]);

  // Filter gardens based on search term
  const filteredGardens = useMemo(() => {
    if (!searchTerm.trim()) {
      return gardens;
    }

    const lowerQuery = searchTerm.toLowerCase();
    return gardens.filter((garden) => garden.name.toLowerCase().includes(lowerQuery));
  }, [gardens, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-fleur-green text-white p-6">
          <h2 className="text-3xl font-bold">Visit Another Garden</h2>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          <input
            type="text"
            placeholder="Search gardens by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-fleur-green focus:outline-none"
          />
        </div>

        {/* Gardens List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">Loading gardens...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          ) : filteredGardens.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">No gardens found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredGardens.map((garden) => (
                <div
                  key={garden.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{garden.name}</h3>
                    {garden.communityName && (
                      <p className="text-sm text-gray-500">{garden.communityName}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <img
                          src="/images/gem.svg"
                          alt="Gems"
                          className="w-4 h-4"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-600">{garden.gems ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <img
                          src="/images/coin.svg"
                          alt="Coins"
                          className="w-4 h-4"
                          aria-hidden="true"
                        />
                        <span className="text-sm text-gray-600">{garden.coins ?? 0}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onVisit(garden.id);
                      onClose();
                    }}
                    className="ml-4 flex items-center gap-2 text-fleur-green font-semibold hover:text-fleur-green/80 transition-colors"
                  >
                    Visit
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
