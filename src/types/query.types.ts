export type CarBrandType = {
  brand: string;
  brand_id: number;
  CarModels: {
    model_id: number;
    model: string;
    CarSubmodels: {
      submodel_id: number;
      submodel: string;
      coe_type: string;
      CarPrices: {
        date: string;
        price: number;
      }[];
    }[];
  }[];
};
