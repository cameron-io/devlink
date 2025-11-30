// Use declaration merging to add the custom property to the Request interface
declare namespace Express {
  export interface Request {
    user?: UserDto; // The 'user' property with your custom type
  }
}