import { useContext, useEffect } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import { Layout } from "antd";
import { Header } from "antd/es/layout/layout";
import CarTree from "./components/CarTree";
import MainArea from "./components/MainArea";
import supabase from "./utils/supabase";
import { DataContext } from "./utils/DataContextProvider";

function App() {
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
    <>
      <Layout>
        <Header className="header">
          <img src={viteLogo} className="logo" alt="Vite Logo" />
          <h1 className="title">Car Market Dashboard</h1>
        </Header>
        <Layout hasSider>
          <CarTree />
          <MainArea />
        </Layout>
      </Layout>
    </>
  );
}

export default App;
