import React, {useState} from 'react';
import {Button, Card, Input, Row, Space, Tabs} from "antd";

const {TabPane} = Tabs;

export interface CreateJoinContainerProp {
  visible: boolean;
  onCreateRoom: (roomId?: string) => void;
}

export const RoomCreateOptionContainer = (props: CreateJoinContainerProp) => {

  const [roomId, setRoomId] = useState('');
  return props.visible ? <Card>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Create" key="1">
        <Button onClick={() => props.onCreateRoom()}> Start </Button>
      </TabPane>
      <TabPane tab="Join" key="2">
        <Space>
          <Row>
            <Input onChange={(event => setRoomId(event.target.value))}
                   placeholder={'Enter Room ID'}/>
          </Row>
          <Row>
            <Button onClick={() => {
              if (roomId.trim().length > 0) {
                props.onCreateRoom(roomId);
              }
            }}> Join </Button>
          </Row>
        </Space>
      </TabPane>
    </Tabs>
  </Card> : null
};