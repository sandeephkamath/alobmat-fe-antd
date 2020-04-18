import {range} from "../util/Util";
import {Table} from "antd";
import React from "react";
import {ArraySchema} from "@colyseus/schema";
import {Block, Chit} from "../colyesues/entities";

export interface ChitContainerProps {
  chit: Chit;
}

export const ChitContainer = (props: ChitContainerProps) => {
  const header = range(0, 9).map(num => {
    return {
      dataIndex: `${num}`
    }
  });

  const chit = props.chit;

  const getRowValues = (row: ArraySchema<Block>) => {
    let rowIndex = 0;
    return range(0, 10).map(num => {
      const numRange = num * 10;
      const block = chit.firstRow[rowIndex];
      if (block) {
        const blockValue = block.value;
        //console.log(blockValue + " " + numRange);
        if (block.checked && (blockValue >= numRange && blockValue <= (numRange + 10))) {
          rowIndex = rowIndex + 1;
          return blockValue;
        }
        return "*";
      }
      return '*';
    });
  };

  // let values = chit.firstRow.map(block => block.checked ? block.value : '*');

  const firstRow = Object.assign({}, getRowValues(chit.firstRow));
  const secondRow = Object.assign({}, getRowValues(chit.secondRow));
  const thirdRow = Object.assign({}, getRowValues(chit.thirdRow));

  return (<Table
      showHeader={false}
      columns={header}
      pagination={false}
      dataSource={props.chit ? [firstRow, secondRow, thirdRow] : []}
      bordered
  />);
};