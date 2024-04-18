import { Flex, Tree, TreeDataNode, TreeProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../utils/DataContextProvider";

const CarTree: React.FC = () => {
  const { data, setData, checkedKeys, setCheckedKeys } = useContext(DataContext);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  useEffect(() => {
    setTreeData(
      data.map((carBrand) => {
        return {
          title: carBrand.brand,
          key: carBrand.brand_id,
          children: carBrand.CarModels.flatMap((carModel) => {
            return carModel.CarSubmodels.map((carSubmodel) => {
              return {
                title: `${carModel.model} ${carSubmodel.submodel}`,
                key: `${carModel.model_id}-${carSubmodel.submodel_id}`,
              };
            });
          }),
        };
      }),
    );
  }, [data]);

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
