import { useEffect, useRef, useState } from "react";
import { fetchGardenById, updateGardenName, fetchGardenName } from "../api/gardens";
import { GardenFooter } from "../components/GardenFooter";
import { GardenGrid, createInitialGarden, type GardenCell, type PlantType } from "../components/GardenGrid";
import { InventoryPanel } from "../components/InventoryPanel";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../components/AuthContext";
import { VisitGardenModal } from "../components/VisitGardenModal";
import type { Route } from "./+types/garden";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function createGardenFromPlots(plots: any[]): GardenCell[][] {
  const baseGarden = createInitialGarden();

  // Map to store plot positions
  const plotMap = new Map<string, any>();
  plots.forEach((plot) => {
    const key = `${plot.row},${plot.column}`;
    plotMap.set(key, plot);
  });

  const centerRow = 2;
  const centerCol = 2;

  // Update garden with plots
  for (let row = -2; row <= 2; row++) {
    for (let col = -2; col <= 2; col++) {
      const key = `${row},${col}`;
      const plot = plotMap.get(key);

      const arrayRow = centerRow - row;
      const arrayCol = centerCol + col;

      if (plot && arrayRow >= 0 && arrayRow < 5 && arrayCol >= 0 && arrayCol < 5) {
        // This plot exists, make it dirt
        baseGarden[arrayRow][arrayCol].terrain = "dirt";

        // Add plant if it exists
        if (plot.plant) {
          // Fetch plant data and set it
          // For now, we'll need to handle this separately
          baseGarden[arrayRow][arrayCol].plant = null; // Will be populated by separate plant fetch
        }
      }
    }
  }

  return baseGarden;
}

export function meta({}: Route.MetaArgs) {
  return [{ title: "Garden - Fleurish" }, { name: "description", content: "Your garden" }];
}

export default function Garden() {
  const [gardenName, setGardenName] = useState("");
  const [showNamePlaceholder, setShowNamePlaceholder] = useState(false);
  const [gardenId, setGardenId] = useState<string | null>(null);
  const [hasUnsavedNameChanges, setHasUnsavedNameChanges] = useState(false);
  const [nameSaveStatus, setNameSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const { user, refreshUser } = useAuth();
  const [garden, setGarden] = useState<GardenCell[][]>(createInitialGarden());
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [userGardenId, setUserGardenId] = useState<string | null>(null);
  const [selectedLand, setSelectedLand] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [purchasedPlants, setPurchasedPlants] = useState<Partial<Record<PlantType, number>>>({});
  const [harvestedPlants, setHarvestedPlants] = useState<Partial<Record<PlantType, number>>>({});
  const [selectedHarvestedPlant, setSelectedHarvestedPlant] = useState<PlantType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisiting, setIsVisiting] = useState(false);
  const [visitingGardenName, setVisitingGardenName] = useState("");
  const [isLoadingGarden, setIsLoadingGarden] = useState(false);
  const [plantPrices, setPlantPrices] = useState<Partial<Record<PlantType, number>>>({});
  const [plantTypeIds, setPlantTypeIds] = useState<Partial<Record<PlantType, string>>>({});
  const landPrice = 5; // Price in gems to buy land
  const harvestPrice = 60; // Price in coins when selling harvested plants

  // User's community affiliations - easily replaceable with backend user data
  const userCommunities = ["Downtown Gardeners", "Organic Growers"];

  const gardenNameInputRef = useRef<HTMLInputElement>(null);

  // Fetch plant types from API
  useEffect(() => {
    const fetchPlantTypes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}plant-types`);
        if (response.ok) {
          const result = await response.json();
          const plants = result.data || [];
          const prices: Partial<Record<PlantType, number>> = {};
          const typeIds: Partial<Record<PlantType, string>> = {};
          const initialPurchased: Partial<Record<PlantType, number>> = {};
          const initialHarvested: Partial<Record<PlantType, number>> = {};

          plants.forEach((plant: any) => {
            const plantType = plant.plantName.toLowerCase() as PlantType;
            prices[plantType] = plant.price;
            typeIds[plantType] = plant.plantTypeMongoId;
            initialPurchased[plantType] = 0;
            initialHarvested[plantType] = 0;
          });

          setPlantPrices(prices);
          setPlantTypeIds(typeIds);
          setPurchasedPlants(initialPurchased);
          setHarvestedPlants(initialHarvested);
        }
      } catch (error) {
        console.error("Failed to fetch plant types:", error);
      }
    };

    fetchPlantTypes();
  }, []);

  // Fetch user's garden and plots
  useEffect(() => {
    const fetchUserGarden = async () => {
      if (!user?.gardenId) return;

      const gardenId = typeof user.gardenId === "string" ? user.gardenId : (user.gardenId as any)?._id || (user.gardenId as any)?.gardenMongoId;

      if (!gardenId) return;

      try {
        const token = localStorage.getItem("auth_token");

        // Fetch user's garden directly by gardenId
        const gardenResponse = await fetch(`${API_BASE_URL}gardens/${gardenId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (gardenResponse.ok) {
          const gardenResult = await gardenResponse.json();
          const userGarden = gardenResult.data;

          if (userGarden) {
            setUserGardenId(userGarden.gardenMongoId || gardenId);

            // Use plots array from garden data
            const plots = userGarden.plots || [];

            // Convert plots to garden grid
            const newGarden = createGardenFromPlots(plots);
            setGarden(newGarden);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user garden:", error);
      }
    };

    fetchUserGarden();
  }, [user?.gardenId]);

  // Helper to refetch garden data
  const refetchGarden = async () => {
    if (!user?.gardenId || !userGardenId) return;

    try {
      const token = localStorage.getItem("auth_token");
      const gardenResponse = await fetch(`${API_BASE_URL}gardens/${userGardenId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (gardenResponse.ok) {
        const gardenResult = await gardenResponse.json();
        const userGarden = gardenResult.data;
        const plots = userGarden?.plots || [];
        const newGarden = createGardenFromPlots(plots);
        setGarden(newGarden);
      }
    } catch (error) {
      console.error("Failed to refetch garden:", error);
    }
  };

  // Fetch user's inventory
  const fetchUserInventory = async () => {
    if (!user?.id) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_BASE_URL}plants?userId=${user.id}&isPlanted=false`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const plants = result.data || [];

        const purchased: Partial<Record<PlantType, number>> = {};
        const harvested: Partial<Record<PlantType, number>> = {};

        plants.forEach((plant: any) => {
          const plantType = plant.plantType?.plantName?.toLowerCase() as PlantType;
          if (plantType) {
            if (plant.growth === 0) {
              purchased[plantType] = (purchased[plantType] || 0) + 1;
            } else if (plant.growth === 2) {
              harvested[plantType] = (harvested[plantType] || 0) + 1;
            }
          }
        });

        setPurchasedPlants(purchased);
        setHarvestedPlants(harvested);
      }
    } catch (error) {
      console.error("Failed to fetch user inventory:", error);
    }
  };

  useEffect(() => {
    if (user?.id && Object.keys(plantPrices).length > 0) {
      fetchUserInventory();
    }
  }, [user?.id, plantPrices]);

  const handleCellClick = (row: number, col: number) => {
    const cell = garden[row][col];

    // If there's a selected plant and the cell is dirt with no plant, plant it
    if (selectedPlant && cell.terrain === "dirt" && !cell.plant && (purchasedPlants[selectedPlant] ?? 0) > 0) {
      const newGarden = garden.map((r) => [...r]);
      newGarden[row][col] = {
        ...cell,
        plant: {
          type: selectedPlant,
          stage: 0, // Start as seedling
        },
      };
      setGarden(newGarden);
      setPurchasedPlants((prev) => ({
        ...prev,
        [selectedPlant]: (prev[selectedPlant] ?? 0) - 1,
      }));
      setSelectedPlant(null); // Deselect after planting
    }
    // If there's a mature plant (stage 2), harvest it
    else if (cell.plant && cell.plant.stage === 2) {
      const newGarden = garden.map((r) => [...r]);
      newGarden[row][col] = {
        ...cell,
        plant: null,
      };
      setGarden(newGarden);
      // TODO: Update user's coins in backend when harvesting
    }
  };

  const handleBackpackClick = () => {
    setIsInventoryOpen(!isInventoryOpen);
    if (isInventoryOpen) {
      setSelectedPlant(null); // Deselect when closing inventory
      setSelectedLand(false); // Deselect land when closing inventory
    }
  };

  const handleCommunityClick = () => {
    setIsModalOpen(true);
  };

  const handleVisitGarden = async (gardenId: string) => {
    setIsLoadingGarden(true);
    try {
      const gardenData = await fetchGardenById(gardenId);
      setGarden(gardenData.layout);
      setVisitingGardenName(gardenData.name);
      setIsVisiting(true);
      setIsInventoryOpen(false);
      setGardenId(gardenData.id);
    } catch (error) {
      console.error("Failed to load garden:", error);
      alert("Failed to load garden. Please try again.");
    } finally {
      setIsLoadingGarden(false);
    }
  };

  const handleReturnHome = () => {
    setIsVisiting(false);
    setVisitingGardenName("");
    // Reset garden to user's own initial garden
    setGarden(createInitialGarden());
  };

  const handleSelectLand = () => {
    // Toggle land selection - user must click land in shop to select it
    const userGems = user?.gems ?? 0;
    if (userGems >= landPrice) {
      setSelectedLand(!selectedLand);
      setSelectedPlant(null); // Deselect plant when selecting land
    }
  };

  const handleBuyPlant = async (plantType: PlantType) => {
    const price = plantPrices[plantType];
    const plantTypeId = plantTypeIds[plantType];
    const userCoins = user?.coins ?? 0;
    if (price && plantTypeId && userCoins >= price && user?.id) {
      try {
        const token = localStorage.getItem("auth_token");

        // Remove coins
        const coinsResponse = await fetch(`${API_BASE_URL}users/coins/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            amount: price,
          }),
        });

        if (coinsResponse.ok) {
          // Create plant in inventory
          const plantResponse = await fetch(`${API_BASE_URL}plants`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              growth: 0,
              plantTypeId: plantTypeId,
              userId: user.id,
              isPlanted: false,
            }),
          });

          if (plantResponse.ok) {
            await refreshUser();
            await fetchUserInventory();
          }
        }
      } catch (error) {
        console.error("Failed to buy plant:", error);
      }
    }
  };

  const handleHarvestPlant = (row: number, col: number) => {
    const cell = garden[row][col];
    if (cell.plant && cell.plant.stage === 2) {
      // Add to harvested plants
      setHarvestedPlants((prev) => ({
        ...prev,
        [cell.plant!.type]: (prev[cell.plant!.type] || 0) + 1,
      }));

      // Remove from garden
      const newGarden = garden.map((r) => [...r]);
      newGarden[row][col] = {
        ...cell,
        plant: null,
      };
      setGarden(newGarden);
    }
  };

  const handleSellPlant = async (plantType: PlantType) => {
    if ((harvestedPlants[plantType] ?? 0) > 0 && user?.id) {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_BASE_URL}users/coins/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            amount: harvestPrice,
          }),
        });

        if (response.ok) {
          setHarvestedPlants((prev) => ({
            ...prev,
            [plantType]: (prev[plantType] ?? 0) - 1,
          }));
          if (selectedHarvestedPlant === plantType && harvestedPlants[plantType] === 1) {
            setSelectedHarvestedPlant(null);
          }
          await refreshUser();
        }
      } catch (error) {
        console.error("Failed to sell plant:", error);
      }
    }
  };

  const handleEditIconClick = () => {
    setIsEditingName(true);
  };

  const handleSaveGardenName = async () => {
    if (!gardenId) return;
    if (!gardenName.trim()) return;
    if (!hasUnsavedNameChanges) return;

    if (gardenId && gardenName.trim() && hasUnsavedNameChanges) {
      setNameSaveStatus("saving");
      try {
        const updated = await updateGardenName(gardenId, gardenName.trim());
        setGardenName(updated);
        setHasUnsavedNameChanges(false);
        setNameSaveStatus("saved");
      } catch (error) {
        console.error("Failed to update garden name:", error);
        setNameSaveStatus("error");
      }
    }
  };

  const handleGardenNameBlur = async () => {
    setIsEditingName(false);
  };

  const handleGardenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVisiting) {
      setGardenName(e.target.value);
      setHasUnsavedNameChanges(true);
      setNameSaveStatus("idle");
    }
  };

  useEffect(() => {
    if (isEditingName && gardenNameInputRef.current) {
      gardenNameInputRef.current.focus();
      gardenNameInputRef.current.select();
    }
  }, [isEditingName]);

  // Set gardenId from /users/me (AuthContext) when available
  useEffect(() => {
    if (!isVisiting) {
      if (user?.gardenId) {
        setGardenId(user.gardenId);
      }
    }
  }, [user, isVisiting]);

  // Delay showing input placeholder for a couple seconds so it stays empty first
  useEffect(() => {
    const timer = setTimeout(() => setShowNamePlaceholder(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Once we have a gardenId, fetch its current gardenName and populate input
  useEffect(() => {
    const loadGardenName = async () => {
      if (gardenId && !isVisiting) {
        try {
          const name = await fetchGardenName(gardenId);
          if (name) {
            setGardenName(name);
            setHasUnsavedNameChanges(false);
            setNameSaveStatus("saved");
          }
        } catch (e) {
          // ignore fetch error for name
        }
      }
    };
    loadGardenName();
  }, [gardenId, isVisiting]);

  const handleBuyDirt = async (row: number, col: number) => {
    const cell = garden[row][col];
    const userGems = user?.gems ?? 0;

    // Only allow buying dirt on MM_grass cells when land is selected
    if (cell.terrain === "MM_grass" && selectedLand && userGems >= landPrice && user?.id && userGardenId) {
      try {
        const token = localStorage.getItem("auth_token");

        // Convert array indices to center-based coordinates
        // Center is at index (2,2)
        const centerRow = 2;
        const centerCol = 2;
        const plotRow = centerRow - row;
        const plotCol = col - centerCol;

        console.log(`Buying dirt at array [${row},${col}] -> database coords (${plotRow},${plotCol})`);

        // Remove gems
        const gemsResponse = await fetch(`${API_BASE_URL}users/gems/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            amount: landPrice,
          }),
        });

        if (gemsResponse.ok) {
          // Create plot in database using the createPlot endpoint
          const plotResponse = await fetch(`${API_BASE_URL}plots/createPlot`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              row: plotRow,
              column: plotCol,
              plantId: null,
              gardenId: userGardenId,
            }),
          });

          if (plotResponse.ok) {
            setSelectedLand(false); // Deselect after placing land
            await refreshUser();
            await refetchGarden(); // Refetch garden to get updated plots
          }
        }
      } catch (error) {
        console.error("Failed to buy dirt:", error);
      }
    }
  };

  return (
    <div className="h-screen bg-[#FFF9EB] flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 pt-[73.6px] pb-20 px-4 sm:px-6 lg:px-8 flex flex-col overflow-hidden">
        <div className="pt-6 pb-4 flex items-center justify-center gap-2">
          <input
            ref={gardenNameInputRef}
            type="text"
            value={isVisiting ? visitingGardenName : gardenName}
            onChange={handleGardenNameChange}
            onBlur={handleGardenNameBlur}
            disabled={isVisiting}
            className={`text-2xl md:text-3xl font-bold text-black text-center bg-transparent border-2 rounded-lg outline-none focus:outline-none focus:ring-2 focus:ring-fleur-green/30 pb-2 px-4 py-2 transition-all duration-200 ${
              isVisiting
                ? "border-dashed border-gray-300 cursor-not-allowed"
                : nameSaveStatus === "saved"
                ? "border-solid border-fleur-green bg-fleur-green/10"
                : nameSaveStatus === "saving"
                ? "border-solid border-yellow-400 animate-pulse"
                : nameSaveStatus === "error"
                ? "border-solid border-red-500"
                : hasUnsavedNameChanges
                ? "border-solid border-yellow-500"
                : isEditingName
                ? "border-fleur-green border-solid focus:border-fleur-green/70"
                : "border-dashed border-fleur-green/40 hover:border-fleur-green/60"
            }`}
            placeholder={showNamePlaceholder ? "Click to edit garden name" : ""}
          />
          {!isVisiting && hasUnsavedNameChanges && (
            <button
              onClick={handleSaveGardenName}
              disabled={nameSaveStatus === "saving"}
              className="px-4 py-2 bg-fleur-green text-white font-semibold rounded-lg hover:bg-fleur-green/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {nameSaveStatus === "saving" ? "Saving..." : "Save"}
            </button>
          )}
          {!isVisiting && !hasUnsavedNameChanges && (
            <button
              onClick={handleEditIconClick}
              className="p-1 text-fleur-green/70 hover:text-fleur-green transition-colors"
              aria-label="Edit garden name"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
        </div>

        
        {/* Selected plant indicator */}
        {selectedPlant && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-fleur-green/20 rounded-full border border-fleur-green/30">
              <img
                src="/sprites/plants/seedling.png"
                alt={selectedPlant}
                className="w-5 h-5 object-contain pixelated"
              />
              <span className="text-sm font-semibold text-gray-700 capitalize">Selected: {selectedPlant} - Click on dirt to plant</span>
            </span>
          </div>
        )}

        {/* Selected land indicator */}
        {selectedLand && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full border border-yellow-300">
              <img
                src="/sprites/terrain/dirt.png"
                alt="Land"
                className="w-5 h-5 object-contain pixelated"
              />
              <span className="text-sm font-semibold text-gray-700">Land selected - Click on a grass to place land</span>
            </span>
          </div>
        )}

        {/* Main content area - Fits between navbar and footer */}
        <div className={`flex-1 flex gap-4 lg:gap-6 items-center justify-center min-h-0 transition-all duration-300 ${isInventoryOpen ? "lg:justify-start" : "lg:justify-center"}`}>
          {/* Garden Grid */}
          <div
            className={`
              shrink-0
              bg-transparent flex items-center justify-center
              ${isInventoryOpen ? "w-full lg:w-2/3 h-full" : "w-full h-full"}
            `}
          >
            <div className="w-full h-full bg-transparent flex items-center justify-center">
              <GardenGrid
                garden={garden}
                onCellClick={handleCellClick}
                selectedPlant={selectedPlant}
                selectedLand={selectedLand}
                onBuyDirt={handleBuyDirt}
                onHarvestPlant={handleHarvestPlant}
                landPrice={landPrice}
                gems={user?.gems ?? 0}
              />
            </div>
          </div>

          {/* Inventory Panel */}
          {isInventoryOpen && (
            <div className="hidden lg:flex w-1/3 shrink-0 h-full min-w-0">
              <InventoryPanel
                onSelectPlant={setSelectedPlant}
                selectedPlant={selectedPlant}
                onSelectLand={handleSelectLand}
                landPrice={landPrice}
                gems={user?.gems ?? 0}
                onBuyPlant={handleBuyPlant}
                plantPrices={plantPrices as Record<PlantType, number>}
                coins={user?.coins ?? 0}
                purchasedPlants={purchasedPlants as Record<PlantType, number>}
                harvestedPlants={harvestedPlants as Record<PlantType, number>}
                onSellPlant={handleSellPlant}
                harvestPrice={harvestPrice}
              />
            </div>
          )}
        </div>

        {/* Mobile Inventory Panel (overlay) */}
        {isInventoryOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-end">
            <div className="w-full h-2/3 bg-white rounded-t-2xl shadow-soft">
              <div className="h-full">
                <InventoryPanel
                  onSelectPlant={setSelectedPlant}
                  selectedPlant={selectedPlant}
                  onSelectLand={handleSelectLand}
                  landPrice={landPrice}
                  gems={user?.gems ?? 0}
                  onBuyPlant={handleBuyPlant}
                  plantPrices={plantPrices as Record<PlantType, number>}
                  coins={user?.coins ?? 0}
                  purchasedPlants={purchasedPlants as Record<PlantType, number>}
                  harvestedPlants={harvestedPlants as Record<PlantType, number>}
                  onSellPlant={handleSellPlant}
                  harvestPrice={harvestPrice}
                  onClose={() => setIsInventoryOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <GardenFooter
        onBackpackClick={handleBackpackClick}
        onCommunityClick={handleCommunityClick}
        gems={user?.gems ?? 0}
        coins={user?.coins ?? 0}
        isVisiting={isVisiting}
        onReturnHome={handleReturnHome}
      />

      {/* Visit Garden Modal */}
      <VisitGardenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVisit={handleVisitGarden}
        userCommunities={userCommunities}
      />
    </div>
  );
}
