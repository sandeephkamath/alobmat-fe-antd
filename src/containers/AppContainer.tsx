import {Layout, Menu} from "antd";
import React, {useState} from "react";
import 'antd/dist/antd.css';
import {GameContainer} from "./GameContainer";
import {OpponentsChitContainer} from "./OpponentsChitContainer";
import {Player} from "../colyesues/entities";

const {Header, Content, Footer, Sider} = Layout;

export const AppContainer = () => {

  const [playerMap, setPlayerMap] = useState(new Map<string, Player>());

  return (
      <React.Fragment>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item>Alobmat</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Content style={{padding: '0 50px', minHeight: '100vh'}}>
            <GameContainer opponentsUpdate={setPlayerMap}/>
          </Content>
          <Sider width={'400px'} theme={"light"}>
            <OpponentsChitContainer opponentsMap={playerMap}/>
          </Sider>
        </Layout>
        <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
      </React.Fragment>
  );
};