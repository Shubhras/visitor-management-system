// These are the only valid states a visitor record can be in.
// A visitor starts as PENDING when created by a resident from the mobile app.
// An admin then either approves or rejects from the React dashboard.
export enum VisitorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}