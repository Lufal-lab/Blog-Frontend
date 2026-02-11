import { TemplateBinding } from "@angular/compiler";

export interface User {
  id: number;
  email: string;
  team: Team;
  is_active: boolean;
  is_staff: boolean;
}


export interface Team {
  id: number;
  name: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}
