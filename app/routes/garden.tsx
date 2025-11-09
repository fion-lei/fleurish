import { useEffect, useRef, useState } from "react";
import { fetchGardenById, updateGardenName, fetchGardenName } from "../api/gardens";
import { GardenFooter } from "../components/GardenFooter";
import { GardenGrid, createInitialGarden, type GardenCell, type PlantType } from "../components/GardenGrid";
import { InventoryPanel } from "../components/InventoryPanel";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../components/AuthContext";
import { VisitGardenModal } from "../components/VisitGardenModal";
import type { Route } from "./+types/garden";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Garden - Fleurish" },
    { name: "description", content: "Your garden" },
  ];
}

export default function Garden() {
  const { user } = useAuth();
  const [garden, setGarden] = useState<GardenCell[][]>(createInitialGarden());
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [gems, setGems] = useState(0);
  const [coins, setCoins] = useState(75);
  const [gardenName, setGardenName] = useState("");
  const [showNamePlaceholder, setShowNamePlaceholder] = useState(false);
  const [gardenId, setGardenId] = useState<string | null>(null);
  const [selectedLand, setSelectedLand] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [hasUnsavedNameChanges, setHasUnsavedNameChanges] = useState(false);
  const [nameSaveStatus, setNameSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [purchasedPlants, setPurchasedPlants] = useState<Record<PlantType, number>>({
    pink: 0,
    purple: 0,
    yellow: 0,
  });
  const [harvestedPlants, setHarvestedPlants] = useState<Record<PlantType, number>>({
    pink: 0,
    purple: 0,
    yellow: 0,
  });
  const [selectedHarvestedPlant, setSelectedHarvestedPlant] = useState<PlantType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisiting, setIsVisiting] = useState(false);
  const [visitingGardenName, setVisitingGardenName] = useState("");
  const [isLoadingGarden, setIsLoadingGarden] = useState(false);
  const landPrice = 5; // Price in gems to buy land
  const plantPrices: Record<PlantType, number> = { pink: 30, yellow: 20, purple: 15 };
  const harvestPrice = 60; // Price in coins when selling harvested plants
  
  // User's community affiliations - easily replaceable with backend user data
  const userCommunities = ["Downtown Gardeners", "Organic Growers"];
  
  const gardenNameInputRef = useRef<HTMLInputElement>(null);

  const handleCellClick = (row: number, col: number) => {
    const cell = garden[row][col];
    
    // If there's a selected plant and the cell is dirt with no plant, plant it
    if (selectedPlant && cell.terrain === "dirt" && !cell.plant && purchasedPlants[selectedPlant] > 0) {
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
        [selectedPlant]: prev[selectedPlant] - 1,
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
      // Add coins when harvesting (you can adjust this logic)
      setCoins((prev) => prev + 10);
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
    if (gems >= landPrice) {
      setSelectedLand(!selectedLand);
      setSelectedPlant(null); // Deselect plant when selecting land
    }
  };

  const handleBuyPlant = (plantType: PlantType) => {
    const price = plantPrices[plantType];
    if (coins >= price) {
      setPurchasedPlants((prev) => ({
        ...prev,
        [plantType]: (prev[plantType] || 0) + 1,
      }));
      setCoins((prev) => prev - price);
      // TODO: Call backend API to update inventory and deduct coins
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

  const handleSellPlant = (plantType: PlantType) => {
    if (harvestedPlants[plantType] > 0) {
      setHarvestedPlants((prev) => ({
        ...prev,
        [plantType]: prev[plantType] - 1,
      }));
      setCoins((prev) => prev + harvestPrice);
      if (selectedHarvestedPlant === plantType && harvestedPlants[plantType] === 1) {
        setSelectedHarvestedPlant(null);
      }
      // TODO: Call backend API to update inventory and add coins
    }
  };

  const handleEditIconClick = () => {
    setIsEditingName(true);
  };

  const handleSaveGardenName = async () => {
    console.log("Save button clicked!", { gardenId, gardenName, hasUnsavedNameChanges });
    setDebugInfo(`🔘 Button clicked!\nGarden ID: ${gardenId || 'null'}\nGarden Name: ${gardenName}\nHas Unsaved: ${hasUnsavedNameChanges}`);
    
    if (!gardenId) {
      setDebugInfo(`✗ Error: No garden ID found!\nCannot save without a garden ID.`);
      return;
    }
    
    if (!gardenName.trim()) {
      setDebugInfo(`✗ Error: Garden name is empty!`);
      return;
    }
    
    if (!hasUnsavedNameChanges) {
      setDebugInfo(`✗ Error: No unsaved changes detected!`);
      return;
    }
    
    if (gardenId && gardenName.trim() && hasUnsavedNameChanges) {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const url = `${API_BASE_URL}gardens/${gardenId}/name`;
      setDebugInfo(`📡 Sending request...\nURL: ${url}\nGarden ID: ${gardenId}\nNew Name: ${gardenName}`);
      setNameSaveStatus("saving");
      try {
        const updated = await updateGardenName(gardenId, gardenName.trim());
        console.log("Garden name updated successfully");
        setGardenName(updated);
        setHasUnsavedNameChanges(false);
        setNameSaveStatus("saved");
        setDebugInfo(prev => `${prev ? prev + "\n" : ""}✓ Saved successfully!\nURL: ${url}\nName: ${gardenName}`);
      } catch (error) {
        console.error("Failed to update garden name:", error);
        setNameSaveStatus("error");
        setDebugInfo(prev => `${prev ? prev + "\n" : ""}✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}\nURL: ${url}`);
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
      setDebugInfo(`Changed name to: "${e.target.value}"\nHas unsaved changes: true\nCurrent gardenId: ${gardenId || 'null'}`);
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
        setDebugInfo((prev) => `${prev ? prev + "\n" : ""}User gardenId from /users/me: ${user.gardenId}`);
      } else if (user) {
        setDebugInfo((prev) => `${prev ? prev + "\n" : ""}No gardenId found on /users/me response`);
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
            setDebugInfo((prev) => `${prev ? prev + "\n" : ""}Fetched gardenName from /gardens/${gardenId}: ${name}`);
          }
        } catch (e) {
          setDebugInfo((prev) => `${prev ? prev + "\n" : ""}Failed to fetch gardenName: ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
      }
    };
    loadGardenName();
  }, [gardenId, isVisiting]);

  const handleBuyDirt = (row: number, col: number) => {
    const cell = garden[row][col];
    
    // Only allow buying dirt on MM_grass cells when land is selected
    if (cell.terrain === "MM_grass" && selectedLand && gems >= landPrice) {
      const newGarden = garden.map((r) => [...r]);
      newGarden[row][col] = {
        ...cell,
        terrain: "dirt",
      };
      setGarden(newGarden);
      setGems((prev) => prev - landPrice);
      setSelectedLand(false); // Deselect after placing land
      
      // TODO: Call backend API to update garden and deduct gems
      // Example: await updateGardenCell(row, col, "dirt");
      // Example: await updateCurrency({ gems: gems - landPrice });
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

        {/* Debug Info Display */}
        {debugInfo && (
          <div className="mx-auto max-w-2xl mb-4 p-4 bg-gray-800 text-white rounded-lg text-sm font-mono whitespace-pre-wrap">
            <div className="font-bold mb-2">🔍 Debug Info:</div>
            {debugInfo}
          </div>
        )}
        
        {/* Selected plant indicator */}
        {selectedPlant && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-fleur-green/20 rounded-full border border-fleur-green/30">
              <img
                src="/sprites/plants/seedling.png"
                alt={selectedPlant}
                className="w-5 h-5 object-contain pixelated"
              />
              <span className="text-sm font-semibold text-gray-700 capitalize">
                Selected: {selectedPlant} - Click on dirt to plant
              </span>
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
              <span className="text-sm font-semibold text-gray-700">
                Land selected - Click on a grass to place land
              </span>
            </span>
          </div>
        )}

        {/* Main content area - Fits between navbar and footer */}
        <div className={`flex-1 flex gap-4 lg:gap-6 items-center justify-center min-h-0 transition-all duration-300 ${isInventoryOpen ? "lg:justify-start" : "lg:justify-center"}`}>
          {/* Garden Grid */}
          <div
            className={`
              flex-shrink-0
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
                gems={gems}
              />
            </div>
          </div>

          {/* Inventory Panel */}
          {isInventoryOpen && (
            <div className="hidden lg:flex w-1/3 flex-shrink-0 h-full min-w-0">
              <InventoryPanel
                onSelectPlant={setSelectedPlant}
                selectedPlant={selectedPlant}
                onSelectLand={handleSelectLand}
                landPrice={landPrice}
                gems={gems}
                onBuyPlant={handleBuyPlant}
                plantPrices={plantPrices}
                coins={coins}
                purchasedPlants={purchasedPlants}
                harvestedPlants={harvestedPlants}
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
                  gems={gems}
                  onBuyPlant={handleBuyPlant}
                  plantPrices={plantPrices}
                  coins={coins}
                  purchasedPlants={purchasedPlants}
                  harvestedPlants={harvestedPlants}
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
        gems={gems}
        coins={coins}
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
