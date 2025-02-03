import { PexelsApiResponse } from "@/types/pexels";

type SearchParams = {
    query?: string,
    page?: number,
    perPage?: string,
};

export async function searchPhotos({
  query = 'nature',
  page = 1,
  perPage = '17',
}: SearchParams) {
    const apiKey = import.meta.env.VITE_PUBLIC_PEXELS_API_KEY as string;
  
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_PEXELS_API_KEY is not defined in environment variables");
    }

    // const orientation = 'landscape';
    
    const params = new URLSearchParams({
      query,
      per_page: perPage,
      page: String(page),
      // orientation
    });
  
    const res = await fetch(`https://api.pexels.com/v1/search?${params.toString()}`, {
      headers: {
        Authorization: apiKey,
      },
    });
  
    const data: PexelsApiResponse = await res.json();
  
    return data.photos;
}