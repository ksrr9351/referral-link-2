// src/types/user.ts
// src/types/user.ts
export interface User {
  _id: string; // ID of the user in the database
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string; // Optional field for user's avatar
  city?: string; // Optional field for user's city
  country?: string; // Optional field for user's country
  timezone?: string; // Optional field for user's timezone
}


export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}
