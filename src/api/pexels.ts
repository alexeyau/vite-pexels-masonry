import { PexelsApiResponse } from "@/types/pexels";

export async function searchPhotos({ query = 'nature' }: { query?: string }) {
    const apiKey = import.meta.env.VITE_PUBLIC_PEXELS_API_KEY as string;
  
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_PEXELS_API_KEY is not defined in environment variables");
    }
   
    const perPage = '10';
    const orientation = 'landscape';
    
    const params = new URLSearchParams({
      query, 
      per_page: perPage, 
      orientation
    });
  
    const res = await fetch(`https://api.pexels.com/v1/search?${params.toString()}`, {
      headers: {
        Authorization: apiKey,
      },
    });
  
    const data: PexelsApiResponse = await res.json();
  
    return data.photos;
  }