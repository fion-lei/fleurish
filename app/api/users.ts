const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface User {
  _id: string;
  username: string;
  gardenId?: string;
  coins?: number;
  gems?: number;
  communityName?: string;
}

export async function getAllUsers(): Promise<User[]> {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const url = `${API_BASE_URL}users`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch users");
  }

  const result = await response.json();
  console.log("getAllUsers raw result:", result);
  
  // Backend returns { success: true, data: { users: [{ userId, gardenId }] } }
  const usersData = result.data?.users || result.users || result.data || result;
  console.log("Extracted users data:", usersData);
  
  if (!Array.isArray(usersData)) {
    console.log("usersData is not an array, returning empty");
    return [];
  }

  // For each user, fetch their garden to get the garden name
  const userPromises = usersData.map(async (userData: any) => {
    const userId = userData.userId || userData._id;
    const gardenId = userData.gardenId;
    const communityId = userData.communityId;
    const coins = userData.coins || 0;
    const gems = userData.gems || 0;
    
    if (!gardenId) {
      console.log(`No gardenId for user ${userId}`);
      return null;
    }
    
    try {
      console.log(`Fetching garden ${gardenId} for user: ${userId}`);
      
      // Fetch garden name
      const gardenResponse = await fetch(`${API_BASE_URL}gardens/${gardenId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log(`Response status for garden ${gardenId}:`, gardenResponse.status);
      
      if (!gardenResponse.ok) {
        console.log(`No garden found for gardenId ${gardenId}`);
        return null;
      }
      
      const gardenData = await gardenResponse.json();
      console.log(`Garden data for gardenId ${gardenId}:`, gardenData);
      const garden = gardenData.data || gardenData;
      
      // Fetch community name if communityId exists
      let communityName = "Unknown Community";
      if (communityId) {
        try {
          const communityResponse = await fetch(`${API_BASE_URL}communities/name`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ communityId }),
          });
          
          if (communityResponse.ok) {
            const communityData = await communityResponse.json();
            communityName = communityData.data?.name || communityData.name || "Unknown Community";
          }
        } catch (err) {
          console.error(`Failed to fetch community name for ${communityId}:`, err);
        }
      }
      
      const user: User = {
        _id: userId,
        username: garden.gardenName || "Someone",
        gardenId: gardenId,
        coins: coins,
        gems: gems,
        communityName: communityName,
      };
      return user;
    } catch (err) {
      console.error(`Failed to fetch garden ${gardenId}:`, err);
      return null;
    }
  });

  const users = (await Promise.all(userPromises)).filter(
    (user): user is User => user !== null
  );
  
  console.log("Final users list:", users);

  return users;
}
