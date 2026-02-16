import { TemplateBinding } from "@angular/compiler";

export interface User {
  id: number;
  email: string;
  team: string;
  // team: Team;
}


// export interface Team {
//   id: number;
//   name: string;
// }

export interface AuthCredentials {
  email: string;
  password: string;
}
