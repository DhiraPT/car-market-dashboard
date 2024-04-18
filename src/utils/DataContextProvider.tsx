import { createContext, useState, ReactNode } from "react";
import { CarBrandType } from "../types/query.types";

// Define the type for the context
type ContextType = {
  data: CarBrandType[];
  setData: React.Dispatch<React.SetStateAction<CarBrandType[]>>;
  checkedKeys: React.Key[];
  setCheckedKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
};

// Create the context with the specified type
export const DataContext = createContext<ContextType>({
  data: [],
  setData: () => {},
  checkedKeys: [],
  setCheckedKeys: () => {},
});

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<CarBrandType[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  return (
    <DataContext.Provider value={{ data, setData, checkedKeys, setCheckedKeys }}>
      {children}
    </DataContext.Provider>
  );
};
