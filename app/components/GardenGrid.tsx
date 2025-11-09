import { useEffect, useRef, useState } from "react";

export type TerrainType =
  | "TL_grass"
  | "TM_grass"
  | "TR_grass"
  | "ML_grass"
  | "MM_grass"
  | "MR_grass"
  | "BL_grass"
  | "BM_grass"
  | "BR_grass"
  | "dirt";

export type PlantType = "pink" | "purple" | "yellow";
export type PlantStage = 0 | 1 | 2; // 0 = seedling, 1 = color_1, 2 = color_2

export interface Plant {
  type: PlantType;
  stage: PlantStage;
}

export interface GardenCell {
  terrain: TerrainType;
  plant: Plant | null;
}

interface GardenGridProps {
  garden: GardenCell[][];
  onCellClick: (row: number, col: number) => void;
  selectedPlant: PlantType | null;
  selectedLand?: boolean;
  onBuyDirt?: (row: number, col: number) => void;
  onHarvestPlant?: (row: number, col: number) => void;
  landPrice?: number;
  gems?: number;
}

export function GardenGrid({ garden, onCellClick, selectedPlant, selectedLand, onBuyDirt, onHarvestPlant, landPrice, gems }: GardenGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState<number>(32);

  useEffect(() => {
    const calculateTileSize = () => {
      if (!containerRef.current) return;
      
      // Get the closest flex parent that contains the garden container
      const container = containerRef.current.parentElement?.parentElement;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      const base = 16;
      
      // Calculate size that fits in container
      const minDimension = Math.min(containerWidth, containerHeight);
      const size = Math.floor(minDimension / 5);
      
      const snappedSize = Math.floor(size / base) * base;
      
      const finalSize = Math.max(snappedSize, base);
      
      setTileSize(finalSize);
    };

    // Initial calculation with delay for backend
    const timer = setTimeout(calculateTileSize, 0);
    
    const resizeObserver = new ResizeObserver(() => {
      calculateTileSize();
    });
    
    if (containerRef.current?.parentElement?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement.parentElement);
    }
    
    window.addEventListener("resize", calculateTileSize);
    
    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateTileSize);
    };
  }, []);

  const gridSize = 5 * tileSize;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-transparent"
    >
      <div
        className="grid grid-cols-5 bg-transparent"
        style={{
          width: `${gridSize}px`,
          height: `${gridSize}px`,
          gap: 0,
          padding: 0,
          margin: 0,
        }}
      >
        {garden.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GardenCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              onClick={() => onCellClick(rowIndex, colIndex)}
              selectedPlant={selectedPlant}
              selectedLand={selectedLand}
              tileSize={tileSize}
              onBuyDirt={onBuyDirt}
              onHarvestPlant={onHarvestPlant}
              landPrice={landPrice}
              gems={gems}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface GardenCellProps {
  cell: GardenCell;
  row: number;
  col: number;
  onClick: () => void;
  selectedPlant: PlantType | null;
  selectedLand?: boolean;
  tileSize: number;
  onBuyDirt?: (row: number, col: number) => void;
  onHarvestPlant?: (row: number, col: number) => void;
  landPrice?: number;
  gems?: number;
}

function GardenCell({ cell, row, col, onClick, selectedPlant, selectedLand, tileSize, onBuyDirt, onHarvestPlant, landPrice, gems }: GardenCellProps) {
  const [showHarvestBtn, setShowHarvestBtn] = useState(false);
  const canPlant = cell.terrain === "dirt" && !cell.plant && selectedPlant !== null;
  const canHarvest = cell.plant && cell.plant.stage === 2;
  const canBuyDirt = cell.terrain === "MM_grass" && selectedLand && onBuyDirt && landPrice && gems !== undefined && gems >= landPrice;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canHarvest) {
      setShowHarvestBtn(!showHarvestBtn);
    } else if (canBuyDirt && onBuyDirt) {
      onBuyDirt(row, col);
    } else {
      onClick();
    }
  };

  const handleHarvest = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onHarvestPlant) {
      onHarvestPlant(row, col);
      setShowHarvestBtn(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative overflow-hidden
        bg-transparent p-0 m-0 border-none outline-none
        ${canPlant || canHarvest || canBuyDirt ? "cursor-pointer" : "cursor-default"}
      `}
      style={{
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        boxShadow: canPlant
          ? "inset 0 0 0 1px #85B254"
          : canHarvest
          ? "inset 0 0 0 1px #E1BAD4"
          : canBuyDirt
          ? "inset 0 0 0 1px #F0FFC8"
          : "none",
      }}
      disabled={!canPlant && !canHarvest && !canBuyDirt}
      title={
        canPlant
          ? `Click to plant ${selectedPlant}`
          : canHarvest
          ? "Click to harvest"
          : canBuyDirt
          ? `Click to buy land for ${landPrice} gems`
          : cell.plant
          ? `${cell.plant.type} - Stage ${cell.plant.stage + 1}`
          : ""
      }
    >
      {/* Terrain background */}
      <img
        src={`/sprites/terrain/${cell.terrain}.png`}
        alt={cell.terrain}
        className="absolute inset-0 pixelated"
        style={{
          width: `${tileSize}px`,
          height: `${tileSize}px`,
          objectFit: "fill",
          display: "block",
          margin: 0,
          padding: 0,
        }}
      />
      
      {/* Plant overlay */}
      {cell.plant && (
        <>
          <img
            src={getPlantSprite(cell.plant)}
            alt={`${cell.plant.type} stage ${cell.plant.stage}`}
            className="absolute inset-0 pixelated z-10"
            style={{
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              objectFit: "fill",
              display: "block",
              margin: 0,
              padding: 0,
            }}
          />
          
          {/* Harvest button for mature plants */}
          {canHarvest && showHarvestBtn && (
            <button
              onClick={handleHarvest}
              className="absolute inset-0 z-20 bg-fleur-green/80 hover:bg-fleur-green flex items-center justify-center text-white font-semibold text-xs transition-colors"
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
              }}
            >
              Harvest
            </button>
          )}
        </>
      )}
    </button>
  );
}

function getPlantSprite(plant: Plant): string {
  if (plant.stage === 0) {
    return "/sprites/plants/seedling.png";
  }
  return `/sprites/plants/${plant.type}_${plant.stage}.png`;
}

// Helper function to create initial garden state
export function createInitialGarden(): GardenCell[][] {
  const garden: GardenCell[][] = [];
  
  for (let row = 0; row < 5; row++) {
    const gardenRow: GardenCell[] = [];
    for (let col = 0; col < 5; col++) {
      let terrain: TerrainType;
      
      // 5x5 grid with the specified pattern
      if (row === 0) {
        // Top row: TL_grass, TM_grass, TM_grass, TM_grass, TR_grass
        terrain = col === 0 ? "TL_grass" : col === 4 ? "TR_grass" : "TM_grass";
      } else if (row === 1) {
        // Second row: ML_grass, MM_grass, MM_grass, MM_grass, MR_grass
        terrain = col === 0 ? "ML_grass" : col === 4 ? "MR_grass" : "MM_grass";
      } else if (row === 2) {
        // Middle row: ML_grass, MM_grass, dirt, MM_grass, MR_grass
        terrain = col === 0 ? "ML_grass" : col === 2 ? "dirt" : col === 4 ? "MR_grass" : "MM_grass";
      } else if (row === 3) {
        // Fourth row: ML_grass, MM_grass, MM_grass, MM_grass, MR_grass
        terrain = col === 0 ? "ML_grass" : col === 4 ? "MR_grass" : "MM_grass";
      } else {
        // Fifth row: BL_grass, BM_grass, BM_grass, BM_grass, BR_grass
        terrain = col === 0 ? "BL_grass" : col === 4 ? "BR_grass" : "BM_grass";
      }
      
      gardenRow.push({
        terrain,
        plant: null,
      });
    }
    garden.push(gardenRow);
  }
  
  return garden;
}
