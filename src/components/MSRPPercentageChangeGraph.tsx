import { Bar, BarConfig } from "@ant-design/charts";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../providers/DataContextProvider";
import { Select, SelectProps } from "antd";
import { formatDate } from "../utils/date.utils";

const MSRPPercentageChangeGraph: React.FC = () => {
  const { selectedCarData, checkedKeys, coeData, coeTypes } = useContext(DataContext);
  const [msrpPercentageChangeData, setmsrpPercentageChangeData] = useState<
    {
      key: string;
      label: string;
      date: string;
      msrp_percentage_change: number;
      coe_type: string | null;
    }[]
  >([]);
  const [config, setConfig] = useState<BarConfig>({});
  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const initMsrpPercentageChangeData = selectedCarData.flatMap((carModel) => {
    return carModel.CarSubmodels.flatMap((carSubmodel) => {
      return carSubmodel.CarPrices.map((carPrice, index) => {
        const previousPrice = index > 0 ? carSubmodel.CarPrices[index - 1].price : carPrice.price;
        return {
          key: `${carModel.model_id}-${carSubmodel.submodel_id}`,
          label: `${carModel.model} ${carSubmodel.submodel}${carModel.is_parallel_imported ? " (PI)" : ""}`,
          date: formatDate(carPrice.date),
          msrp_percentage_change: (carPrice.price - previousPrice) / previousPrice,
          coe_type: carSubmodel.coe_type,
        };
      });
    });
  });

  // Earliest date in the MSRP data
  const earliestDate = new Date(
    Math.min(...initMsrpPercentageChangeData.map((entry) => new Date(entry.date).getTime())),
  );

  // COE categories selected
  const coeCategories = Array.from(
    new Set(initMsrpPercentageChangeData.map((entry) => entry.coe_type)),
  );

  // Filter COE data based on the earliest date. Else, return all COE data if no car models are selected
  const filteredCoeData = coeData.filter(
    (coe) =>
      (new Date(coe.bidding_date) >= earliestDate && coeCategories.includes(coe.coe_type)) ||
      checkedKeys.length === 0,
  );

  // Concatenate the filtered COE data with MSRP data
  coeTypes.forEach((coeType) => {
    const currCoeTypeData = filteredCoeData.filter((coe) => coe.coe_type === coeType);
    currCoeTypeData.forEach((coe, index) => {
      const previousCoePremium = index > 0 ? currCoeTypeData[index - 1].premium : coe.premium;
      initMsrpPercentageChangeData.push({
        key: `COE Category ${coe.coe_type}`,
        label: `COE Category ${coe.coe_type}`,
        date: formatDate(coe.bidding_date),
        msrp_percentage_change: (coe.premium - previousCoePremium) / previousCoePremium,
        coe_type: coe.coe_type,
      });
    });
  });

  useEffect(() => {
    setOptions(
      Array.from(new Set(filteredCoeData.map((entry) => formatDate(entry.bidding_date))))
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map((bidding_date) => ({
          value: bidding_date,
          label: bidding_date,
        })),
    );
  }, [selectedCarData]);

  useEffect(() => {
    const filteredMsrpPercentageChangeData = initMsrpPercentageChangeData.filter(
      (entry) => entry.date === selectedDate,
    );
    setmsrpPercentageChangeData(filteredMsrpPercentageChangeData);
  }, [selectedCarData, selectedDate]);

  useEffect(() => {
    setConfig({
      title: {
        title: "MSRP Delta",
        style: {
          align: "center",
          titleFontSize: 36,
        },
      },
      forceFit: true,
      padding: "auto",
      data: msrpPercentageChangeData,
      xField: "label",
      yField: "msrp_percentage_change",
      label: {
        position: "right",
        text: "msrp_percentage_change",
        formatter: ".01%",
        style: {
          fill: "#000",
        },
      },
      axis: {
        y: {
          labelFormatter: ".0%",
        },
      },
      responsive: true,
    });
  }, [msrpPercentageChangeData]);

  const changePeriod = (value: string) => {
    setSelectedDate(value);
  };

  return (
    <>
      <Select
        value={selectedDate}
        style={{ width: 120 }}
        allowClear
        onChange={changePeriod}
        options={options}
      />
      <Bar {...config} />
    </>
  );
};

export default MSRPPercentageChangeGraph;
