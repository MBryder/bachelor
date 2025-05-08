export type place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating?: number;
  [key: string]: any;
};