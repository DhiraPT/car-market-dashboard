import { Layout, Tabs } from "antd";
import CarTree from "./CarTree";
import { useContext, useEffect } from "react";
import supabase from "../utils/supabase";
import { DataContext } from "../providers/DataContextProvider";
import { CarModelType, CarPriceType } from "../types/car.types";
import { Content } from "antd/es/layout/layout";
import MSRPGraph from "./MSRPGraph";
import MSRPDeltaGraph from "./MSRPDeltaGraph";
import { CoeDataType } from "../types/coe.types";

const MainLayout = () => {
  const { coeData, setCoeData, setCarModelData } = useContext(DataContext);

  const fetchCoeData = async () => {
    const { data } = await supabase
      .from("CoeBiddings")
      .select("*")
      .order("bidding_date", { ascending: true });

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
    const coeDates = coeData.map((coe) => coe.bidding_date);
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

    const adjustedParsedData: CarModelType[] = [];
    if (parsedData && coeDates.length > 0) {
      parsedData.map((carModel) => {
        const carSubmodels = carModel.CarSubmodels.map((carSubmodel) => {
          // For every coe date, returns the car price with date that is less than the coe date
          const carPricesClosestToEachCoeDates = coeDates
            .map((coeDate) => {
              const carPricesBeforeCoeDate = carSubmodel.CarPrices.filter(
                (carPrice) => carPrice.date < coeDate,
              );
              if (carPricesBeforeCoeDate.length === 0) {
                return null;
              }
              const closestCarPrice = carPricesBeforeCoeDate.reduce((prev, curr) =>
                Math.abs(curr.date.getTime() - coeDate.getTime()) <
                Math.abs(prev.date.getTime() - coeDate.getTime())
                  ? curr
                  : prev,
              );
              return {
                date: coeDate,
                price: closestCarPrice.price,
                is_coe_included: closestCarPrice.is_coe_included,
              };
            })
            .filter((carPrice) => carPrice !== null) as CarPriceType[];
          return {
            submodel_id: carSubmodel.submodel_id,
            submodel: carSubmodel.submodel,
            coe_type: carSubmodel.coe_type,
            CarPrices: carPricesClosestToEachCoeDates,
          };
        });
        adjustedParsedData.push({
          model_id: carModel.model_id,
          model: carModel.model,
          CarBrands: carModel.CarBrands,
          CarSubmodels: carSubmodels,
        });
      });
    }
    return adjustedParsedData;
  };

  useEffect(() => {
    async function getCoeData() {
      const initCoeData = await fetchCoeData();
      if (initCoeData) {
        setCoeData(initCoeData);
      }
    }
    getCoeData();
  }, [setCoeData]);

  useEffect(() => {
    async function getCarData() {
      const initCarData = await fetchAllCarData();
      if (initCarData && coeData) {
        setCarModelData(initCarData);
      }
    }
    getCarData();
  }, [coeData]);

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
