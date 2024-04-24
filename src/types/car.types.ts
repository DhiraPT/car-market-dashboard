export type CarModelType = {
  model_id: number;
  model: string;
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

export type CarPriceType = {
  date: Date;
  price: number;
  is_coe_included: boolean;
};
