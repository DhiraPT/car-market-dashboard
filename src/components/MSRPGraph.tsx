import { Line, LineConfig } from "@ant-design/charts";
import { useContext } from "react";
import { DataContext } from "../providers/DataContextProvider";
import { Segmented } from "antd";
import { formatDate } from "../utils/date.utils";

const MSRPGraph: React.FC = () => {
  const { selectedCarData, checkedKeys, coeData } = useContext(DataContext);

  const msrpData = selectedCarData.flatMap((carModel) => {
    return carModel.CarSubmodels.flatMap((carSubmodel) => {
      return carSubmodel.CarPrices.map((carPrice) => {
        return {
          key: `${carModel.model_id}-${carSubmodel.submodel_id}`,
          label: `${carModel.model} ${carSubmodel.submodel}${carModel.is_parallel_imported ? " (PI)" : ""}`,
          date: formatDate(carPrice.date),
          msrp: carPrice.price,
          coe_type: carSubmodel.coe_type,
        };
      });
    });
  });

  // Earliest date in the msrpData
  const earliestDate = new Date(
    Math.min(...msrpData.map((entry) => new Date(entry.date).getTime())),
  );

  // COE categories selected
  const coeCategories = Array.from(new Set(msrpData.map((entry) => entry.coe_type)));

  // Filter COE data based on the earliest date. Else, return all COE data if no car models are selected
  const filteredCoeData = coeData.filter(
    (coe) =>
      (new Date(coe.bidding_date) >= earliestDate && coeCategories.includes(coe.coe_type)) ||
      checkedKeys.length === 0,
  );

  // Concatenate the filtered COE data with msrpData
  msrpData.push(
    ...filteredCoeData.map((coe) => {
      return {
        key: `COE Category ${coe.coe_type}`,
        label: `COE Category ${coe.coe_type}`,
        date: formatDate(coe.bidding_date),
        msrp: coe.premium,
        coe_type: coe.coe_type,
      };
    }),
  );

  msrpData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    colorField: "label",
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

  const changePeriod = (value: string) => {
    console.log(value);
  };

  return (
    <>
      <Segmented
        options={["6 Months", "12 Months", "18 Months", "24 Months", "All Time"]}
        onChange={(value) => changePeriod(value)}
      />
      <Line {...config} />
    </>
  );
};

export default MSRPGraph;
