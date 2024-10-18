import { ConfigProvider} from 'antd';
import {
	RouterProvider,
  } from "react-router-dom";
import zhCN from 'antd/locale/zh_CN';
import {router} from "./route";
import './App.css';

function App() {

  return (
	<ConfigProvider locale={zhCN}>
		<RouterProvider router={router}></RouterProvider>
	</ConfigProvider>
  );
}

export default App;