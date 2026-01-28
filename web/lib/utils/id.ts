/**
 * Generate a unique ID
 * Compatible with both browser and Node.js environments
 */
export function generateId(): string {
  // Use crypto.randomUUID() if available (modern browsers and Node.js 16+)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older environments
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
