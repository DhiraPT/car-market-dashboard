import { createContext, useState, ReactNode } from "react";
import { CarModelType, CarType } from "../types/car.types";
import { CoeDataType } from "../types/coe.types";

// Define the type for the context
type ContextType = {
  carModelData: CarModelType[];
  setCarModelData: React.Dispatch<React.SetStateAction<CarModelType[]>>;
  selectedCarData: CarType[];
  setSelectedCarData: React.Dispatch<React.SetStateAction<CarType[]>>;
  checkedKeys: React.Key[];
  setCheckedKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  coeData: CoeDataType[];
  setCoeData: React.Dispatch<React.SetStateAction<CoeDataType[]>>;
  coeTypes: string[];
};

// Create the context with the specified type
export const DataContext = createContext<ContextType>({
  carModelData: [],
  setCarModelData: () => {},
  selectedCarData: [],
  setSelectedCarData: () => {},
  checkedKeys: [],
  setCheckedKeys: () => {},
  coeData: [],
  setCoeData: () => {},
  coeTypes: [],
});

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [carModelData, setCarModelData] = useState<CarModelType[]>([]);
  const [selectedCarData, setSelectedCarData] = useState<CarType[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [coeData, setCoeData] = useState<CoeDataType[]>([]);
  const coeTypes = Array.from(new Set(coeData.map((coe) => coe.coe_type)));

  return (
    <DataContext.Provider
      value={{
        carModelData,
        setCarModelData,
        selectedCarData,
        setSelectedCarData,
        checkedKeys,
        setCheckedKeys,
        coeData,
        setCoeData,
        coeTypes,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
