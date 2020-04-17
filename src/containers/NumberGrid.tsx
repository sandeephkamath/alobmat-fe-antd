import {Button, Row, Space} from "antd";
import React from "react";

export interface NumberGridProps {
  selectedNumbers: Array<number>;
  onNumberPick: (num: number) => void;
}

export const NumberGrid = (props: NumberGridProps) => {

  const range = (start: number, end: number) => Array.from({length: (end - start)}, (v, k) => k + start);

  const getNumberButton = (num: number) => {
    return (<Button disabled={props.selectedNumbers.indexOf(num) > -1}
                    value={num}
                    onClick={() => props.onNumberPick(num)}
                    style={{width: '80px'}}>{num}</Button>);
  };

  const getRow = (start: number, end: number) => {
    return <Space>{range(start, end).map(num => getNumberButton(num))}</Space>;
  };

  return <div>{range(0.1, 10).map(num => <Row
      style={{marginBottom: '10px'}}>{getRow(num * 10, num * 10 + 10)}</Row>)}</div>;
};