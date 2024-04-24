import { Line, LineConfig } from "@ant-design/charts";
import { useContext } from "react";
import { DataContext } from "../utils/DataContextProvider";
import { Card, Segmented } from "antd";

const MSRPGraph: React.FC = () => {
  const { data, checkedKeys } = useContext(DataContext);

  const msrpData = data
    .flatMap((carModel) => {
      return carModel.CarSubmodels.flatMap((carSubmodel) => {
        return carSubmodel.CarPrices.map((carPrice) => {
          return {
            key: `${carModel.model_id}-${carSubmodel.submodel_id}`,
            model_submodel: `${carModel.model} ${carSubmodel.submodel}`,
            date: carPrice.date,
            msrp: carPrice.price,
          };
        });
      });
    })
    .filter((entry) => checkedKeys.includes(entry.key));

  const config: LineConfig = {
    title: {
      title: "MSRP Over Time",
      style: {
        align: "center",
        titleFontSize: 36,
      },
    },
    height: 500,
    forceFit: true,
    padding: "auto",
    data: msrpData,
    xField: "date",
    yField: "msrp",
    colorField: "model_submodel",
    slider: {
      x: {
        values: [0.6, 1],
      },
    },
    responsive: true,
    interaction: {
      legendFilter: false,
    },
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

export default MSRPGraph;
