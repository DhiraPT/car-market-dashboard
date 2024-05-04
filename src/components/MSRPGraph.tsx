import { Line, LineConfig } from "@ant-design/charts";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../providers/DataContextProvider";
import { Segmented } from "antd";
import { formatDate } from "../utils/date.utils";

const MSRPGraph: React.FC = () => {
  const { selectedCarData, checkedKeys, coeData } = useContext(DataContext);
  const [msrpData, setMsrpData] = useState<
    { key: string; label: string; date: string; msrp: number; coe_type: string | null }[]
  >([]);
  const [config, setConfig] = useState<LineConfig>({});

  const initMsrpData = selectedCarData.flatMap((carModel) => {
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

  // Earliest date in the MSRP data
  const earliestDate = new Date(
    Math.min(...initMsrpData.map((entry) => new Date(entry.date).getTime())),
  );

  // COE categories selected
  const coeCategories = Array.from(new Set(initMsrpData.map((entry) => entry.coe_type)));

  // Filter COE data based on the earliest date. Else, return all COE data if no car models are selected
  const filteredCoeData = coeData.filter(
    (coe) =>
      (new Date(coe.bidding_date) >= earliestDate && coeCategories.includes(coe.coe_type)) ||
      checkedKeys.length === 0,
  );

  // Concatenate the filtered COE data with MSRP data
  initMsrpData.push(
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
  
  initMsrpData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  useEffect(() => {
    setMsrpData(initMsrpData);
  }, [selectedCarData]);

  useEffect(() => {
    setConfig({
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
          values: [0, 1],
        },
      },
      responsive: true,
      interaction: {
        legendFilter: false,
      },
    });
  }, [msrpData]);

  const changePeriod = (value: string) => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    const twelveMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    const eighteenMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    const twentyFourMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 6));

    const filteredMsrpData = initMsrpData.filter((entry) => {
      const date = new Date(entry.date);
      switch (value) {
        case "6 Months":
          return date >= sixMonthsAgo;
        case "12 Months":
          return date >= twelveMonthsAgo;
        case "18 Months":
          return date >= eighteenMonthsAgo;
        case "24 Months":
          return date >= twentyFourMonthsAgo;
        default:
          return true;
      }
    });
    setMsrpData(filteredMsrpData);
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
