import { User } from "./user.interface";

export interface NewHttpResponse {
  users: User[];
  firstPage: string;
  lastPage: string;
  prevPage: string;
  nextPage: string;
  pageSize: number;
  totalLengthPage: number;
}
