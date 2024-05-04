export type CarModelType = {
  model_id: number;
  model: string;
  is_parallel_imported: boolean;
  CarBrands: CarBrandType | null;
  CarSubmodels: CarSubmodelTypeWithoutPrice[];
};

export type CarType = {
  model_id: number;
  model: string;
  is_parallel_imported: boolean;
  CarBrands: CarBrandType | null;
  CarSubmodels: CarSubmodelType[];
};

export type CarBrandType = {
  brand: string;
};

export type CarSubmodelType = {
  submodel_id: number;
  submodel: string;
  coe_type: string | null;
  CarPrices: CarPriceType[];
};

export type CarSubmodelTypeWithoutPrice = {
  submodel_id: number;
  submodel: string;
  coe_type: string | null;
};

export type CarPriceType = {
  date: Date;
  price: number;
  is_coe_included: boolean;
};
