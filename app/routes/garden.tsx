import { useEffect, useRef, useState } from "react";
import { GardenFooter } from "../components/GardenFooter";
import { GardenGrid, createInitialGarden, type GardenCell, type PlantType } from "../components/GardenGrid";
import { InventoryPanel } from "../components/InventoryPanel";
import { Navbar } from "../components/Navbar";
import type { Route } from "./+types/garden";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Garden - Fleurish" },
    { name: "description", content: "Your garden" },
  ];
}

export default function Garden() {
  const [garden, setGarden] = useState<GardenCell[][]>(createInitialGarden());
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [gems, setGems] = useState(0);
  const [coins, setCoins] = useState(75);
  const [gardenName, setGardenName] = useState("Garden Name");
  const [selectedLand, setSelectedLand] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
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
  const landPrice = 5; // Price in gems to buy land
  const plantPrices: Record<PlantType, number> = { pink: 30, yellow: 20, purple: 15 };
  const harvestPrice = 60; // Price in coins when selling harvested plants
  
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

  useEffect(() => {
    if (isEditingName && gardenNameInputRef.current) {
      gardenNameInputRef.current.focus();
      gardenNameInputRef.current.select();
    }
  }, [isEditingName]);

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
        {/* Garden Name - Editable (right under navbar) */}
        <div className="pt-6 pb-4 flex items-center justify-center gap-2">
          <input
            ref={gardenNameInputRef}
            type="text"
            value={gardenName}
            onChange={(e) => setGardenName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            className={`text-2xl md:text-3xl font-bold text-black text-center bg-transparent border-2 rounded-lg outline-none focus:outline-none focus:ring-2 focus:ring-fleur-green/30 pb-2 px-4 py-2 transition-all duration-200 ${
              isEditingName
                ? "border-fleur-green border-solid focus:border-fleur-green/70"
                : "border-dashed border-fleur-green/40 hover:border-fleur-green/60"
            }`}
            placeholder="Click to edit garden name"
          />
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
                selectedLand={selectedLand}
                landPrice={landPrice}
                gems={gems}
                onBuyPlant={handleBuyPlant}
                plantPrices={plantPrices}
                coins={coins}
                purchasedPlants={purchasedPlants}
                harvestedPlants={harvestedPlants}
                onSellPlant={handleSellPlant}
                selectedHarvestedPlant={selectedHarvestedPlant}
                onSelectHarvestedPlant={setSelectedHarvestedPlant}
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
                  selectedLand={selectedLand}
                  landPrice={landPrice}
                  gems={gems}
                  onBuyPlant={handleBuyPlant}
                  plantPrices={plantPrices}
                  coins={coins}
                  purchasedPlants={purchasedPlants}
                  harvestedPlants={harvestedPlants}
                  onSellPlant={handleSellPlant}
                  selectedHarvestedPlant={selectedHarvestedPlant}
                  onSelectHarvestedPlant={setSelectedHarvestedPlant}
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
        gems={gems}
        coins={coins}
      />
    </div>
  );
}
