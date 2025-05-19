import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { wordService } from "../services/wordService";
import { useAuth } from "./AuthContext";

interface AdminContextType {
  pendingCount: number;
  refreshPendingCount: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pendingCount, setPendingCount] = useState(0);
  const { user } = useAuth();

  const fetchPendingCount = useCallback(async () => {
    if (user?.role === "admin") {
      try {
        const pendingWords = await wordService.getPendingWords();
        setPendingCount(pendingWords.length);
      } catch (error) {
        console.error("Error fetching pending words count:", error);
      }
    }
  }, [user?.role]);

  useEffect(() => {
    fetchPendingCount();
    // Set up polling every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [fetchPendingCount]);

  return (
    <AdminContext.Provider
      value={{ pendingCount, refreshPendingCount: fetchPendingCount }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
