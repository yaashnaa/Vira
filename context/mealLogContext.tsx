import React, { createContext, useContext, useState } from "react";

interface MealLogContextType {
  refreshFlag: boolean;
  triggerRefresh: () => void;
}

const MealLogContext = createContext<MealLogContextType | undefined>(undefined);

export const MealLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => {
    setRefreshFlag((prev) => !prev); // toggling forces a useEffect to re-run
  };

  return (
    <MealLogContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </MealLogContext.Provider>
  );
};

export const useMealLog = () => {
  const context = useContext(MealLogContext);
  if (!context) {
    throw new Error("useMealLog must be used within a MealLogProvider");
  }
  return context;
};
