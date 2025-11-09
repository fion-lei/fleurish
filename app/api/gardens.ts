import type { GardenCell } from "../components/GardenGrid";

export interface GardenData {
  id: string;
  ownerId: string;
  name: string;
  community: string;
  layout: GardenCell[][];
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
