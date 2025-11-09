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
  plantPrice?: number;
  coins?: number;
  purchasedPlants?: Record<PlantType, number>;
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
  plantPrice,
  coins,
  purchasedPlants,
  onClose 
}: InventoryPanelProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "shop">("inventory");
  const [selectedShopItem, setSelectedShopItem] = useState<PlantType | "land" | null>(null);

  const plantTypes: PlantType[] = ["pink", "purple", "yellow"];
  const canAffordLand = landPrice && gems !== undefined && gems >= landPrice;
  const canAffordPlant = plantPrice && coins !== undefined && coins >= plantPrice;

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
          <div className="space-y-4">
            {Object.values(purchasedPlants || {}).every(count => count === 0) ? (
              <p className="text-center text-sm text-gray-500 mt-4">
                No plants in inventory.
              </p>
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
                        aspect-square bg-white rounded-lg border-2 transition-all duration-200
                        flex flex-col items-center justify-center p-2 relative
                        ${
                          selectedPlant === plantType
                            ? "border-fleur-green ring-2 ring-fleur-green/50 shadow-soft"
                            : "border-gray-200 hover:border-fleur-green/50"
                        }
                      `}
                    >
                      <img
                        src={`/sprites/plants/${plantType}_2.png`}
                        alt={plantType}
                        className="w-12 h-12 object-contain pixelated mb-2"
                      />
                      <span className="text-xs font-semibold text-gray-700 capitalize">{plantType}</span>
                      <span className="text-xs text-gray-500">x{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {/* Land item */}
              <button
                onClick={() => setSelectedShopItem(selectedShopItem === "land" ? null : "land")}
                className={`
                  aspect-square bg-white rounded-lg border-2 transition-all duration-200
                  flex flex-col items-center justify-center p-2
                  ${
                    selectedShopItem === "land"
                      ? "border-fleur-green ring-2 ring-fleur-green/50 shadow-soft"
                      : "border-gray-200 hover:border-fleur-green/50"
                  }
                `}
              >
                <img
                  src="/sprites/terrain/dirt.png"
                  alt="Land"
                  className="w-12 h-12 object-contain pixelated mb-2"
                />
                <span className="text-xs font-semibold text-gray-700">Land</span>
                <span className="text-xs text-gray-500">{landPrice || 10} gems</span>
              </button>
              
              {/* Plant items */}
              {plantTypes.map((plantType) => (
                <button
                  key={plantType}
                  onClick={() => setSelectedShopItem(selectedShopItem === plantType ? null : plantType)}
                  className={`
                    aspect-square bg-white rounded-lg border-2 transition-all duration-200
                    flex flex-col items-center justify-center p-2
                    ${
                      selectedShopItem === plantType
                        ? "border-fleur-green ring-2 ring-fleur-green/50 shadow-soft"
                        : "border-gray-200 hover:border-fleur-green/50"
                    }
                  `}
                >
                  <img
                    src={`/sprites/plants/${plantType}_2.png`}
                    alt={plantType}
                    className="w-12 h-12 object-contain pixelated mb-2"
                  />
                  <span className="text-xs font-semibold text-gray-700 capitalize">{plantType}</span>
                  <span className="text-xs text-gray-500">{plantPrice || 50} coins</span>
                </button>
              ))}
            </div>
            
            {/* Buy button - shows when shop item is selected */}
            {selectedShopItem && (
              <div className="mt-4 pt-4 border-t border-fleur-green/30">
                {selectedShopItem === "land" ? (
                  <button
                    onClick={() => {
                      if (onSelectLand && canAffordLand) {
                        onSelectLand();
                        setSelectedShopItem(null);
                      }
                    }}
                    disabled={!canAffordLand}
                    className={`
                      w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
                      ${
                        canAffordLand
                          ? "bg-fleur-green text-white hover:bg-fleur-green/90 shadow-soft"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    {canAffordLand ? `Buy Land (${landPrice || 10} gems)` : `Not enough gems (need ${landPrice || 10})`}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (onBuyPlant && canAffordPlant && selectedShopItem && plantTypes.includes(selectedShopItem as PlantType)) {
                        onBuyPlant(selectedShopItem as PlantType);
                        setSelectedShopItem(null);
                      }
                    }}
                    disabled={!canAffordPlant}
                    className={`
                      w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
                      ${
                        canAffordPlant
                          ? "bg-fleur-green text-white hover:bg-fleur-green/90 shadow-soft"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    {canAffordPlant && selectedShopItem && plantTypes.includes(selectedShopItem as PlantType)
                      ? `Buy ${(selectedShopItem as PlantType).charAt(0).toUpperCase() + (selectedShopItem as PlantType).slice(1)} (${plantPrice || 50} coins)`
                      : `Not enough coins (need ${plantPrice || 50})`
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

