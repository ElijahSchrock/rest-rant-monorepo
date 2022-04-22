import { createContext, useEffect, useState } from "react";

export const CurrentUser = createContext();

function CurrentUserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const getLoggedInUser = async () => {
      let response = await fetch(
        "http://localhost:5000/authentication/profile",
        {
          credentials: "include",
        }
      );
      let user = await response.json();
      setCurrentUser(user);
    };
    getLoggedInUser();
  }, []);

  let logoutButton = null;

  if (currentUser?.userId) {
    logoutButton = (
      <li style={{ float: "right" }}>
        <a href="http://localhost:5000/authentication/logout" onClick={null}>
          Logout
        </a>
      </li>
    );
  }

  window.setCurrentUser = setCurrentUser;
  return (
    <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>
      {children}
      {logoutButton}
    </CurrentUser.Provider>
  );
}

export default CurrentUserProvider;
