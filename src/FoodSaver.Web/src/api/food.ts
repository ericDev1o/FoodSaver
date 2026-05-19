import type { 
    CreateFoodRequest, 
    Food 
} from '../feature/types';

const API_URL: string = import.meta.env.VITE_API_URL as string;

async function ensureSuccess(response: Response) : Promise<void> {
  if (response.ok)
    return;
  
  const errorText = await response.text();

  throw new Error(
    `Name: API request failed. 
    Status: ${String(response.status)},
    Message: ${errorText}
  `);
}

export async function getFoods(): Promise<Food[]> {
  const response = await fetch(`${API_URL}/foods`);

  await ensureSuccess(response);

  return await response.json() as Food[];
}

export async function createFood(request: CreateFoodRequest): Promise<Food> {
  const response = await fetch(`${API_URL}/foods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  await ensureSuccess(response);

  return await response.json() as Food;
}

export async function consumeFood(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/foods/${id}/consume`, {
    method: 'PATCH',
  });

  await ensureSuccess(response);
}