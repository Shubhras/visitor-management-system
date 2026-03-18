// Centralized role definitions for this service.
// Any logic that needs to check what a user is allowed to do
// should reference these values instead of using raw strings.
export enum Role {
  ADMIN = 'admin',
  RESIDENT = 'resident',
}