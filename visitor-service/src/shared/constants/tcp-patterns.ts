export const AUTH_PATTERNS = {
  LOGIN: 'auth.login',
  VALIDATE_USER: 'auth.validate_user',
  REGISTER: 'auth.register',
  FORGOT_PASSWORD: 'auth.forgot_password',
  RESET_PASSWORD: 'auth.reset_password',
  REFRESH_TOKEN: 'auth.refresh_token',
  LOGOUT: 'auth.logout',
};

export const USER_PATTERNS = {
  SYNC_FROM_AUTH: 'user.sync_from_auth',
  FIND_ALL: 'user.find_all',
  FIND_ONE: 'user.find_one',
  FIND_BY_EMAIL: 'user.find_by_email',
  UPDATE: 'user.update',
  DELETE: 'user.delete',
  TOGGLE_ACTIVE: 'user.toggle_active',
};

export const VISITOR_PATTERNS = {
  CREATE: 'visitor.create',
  FIND_ALL: 'visitor.find_all',
  FIND_ONE: 'visitor.find_one',
  UPDATE: 'visitor.update',
  DELETE: 'visitor.delete',
  APPROVE: 'visitor.approve',
  REJECT: 'visitor.reject',
};