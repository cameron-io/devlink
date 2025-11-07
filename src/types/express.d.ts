// Define the structure of your user object
// You should replace `string` with the actual type of your user ID
interface UserPayload {
  id: string; // The field you are injecting
  // Add other properties if needed, e.g., role: 'admin' | 'user';
}

// Use declaration merging to add the custom property to the Request interface
declare namespace Express {
  export interface Request {
    user?: UserPayload; // The 'user' property with your custom type
  }
}