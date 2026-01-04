// Export all types and schemas
export * from "./user";
export * from "./clinic";
export * from "./trainer";
export * from "./seller";
export * from "./appointment";
export * from "./order";
export * from "./product";
export * from "./service";
export * from "./session";
export * from "./chatGroup";
export * from "./chatMessage";

// Common Types
export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};