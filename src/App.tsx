import { BrowserRouter, Route, Routes } from "react-router-dom";
import UsersList from "./components/users-list/users-list";
import UserProfile from "./components/user-profile/user-profile";
import { RedirectPage } from "./components/redirect-page/redirect-page";
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="users-list" element={<UsersList />}></Route>
        <Route path="user-profile/new" element={<UserProfile />}></Route>
        <Route path="user-profile/:id" element={<UserProfile />}></Route>
        <Route path="*" element={<RedirectPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
