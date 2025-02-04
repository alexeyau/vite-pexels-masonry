import {
  DEFAULT_QUERY,
  START_SEARCH_PAGE,
  PER_SEARCH_PAGE
 } from "@/types/constants";
 
import { PexelsApiResponse, Photo } from "@/types/pexels";

type SearchParams = {
    query?: string,
    page?: number,
    perPage?: string,
};

type PhotoResult = {
  photos: Photo[],
  totalResults: number,
}

export async function searchPhotos({
  query = DEFAULT_QUERY,
  page = START_SEARCH_PAGE,
  perPage = PER_SEARCH_PAGE,
}: SearchParams): Promise<PhotoResult> {
    const apiKey = import.meta.env.VITE_PUBLIC_PEXELS_API_KEY as string;
  
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_PEXELS_API_KEY is not defined in environment variables");
    }
    
    const params = new URLSearchParams({
      query,
      per_page: perPage,
      page: String(page),
    });
  
    const res = await fetch(`https://api.pexels.com/v1/search?${params.toString()}`, {
      headers: {
        Authorization: apiKey,
      },
    });
  
    const data: PexelsApiResponse = await res.json();
  
    return {
      photos: data.photos,
      totalResults: data.total_results,
    }
}