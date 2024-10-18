import { Layout, Menu, Avatar, Popconfirm } from 'antd';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./home.css";
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { NodeIndexOutlined, ApartmentOutlined, SettingOutlined, FieldStringOutlined, UsergroupAddOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;


export default function Home() {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectKey, setSelectKey] = useState("/home");
	useEffect(() => {
		//console.log(location);
		setSelectKey(location.pathname);
	}, [location]);

	const items = [
		{
			key: '/home/current',
			label: "本地节点",
			icon: <NodeIndexOutlined />
		},
		{
			key: '/home/group',
			label: "组信息",
			icon: <ApartmentOutlined />
		},
		{
			key: '/home/nodes',
			label: "节点搜索",
			icon: <ApartmentOutlined />
		},
	];
	return (
		<div className='home-page'>
			<Layout className='whole-layout'>
				<Sider>
					<div className="demo-logo-vertical" />
					<Menu theme="dark" mode="inline" selectedKeys={[selectKey]} items={items} onClick={(e) => {
						//console.log(e);
						navigate(`${e.key}`)
					}} />
				</Sider>
				<Layout className='main-layout'>
					<Header
						style={{
							padding: 0,
							background: `#FFF`,
						}}
					>
					</Header>
					<Content
						style={{
							margin: '12px 16px 12px',
						}}
						className='main-content'
					>
						<div className='main-stage'>
							<div
								className='inner-main-stage'
							>
								<div style={{ padding: 8, minHeight: 360 }}>
									<Outlet />
								</div>
							</div>
						</div>
					</Content>
					<Footer
						style={{
							textAlign: 'center',
							background: `#FFF`,
						}}
					>
						NetLink-APP ©{new Date().getFullYear()}
					</Footer>
				</Layout>
			</Layout>
		</div>
	);
}