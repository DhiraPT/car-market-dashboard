import { useContext, useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import { Layout, TreeDataNode, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import CarTree from "./components/CarTree";
import MainArea from "./components/MainArea";
import supabase from "./utils/supabase";
import { DataContext, DataContextProvider } from "./utils/DataContextProvider";

function App() {
  const { data, setData } = useContext(DataContext);

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
  }, []);

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
