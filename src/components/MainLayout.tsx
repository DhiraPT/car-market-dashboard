import { Layout } from "antd";
import CarTree from "./CarTree";
import MainArea from "./MainArea";
import { useContext, useEffect } from "react";
import supabase from "../utils/supabase";
import { DataContext } from "../utils/DataContextProvider";

const MainLayout = () => {
  const { setData } = useContext(DataContext);

  const getAllCarData = async () => {
    const { data } = await supabase
      .from("CarBrands")
      .select(
        `
        *,
        CarModels (
          model_id,
          model,
          CarSubmodels (
            submodel_id,
            submodel,
            coe_type,
            CarPrices (
              date,
              price
            )
          )
        )
      `,
      )
      .order("date", {
        referencedTable: "CarModels.CarSubmodels.CarPrices",
        ascending: true,
      });
    return data;
  };

  useEffect(() => {
    async function fetchData() {
      const initCarData = await getAllCarData();
      if (initCarData) {
        setData(initCarData);
      }
    }
    fetchData();
  }, [setData]);

  return (
    <Layout hasSider>
      <CarTree />
      <MainArea />
    </Layout>
  );
};

export default MainLayout;
