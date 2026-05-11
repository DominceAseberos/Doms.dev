import type { LandingData } from '../types/landing';

const LANDING_JSON_URL = '/src/data/landingData.json';
const WRITE_API_URL = '/__write-json?file=landingData.json';

export const fetchLandingData = async (): Promise<LandingData> => {
  const res = await fetch(LANDING_JSON_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch landing data: ${res.status}`);
  }
  return res.json() as Promise<LandingData>;
};

export const saveLandingData = async (data: LandingData): Promise<boolean> => {
  const res = await fetch(WRITE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to save landing data: ${res.status}`);
  }
  return true;
};
