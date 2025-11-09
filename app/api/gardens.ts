import type { GardenCell } from "../components/GardenGrid";

export interface GardenData {
  id: string;
  ownerId: string;
  name: string;
  community: string;
  layout: GardenCell[][];
}

export async function fetchAvailableGardens(
  filter: "all" | "community" = "community",
  userCommunities: string[] = []
): Promise<Array<{ id: string; name: string; community: string; ownerId: string }>> {
  return [
    { id: "garden-1", name: "Sarah's Blooming Garden", community: "Downtown Gardeners", ownerId: "user-1" },
    { id: "garden-2", name: "Mike's Vegetable Paradise", community: "Organic Growers", ownerId: "user-2" },
    { id: "garden-3", name: "Emma's Flower Haven", community: "Downtown Gardeners", ownerId: "user-3" },
    { id: "garden-4", name: "Alex's Green Sanctuary", community: "Organic Growers", ownerId: "user-4" },
  ];
}

export async function fetchGardenById(gardenId: string): Promise<GardenData> {
  // Create initial garden layout - 5x5 to match user's garden
  const createEmptyGarden = (): GardenCell[][] => {
    const garden: GardenCell[][] = [];
    for (let row = 0; row < 5; row++) {
      const gardenRow: GardenCell[] = [];
      for (let col = 0; col < 5; col++) {
        let terrain: "TL_grass" | "TM_grass" | "TR_grass" | "ML_grass" | "MM_grass" | "MR_grass" | "dirt" | "BL_grass" | "BM_grass" | "BR_grass";
        if (row === 0) {
          terrain = col === 0 ? "TL_grass" : col === 4 ? "TR_grass" : "TM_grass";
        } else if (row === 1) {
          terrain = col === 0 ? "ML_grass" : col === 4 ? "MR_grass" : "MM_grass";
        } else if (row === 2) {
          terrain = col === 0 ? "ML_grass" : col === 2 ? "dirt" : col === 4 ? "MR_grass" : "MM_grass";
        } else if (row === 3) {
          terrain = col === 0 ? "ML_grass" : col === 4 ? "MR_grass" : "MM_grass";
        } else {
          terrain = col === 0 ? "BL_grass" : col === 4 ? "BR_grass" : "BM_grass";
        }
        gardenRow.push({ terrain, plant: null });
      }
      garden.push(gardenRow);
    }
    return garden;
  };

  let layout = createEmptyGarden();

  if (gardenId === "garden-1") {
    layout[2][2].plant = { type: "pink", stage: 1 };
  } else if (gardenId === "garden-2") {
    layout[2][2].plant = { type: "yellow", stage: 2 };
  } else if (gardenId === "garden-3") {
    layout[2][2].plant = { type: "purple", stage: 1 };
  } else if (gardenId === "garden-4") {
    layout[2][2].plant = { type: "pink", stage: 0 };
  }

  const gardenData: GardenData = {
    id: gardenId,
    ownerId: gardenId.replace("garden-", "user-"),
    name: ["Sarah's Blooming Garden", "Mike's Vegetable Paradise", "Emma's Flower Haven", "Alex's Green Sanctuary"][
      parseInt(gardenId.split("-")[1]) - 1
    ] || "Unknown Garden",
    community: [
      "Downtown Gardeners",
      "Organic Growers",
      "Downtown Gardeners",
      "Organic Growers",
    ][parseInt(gardenId.split("-")[1]) - 1] || "Unknown Community",
    layout,
  };

  return gardenData;
}

export async function searchGardens(
  query: string,
  filter: "all" | "community" = "community",
  userCommunities: string[] = []
): Promise<Array<{ id: string; name: string; community: string; ownerId: string }>> {
  const allGardens = await fetchAvailableGardens(filter, userCommunities);

  const lowerQuery = query.toLowerCase();
  return allGardens.filter(
    (garden) =>
      garden.name.toLowerCase().includes(lowerQuery) ||
      garden.community.toLowerCase().includes(lowerQuery)
  );
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchGardenFromAPI(gardenId: string): Promise<GardenData> {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const url = `${API_BASE_URL}gardens/${gardenId}`;
  console.log("Fetching garden:", { url, gardenId });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Failed to fetch garden:", errorData);
    throw new Error(errorData.message || "Failed to fetch garden");
  }

  const data = await response.json();
  console.log("Garden data received:", data);
  return data;
}

// Fetches raw garden payload and returns gardenName; backend returns { success, data }
export async function fetchGardenName(gardenId: string): Promise<string> {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Not authenticated");

  const url = `${API_BASE_URL}gardens/${gardenId}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to fetch garden");
  }
  const json = await res.json().catch(() => ({}));
  // Support both shapes: { success:true, data:{ gardenName } } or direct { gardenName }
  return json?.data?.gardenName ?? json?.gardenName ?? "";
}

// Returns the updated gardenName from backend
export async function updateGardenName(gardenId: string, newName: string): Promise<string> {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const url = `${API_BASE_URL}gardens/${gardenId}/name`;

  const response = await fetch(url, {
    method: "PATCH", // backend test uses PATCH
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // Backend expects `gardenName` in the body
    body: JSON.stringify({ gardenName: newName }),
  });

  console.log("Response status:", response.status);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to update garden name");
  }
  
  const data = await response.json().catch(() => ({}));
  console.log("Garden name updated successfully", data);
  // success response shape: { success:true, data:{ gardenName: "..." } }
  const updatedName = data?.data?.gardenName || newName;
  return updatedName;
}
