export type CarModelType = {
  model_id: number;
  model: string;
  CarBrands: {
    brand: string;
  } | null;
  CarSubmodels: {
    submodel_id: number;
    submodel: string;
    coe_type: string | null;
    CarPrices: {
      date: string;
      price: number;
      is_coe_included: boolean;
    }[];
  }[];
};
