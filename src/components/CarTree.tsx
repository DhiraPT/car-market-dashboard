import { Tree, TreeDataNode, TreeProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../providers/DataContextProvider";

const CarTree: React.FC = () => {
  const { carModelData, checkedKeys, setCheckedKeys } = useContext(DataContext);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  useEffect(() => {
    setTreeData(
      carModelData
        .reduce((acc, carModel) => {
          if (!carModel.CarBrands) {
            const existingOthersIndex = acc.findIndex((node) => node.title === "Others");
            if (existingOthersIndex === -1) {
              acc.push({
                key: "Others",
                title: "Others",
                children: carModel.CarSubmodels.map((carSubmodel) => ({
                  key: `${carModel.model_id}-${carSubmodel.submodel_id}`,
                  title: `${carModel.model} ${carSubmodel.submodel}${carModel.is_parallel_imported ? " (PI)" : ""}`,
                })),
              });
            } else {
              acc[existingOthersIndex]?.children?.push(
                ...carModel.CarSubmodels.map((carSubmodel) => ({
                  key: `${carModel.model_id}-${carSubmodel.submodel_id}`,
                  title: `${carModel.model} ${carSubmodel.submodel}${carModel.is_parallel_imported ? " (PI)" : ""}`,
                })),
              );
            }
          } else {
            const existingBrandIndex = acc.findIndex(
              (node) => node.title === carModel.CarBrands!.brand,
            );
            if (existingBrandIndex === -1) {
              acc.push({
                key: carModel.CarBrands.brand,
                title: carModel.CarBrands.brand,
                children: carModel.CarSubmodels.map((carSubmodel) => ({
                  key: `${carModel.model_id}-${carSubmodel.submodel_id}`,
                  title: `${carModel.model} ${carSubmodel.submodel}${carModel.is_parallel_imported ? " (PI)" : ""}`,
                })),
              });
            } else {
              acc[existingBrandIndex]?.children?.push(
                ...carModel.CarSubmodels.map((carSubmodel) => ({
                  key: `${carModel.model_id}-${carSubmodel.submodel_id}`,
                  title: `${carModel.model} ${carSubmodel.submodel}${carModel.is_parallel_imported ? " (PI)" : ""}`,
                })),
              );
            }
          }
          return acc;
        }, [] as TreeDataNode[])
        .sort((a, b) => {
          const titleA = typeof a.title === "string" ? a.title : "";
          const titleB = typeof b.title === "string" ? b.title : "";
          if (titleA === "Others") {
            return 1;
          }
          if (titleB === "Others") {
            return -1;
          }
          return titleA.localeCompare(titleB);
        }),
    );
  }, [carModelData]);

  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    console.log("onExpand", expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
    console.log("onCheck", checkedKeysValue);
    setCheckedKeys(checkedKeysValue as React.Key[]);
  };

  return (
    <>
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        selectable={false}
        treeData={treeData}
        className="car-tree"
      />
    </>
  );
};

export default CarTree;
