const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Community {
  _id: string;
  name: string;
  description?: string;
}

export async function getAllCommunities(): Promise<Community[]> {
  try {
    const url = `${API_BASE_URL}community`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch communities");
    }

    const result = await response.json();
    console.log("Communities API raw result:", result);
    
    // Try multiple possible data structures
    let communitiesData = result.data?.communities || result.communities || result.data || result;
    
    // If we got an object with a communities property, use that
    if (communitiesData && typeof communitiesData === 'object' && !Array.isArray(communitiesData) && communitiesData.communities) {
      communitiesData = communitiesData.communities;
    }
    
    console.log("Extracted communities data:", communitiesData);
    
    if (!Array.isArray(communitiesData)) {
      console.error("Communities data is not an array:", communitiesData);
      return [];
    }

    // Map to ensure we have proper structure
    const communities = communitiesData.map((item: any) => {
      if (typeof item === 'string') {
        // If backend returns just IDs, create objects
        return { _id: item, name: item };
      }
      // If backend returns objects, use them
      return {
        _id: item._id || item.id,
        name: item.communityName || item.name || item._id || item.id,
        description: item.description
      };
    });

    console.log("Final communities:", communities);
    return communities;
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}
