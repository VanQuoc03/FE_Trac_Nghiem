import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [databaithi, setDatabaithi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const response = await axios.get("/api/baithi", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setDatabaithi(response.data);
      } catch (error) {
        console.error("Error fetching baithi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ databaithi, loading }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);