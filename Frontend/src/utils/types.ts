export type place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating?: number;
  [key: string]: any;
};

export type Route ={
  id: string;
  customName: string;
  createdAt: string;
  waypoints: string[];
  transportationMode: string;
  DateOfCreation: string;
}