export interface TJwtPayload {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
}
