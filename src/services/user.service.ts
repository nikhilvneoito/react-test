import http from "../http-common";
import { User } from "../interfaces/user.interface";

class UserService {
  getUsers(key: string, criteria: string, pageNum: number, limit: number = 12) {
    return http.get<any>(
      `/users?q=${key}&_sort=${criteria}&_page=${pageNum}&_limit=${limit}`
    );
  }

  createUser(userDetails: Partial<User>) {
    return http.post<any>(`/users`, userDetails);
  }

  getUser(userId: number) {
    return http.get<any>(`/users/${userId}`);
  }

  updateUser(userDetails: Partial<User>) {
    return http.put<any>(`/users/${userDetails.id}`, userDetails);
  }

  deleteUser(userId: number) {
    return http.delete<any>(`/users/${userId}`);
  }
}

export default new UserService();
