import { createContext, useState, ReactNode } from "react";
import { CarModelType } from "../types/query.types";

// Define the type for the context
type ContextType = {
  data: CarModelType[];
  setData: React.Dispatch<React.SetStateAction<CarModelType[]>>;
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
  const [data, setData] = useState<CarModelType[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  return (
    <DataContext.Provider value={{ data, setData, checkedKeys, setCheckedKeys }}>
      {children}
    </DataContext.Provider>
  );
};
