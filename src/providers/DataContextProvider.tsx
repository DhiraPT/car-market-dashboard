import { createContext, useState, ReactNode } from "react";
import { CarModelType } from "../types/car.types";
// import { CoeDataType } from "../types/coe.types";

// Define the type for the context
type ContextType = {
  carModelData: CarModelType[];
  setCarModelData: React.Dispatch<React.SetStateAction<CarModelType[]>>;
  checkedKeys: React.Key[];
  setCheckedKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
};

// Create the context with the specified type
export const DataContext = createContext<ContextType>({
  carModelData: [],
  setCarModelData: () => {},
  checkedKeys: [],
  setCheckedKeys: () => {},
});

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [carModelData, setCarModelData] = useState<CarModelType[]>([]);
  // const [coeData, setCoeData] = useState<CoeDataType[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  return (
    <DataContext.Provider value={{ carModelData, setCarModelData, checkedKeys, setCheckedKeys }}>
      {children}
    </DataContext.Provider>
  );
};
