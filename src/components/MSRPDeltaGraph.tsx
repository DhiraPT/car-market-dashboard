import { Line } from "@ant-design/charts";
import { useContext } from "react";
import { DataContext } from "../utils/DataContextProvider";
import { Card, Segmented } from "antd";

const MSRPDeltaGraph: React.FC = () => {
  const { data, checkedKeys } = useContext(DataContext);

  const msrpDeltaData = data
    .flatMap((carBrand) => {
      return carBrand.CarModels.flatMap((carModel) => {
        return carModel.CarSubmodels.flatMap((carSubmodel) => {
          return carSubmodel.CarPrices.map((carPrice, index) => {
            const previousPrice =
              index > 0 ? carSubmodel.CarPrices[index - 1].price : carPrice.price;
            return {
              key: `${carModel.model_id}-${carSubmodel.submodel_id}`,
              model_submodel: `${carModel.model} ${carSubmodel.submodel}`,
              date: carPrice.date,
              msrp_delta: carPrice.price - previousPrice,
            };
          });
        });
      });
    })
    .filter((entry) => checkedKeys.includes(entry.key));

  const config = {
    title: {
      title: "MSRP Delta Over Time",
      style: {
        align: "center",
        titleFontSize: 36,
      },
    },
    height: 500,
    forceFit: true,
    padding: "auto",
    data: msrpDeltaData,
    xField: "date",
    yField: "msrp_delta",
    seriesField: "model_submodel",
    slider: {
      x: {
        values: [0.6, 1],
      },
    },
    responsive: true,
  };

  return (
    <Card className="content-card">
      <Segmented
        options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
        onChange={(value) => {
          console.log(value); // string
        }}
      />
      <Line {...config} />
    </Card>
  );
};

export default MSRPDeltaGraph;
