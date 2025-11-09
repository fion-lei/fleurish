import { useState } from "react";
import type { PlantType } from "./GardenGrid";

interface InventoryPanelProps {
  onSelectPlant: (plant: PlantType | null) => void;
  selectedPlant: PlantType | null;
  onSelectLand?: () => void;
  landPrice?: number;
  gems?: number;
  onBuyPlant?: (plantType: PlantType) => void;
  plantPrices?: Record<PlantType, number>;
  coins?: number;
  purchasedPlants?: Record<PlantType, number>;
  harvestedPlants?: Record<PlantType, number>;
  onSellPlant?: (plantType: PlantType) => void;
  harvestPrice?: number;
  onClose?: () => void;
}

export function InventoryPanel({ 
  onSelectPlant, 
  selectedPlant, 
  onSelectLand, 
  landPrice, 
  gems,
  onBuyPlant,
  plantPrices,
  coins,
  purchasedPlants,
  harvestedPlants,
  onSellPlant,
  harvestPrice,
  onClose 
}: InventoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "shop">("inventory");
  const [hoveredSeedling, setHoveredSeedling] = useState<PlantType | null>(null);
  const [hoveredHarvested, setHoveredHarvested] = useState<PlantType | null>(null);
  const [hoveredShopItem, setHoveredShopItem] = useState<PlantType | "land" | null>(null);

  const plantTypes: PlantType[] = ["pink", "purple", "yellow"];
  const canAffordLand = landPrice && gems !== undefined && gems >= landPrice;
  const canAffordPlant = coins !== undefined && plantPrices && Math.min(...Object.values(plantPrices)) <= coins;

  return (
    <div className="w-full h-full bg-fleur-green/20 rounded-lg shadow-soft border border-fleur-green/30 flex flex-col overflow-hidden">
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b border-fleur-green/30 lg:hidden">
          <h2 className="text-lg font-bold text-gray-700">Inventory</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close inventory"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex border-b border-fleur-green/30 flex-shrink-0">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex-1 px-4 py-3 font-semibold transition-all duration-200 ${
            activeTab === "inventory"
              ? "bg-white text-gray-700 border-b-2 border-fleur-green"
              : "bg-fleur-green/10 text-gray-500 hover:bg-fleur-green/20"
          }`}
        >
          Inventory
        </button>
        <button
          onClick={() => setActiveTab("shop")}
          className={`flex-1 px-4 py-3 font-semibold transition-all duration-200 ${
            activeTab === "shop"
              ? "bg-white text-gray-700 border-b-2 border-fleur-green"
              : "bg-fleur-green/10 text-gray-500 hover:bg-fleur-green/20"
          }`}
        >
          Shop
        </button>
      </div>

      <div className="flex-1 p-4 pb-6 overflow-y-auto min-h-0">
        {activeTab === "inventory" ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Seedlings to Plant</h3>
              {Object.values(purchasedPlants || {}).every(count => count === 0) ? (
                <p className="text-center text-xs text-gray-500">Buy seeds from the shop.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {plantTypes.map((plantType) => {
                    const count = purchasedPlants?.[plantType] || 0;
                    if (count === 0) return null;
                    const isHovered = hoveredSeedling === plantType;
                    return (
                      <div
                        key={plantType}
                        onMouseEnter={() => setHoveredSeedling(plantType)}
                        onMouseLeave={() => setHoveredSeedling(null)}
                        className="relative"
                      >
                        <button
                          className="bg-white rounded-lg border-2 border-gray-200 hover:border-fleur-green/50 transition-all duration-200 flex flex-col items-center justify-center p-2 w-full min-h-[120px]"
                          style={{ aspectRatio: "1 / 1" }}
                        >
                          <img
                            src="/sprites/plants/seedling.png"
                            alt={`${plantType} seedling`}
                            className="w-12 h-12 object-contain pixelated mb-1"
                          />
                          <span className="text-xs font-semibold text-gray-700 capitalize">{plantType} seedling</span>
                          <span className="text-xs text-gray-500">x{count}</span>
                        </button>
                        {isHovered && (
                          <button
                            onClick={() => onSelectPlant(selectedPlant === plantType ? null : plantType)}
                            className="absolute inset-0 bg-fleur-purple/70 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-fleur-purple/80 transition-all"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Harvested Plants</h3>
              {Object.values(harvestedPlants || {}).every(count => count === 0) ? (
                <p className="text-center text-xs text-gray-500">Harvest your fully grown plants.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {plantTypes.map((plantType) => {
                    const count = harvestedPlants?.[plantType] || 0;
                    if (count === 0) return null;
                    const isHovered = hoveredHarvested === plantType;
                    return (
                      <div
                        key={`harvested-${plantType}`}
                        onMouseEnter={() => setHoveredHarvested(plantType)}
                        onMouseLeave={() => setHoveredHarvested(null)}
                        className="relative"
                      >
                        <button
                          className="bg-white rounded-lg border-2 border-gray-200 hover:border-fleur-purple/50 transition-all duration-200 flex flex-col items-center justify-center p-2 w-full min-h-[120px]"
                          style={{ aspectRatio: "1 / 1" }}
                        >
                          <img
                            src={`/sprites/plants/${plantType}_2.png`}
                            alt={`${plantType} harvested`}
                            className="w-12 h-12 object-contain pixelated mb-1"
                          />
                          <span className="text-xs font-semibold text-gray-700 capitalize">{plantType}</span>
                          <span className="text-xs text-gray-500">x{count}</span>
                        </button>
                        {isHovered && (
                          <button
                            onClick={() => onSellPlant?.(plantType)}
                            className="absolute inset-0 bg-fleur-purple/70 rounded-lg flex items-center justify-center text-white font-semibold hover:bg-fleur-purple/80 transition-all"
                          >
                            Sell ({harvestPrice || 60}c)
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div
                onMouseEnter={() => setHoveredShopItem("land")}
                onMouseLeave={() => setHoveredShopItem(null)}
                className="relative"
              >
                <button
                  className="bg-white rounded-lg border-2 border-gray-200 hover:border-fleur-green/50 transition-all duration-200 flex flex-col items-center justify-center p-2 w-full min-h-[120px]"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <img
                    src="/sprites/terrain/dirt.png"
                    alt="Land"
                    className="w-12 h-12 object-contain pixelated mb-2"
                  />
                  <span className="text-xs font-semibold text-gray-700">Land</span>
                  <span className="text-xs text-gray-500">{landPrice || 5} gems</span>
                </button>
                {hoveredShopItem === "land" && (
                  <button
                    onClick={() => {
                      onSelectLand?.();
                      setHoveredShopItem(null);
                    }}
                    disabled={!canAffordLand}
                    className={`absolute inset-0 rounded-lg flex items-center justify-center font-semibold transition-all ${
                      canAffordLand
                        ? "bg-fleur-green/70 text-white hover:bg-fleur-green/80"
                        : "bg-red-500/60 text-white cursor-not-allowed"
                    }`}
                  >
                    {canAffordLand ? "Buy" : "No gems"}
                  </button>
                )}
              </div>

              {plantTypes.map((plantType) => (
                <div
                  key={plantType}
                  onMouseEnter={() => setHoveredShopItem(plantType)}
                  onMouseLeave={() => setHoveredShopItem(null)}
                  className="relative"
                >
                  <button
                    className="bg-white rounded-lg border-2 border-gray-200 hover:border-fleur-green/50 transition-all duration-200 flex flex-col items-center justify-center p-2 w-full min-h-[120px]"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <img
                      src={`/sprites/plants/${plantType}_2.png`}
                      alt={plantType}
                      className="w-12 h-12 object-contain pixelated mb-2"
                    />
                    <span className="text-xs font-semibold text-gray-700 capitalize">{plantType}</span>
                    <span className="text-xs text-gray-500">{plantPrices?.[plantType] || 0} coins</span>
                  </button>
                  {hoveredShopItem === plantType && (
                    <button
                      onClick={() => {
                        if (plantTypes.includes(plantType as PlantType)) {
                          onBuyPlant?.(plantType as PlantType);
                          setHoveredShopItem(null);
                        }
                      }}
                      disabled={!canAffordPlant}
                      className={`absolute inset-0 rounded-lg flex items-center justify-center font-semibold transition-all ${
                        canAffordPlant
                          ? "bg-fleur-green/70 text-white hover:bg-fleur-green/80"
                          : "bg-red-500/60 text-white cursor-not-allowed"
                      }`}
                    >
                      {canAffordPlant ? "Buy" : "No coins"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

