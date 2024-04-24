import { Layout } from "antd";
import CarTree from "./CarTree";
import MainArea from "./MainArea";
import { useContext, useEffect } from "react";
import supabase from "../utils/supabase";
import { DataContext } from "../providers/DataContextProvider";
import { CarModelType } from "../types/car.types";

const MainLayout = () => {
  const { setCarModelData } = useContext(DataContext);

  const getAllCarData = async (): Promise<CarModelType[]> => {
    const { data } = await supabase
      .from("CarModels")
      .select(
        `
        model_id,
        model,
        CarBrands(*),
        CarSubmodels (
          submodel_id,
          submodel,
          coe_type,
          CarPrices (
            date,
            price,
            is_coe_included
          )
        )
      `,
      )
      .order("date", {
        referencedTable: "CarSubmodels.CarPrices",
        ascending: true,
      });

    const parsedData: CarModelType[] = [];
    if (data) {
      data.forEach((carModel) => {
        const carSubmodels = carModel.CarSubmodels.map((carSubmodel) => {
          return {
            submodel_id: carSubmodel.submodel_id,
            submodel: carSubmodel.submodel,
            coe_type: carSubmodel.coe_type,
            CarPrices: carSubmodel.CarPrices.map((carPrice) => {
              return {
                date: new Date(carPrice.date),
                price: carPrice.price,
                is_coe_included: carPrice.is_coe_included,
              };
            }),
          };
        });
        parsedData.push({
          model_id: carModel.model_id,
          model: carModel.model,
          CarBrands: carModel.CarBrands,
          CarSubmodels: carSubmodels,
        });
      });
    }
    return parsedData;
  };

  useEffect(() => {
    async function fetchData() {
      const initCarData = await getAllCarData();
      if (initCarData) {
        setCarModelData(initCarData);
      }
    }
    fetchData();
  }, [setCarModelData]);

  return (
    <Layout hasSider>
      <CarTree />
      <MainArea />
    </Layout>
  );
};

export default MainLayout;
