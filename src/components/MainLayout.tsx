import { Layout, Tabs } from "antd";
import CarTree from "./CarTree";
import { useContext, useEffect } from "react";
import supabase from "../utils/supabase";
import { DataContext } from "../providers/DataContextProvider";
import { CarModelType } from "../types/car.types";
import { Content } from "antd/es/layout/layout";
import MSRPGraph from "./MSRPGraph";
import MSRPDeltaGraph from "./MSRPDeltaGraph";
import { CoeDataType } from "../types/coe.types";

const MainLayout = () => {
  const { setCoeData, setCarModelData } = useContext(DataContext);

  const fetchCoeData = async () => {
    const { data } = await supabase
      .from("CoeBiddings")
      .select("*")
      .order("date", { ascending: true });

    const parsedData: CoeDataType[] = [];
    if (data) {
      data.forEach((coeData) => {
        parsedData.push({
          coe_type: coeData.coe_type,
          bidding_date: new Date(coeData.bidding_date),
          premium: coeData.premium,
          quota: coeData.quota,
        });
      });
    }
    return parsedData;
  };

  const fetchAllCarData = async (): Promise<CarModelType[]> => {
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
      const initCoeData = await fetchCoeData();
      if (initCoeData) {
        setCoeData(initCoeData);
      }
      const initCarData = await fetchAllCarData();
      if (initCarData) {
        setCarModelData(initCarData);
      }
    }
    fetchData();
  }, [setCoeData, setCarModelData]);

  return (
    <Layout hasSider>
      <CarTree />
      <Content className="content">
        <Tabs
          defaultActiveKey="1"
          tabPosition="top"
          items={[
            { key: "1", label: "MSRP Graph", children: <MSRPGraph /> },
            { key: "2", label: "MSRP Delta Graph", children: <MSRPDeltaGraph /> },
          ]}
        />
      </Content>
    </Layout>
  );
};

export default MainLayout;
