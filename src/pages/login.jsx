import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { new_req, check_error } from "../network";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
export default function Login() {
	const navigate = useNavigate();
	const [loginData, setLoginData] = useState({ user_name: "", password: "" });
	const [messageApi, contextHolder] = message.useMessage();
	return (
		<div style={{minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
			<Form
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 16,
				}}
				style={{
					maxWidth: 600,
					width:500
				}}
				initialValues={{
					remember: true,
				}}
				onFinish={async () => {
					try {
						const req = await new_req();
						const res = await req.post(`/api/login`,{
							...loginData
						},{
							headers:{
								"Content-Type":"application/x-www-form-urlencoded"
							}
						});
						//console.log(res);
						if (res.data.code === 200) {
							window.localStorage.setItem("token", res.data.data.token);
							navigate("/home/current");
						} else {
							messageApi.error(`${res.data.data}`);
						}
					} catch (e) {
						check_error(e, messageApi, navigate);
					}
				}}
				onFinishFailed={() => { }}
				autoComplete="off"
			>
				<Form.Item
					label="用户名"
					name="user_name"
					rules={[
						{
							required: true,
							message: '请输入你的用户名!',
						},
					]}
				>
					<Input value={loginData.user_name} onChange={(e) => setLoginData({ ...loginData, user_name: e.target.value })} />
				</Form.Item>

				<Form.Item
					label="密码"
					name="password"
					rules={[
						{
							required: true,
							message: '请输入你的密码!',
						},
					]}
				>
					<Input.Password value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
				</Form.Item>

				<Form.Item wrapperCol={{
					offset: 8,
					span: 16,
				}}>
					<Button type="primary" htmlType="submit">
						登录
					</Button>
				</Form.Item>
			</Form>
			{contextHolder}
		</div>
	)
}