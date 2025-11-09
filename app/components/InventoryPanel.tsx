import { useState } from "react";
import type { PlantType } from "./GardenGrid";

interface InventoryPanelProps {
  onSelectPlant: (plant: PlantType | null) => void;
  selectedPlant: PlantType | null;
  onSelectLand?: () => void;
  selectedLand?: boolean;
  landPrice?: number;
  gems?: number;
  onBuyPlant?: (plantType: PlantType) => void;
  plantPrices?: Record<PlantType, number>;
  coins?: number;
  purchasedPlants?: Record<PlantType, number>;
  harvestedPlants?: Record<PlantType, number>;
  onSellPlant?: (plantType: PlantType) => void;
  selectedHarvestedPlant?: PlantType | null;
  onSelectHarvestedPlant?: (plant: PlantType | null) => void;
  harvestPrice?: number;
  onClose?: () => void;
}

export function InventoryPanel({ 
  onSelectPlant, 
  selectedPlant, 
  onSelectLand, 
  selectedLand, 
  landPrice, 
  gems,
  onBuyPlant,
  plantPrices,
  coins,
  purchasedPlants,
  harvestedPlants,
  onSellPlant,
  selectedHarvestedPlant,
  onSelectHarvestedPlant,
  harvestPrice,
  onClose 
}: InventoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "shop">("inventory");
  const [selectedShopItem, setSelectedShopItem] = useState<PlantType | "land" | null>(null);

  const plantTypes: PlantType[] = ["pink", "purple", "yellow"];
  const canAffordLand = landPrice && gems !== undefined && gems >= landPrice;
  // For plant affordability, check if any plant price is affordable (we'll check specific price when buying)
  const canAffordPlant = coins !== undefined && plantPrices && Math.min(...Object.values(plantPrices)) <= coins;

  return (
    <div className="w-full h-full bg-fleur-green/20 rounded-lg shadow-soft border border-fleur-green/30 flex flex-col overflow-hidden">
      {/* Header with close button */}
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

      {/* Tabs */}
      <div className="flex border-b border-fleur-green/30 flex-shrink-0">
        <button
          onClick={() => {
            setActiveTab("inventory");
            setSelectedShopItem(null); // Reset selection when switching tabs
          }}
          className={`flex-1 px-4 py-3 font-semibold transition-all duration-200 ${
            activeTab === "inventory"
              ? "bg-white text-gray-700 border-b-2 border-fleur-green"
              : "bg-fleur-green/10 text-gray-500 hover:bg-fleur-green/20"
          }`}
        >
          Inventory
        </button>
        <button
          onClick={() => {
            setActiveTab("shop");
            setSelectedShopItem(null); // Reset selection when switching tabs
          }}
          className={`flex-1 px-4 py-3 font-semibold transition-all duration-200 ${
            activeTab === "shop"
              ? "bg-white text-gray-700 border-b-2 border-fleur-green"
              : "bg-fleur-green/10 text-gray-500 hover:bg-fleur-green/20"
          }`}
        >
          Shop
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-6 overflow-y-auto min-h-0">
        {activeTab === "inventory" ? (
          <div className="space-y-6">
            {/* Seedlings section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Seedlings to Plant</h3>
              {Object.values(purchasedPlants || {}).every(count => count === 0) ? (
                <p className="text-center text-xs text-gray-500">Buy seeds from the shop.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {plantTypes.map((plantType) => {
                    const count = purchasedPlants?.[plantType] || 0;
                    if (count === 0) return null;
                    return (
                      <button
                        key={plantType}
                        onClick={() => onSelectPlant(selectedPlant === plantType ? null : plantType)}
                        className={`
                          bg-white rounded-lg border-2 transition-all duration-200
                          flex flex-col items-center justify-center p-2
                          w-full min-h-[120px]
                          ${
                            selectedPlant === plantType
                              ? "border-fleur-green ring-2 ring-fleur-green/50 shadow-soft"
                              : "border-gray-200 hover:border-fleur-green/50"
                          }
                        `}
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
                    );
                  })}
                </div>
              )}
            </div>

            {/* Harvested plants section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Harvested Plants</h3>
              {Object.values(harvestedPlants || {}).every(count => count === 0) ? (
                <p className="text-center text-xs text-gray-500">Harvest your fully grown plants.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {plantTypes.map((plantType) => {
                    const count = harvestedPlants?.[plantType] || 0;
                    if (count === 0) return null;
                    return (
                      <button
                        key={`harvested-${plantType}`}
                        onClick={() => onSelectHarvestedPlant?.(selectedHarvestedPlant === plantType ? null : plantType)}
                        className={`
                          bg-white rounded-lg border-2 transition-all duration-200
                          flex flex-col items-center justify-center p-2
                          w-full min-h-[120px]
                          ${
                            selectedHarvestedPlant === plantType
                              ? "border-fleur-purple ring-2 ring-fleur-purple/50 shadow-soft"
                              : "border-gray-200 hover:border-fleur-purple/50"
                          }
                        `}
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
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sell button - shows when harvested plant is selected */}
            {selectedHarvestedPlant && (
              <div className="mt-4 pt-4 border-t border-fleur-purple/30">
                <button
                  onClick={() => onSellPlant?.(selectedHarvestedPlant)}
                  className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 bg-fleur-purple text-white hover:bg-fleur-purple/90 shadow-soft"
                >
                  Sell {selectedHarvestedPlant.charAt(0).toUpperCase() + selectedHarvestedPlant.slice(1)} ({harvestPrice || 60} coins)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedShopItem(selectedShopItem === "land" ? null : "land")}
                className={`
                  bg-white rounded-lg border-2 transition-all duration-200
                  flex flex-col items-center justify-center p-2
                  w-full min-h-[120px]
                  ${
                    selectedShopItem === "land"
                      ? "border-fleur-green ring-2 ring-fleur-green/50 shadow-soft"
                      : "border-gray-200 hover:border-fleur-green/50"
                  }
                `}
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
              
              {plantTypes.map((plantType) => (
                <button
                  key={plantType}
                  onClick={() => setSelectedShopItem(selectedShopItem === plantType ? null : plantType)}
                  className={`
                    bg-white rounded-lg border-2 transition-all duration-200
                    flex flex-col items-center justify-center p-2
                    w-full min-h-[120px]
                    ${
                      selectedShopItem === plantType
                        ? "border-fleur-green ring-2 ring-fleur-green/50 shadow-soft"
                        : "border-gray-200 hover:border-fleur-green/50"
                    }
                  `}
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
              ))}
            </div>
            {selectedShopItem && (
              <div className="mt-4 pt-4 border-t border-fleur-green/30">
                {selectedShopItem === "land" ? (
                  <button
                    onClick={() => {
                      onSelectLand?.();
                      setSelectedShopItem(null);
                    }}
                    disabled={!canAffordLand}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      canAffordLand
                        ? "bg-fleur-green text-white hover:bg-fleur-green/90 shadow-soft"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {canAffordLand ? `Buy Land (${landPrice || 5} gems)` : `Not enough gems (need ${landPrice || 5})`}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (selectedShopItem && plantTypes.includes(selectedShopItem as PlantType)) {
                        onBuyPlant?.(selectedShopItem as PlantType);
                        setSelectedShopItem(null);
                      }
                    }}
                    disabled={!canAffordPlant}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      canAffordPlant
                        ? "bg-fleur-green text-white hover:bg-fleur-green/90 shadow-soft"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {canAffordPlant && selectedShopItem && plantTypes.includes(selectedShopItem as PlantType)
                      ? `Buy ${(selectedShopItem as PlantType).charAt(0).toUpperCase() + (selectedShopItem as PlantType).slice(1)} (${plantPrices?.[selectedShopItem as PlantType] || 0} coins)`
                      : `Not enough coins (need ${selectedShopItem && plantPrices ? plantPrices[selectedShopItem as PlantType] || 0 : 0})`
                    }
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

