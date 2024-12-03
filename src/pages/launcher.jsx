import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Button, Form, Input ,message} from 'antd';
import { useEffect, useState } from 'react';
import { new_req, check_error } from "../network";
export default function Launcher() {
	const navigate = useNavigate();
	const [messageApi, contextHolder] = message.useMessage();
	useEffect(()=>{
		//const token = window.localStorage.getItem("token");
		const check_me = async ()=>{
			try {
				const req = await new_req();
				const res = await req.get(`/api/check`);
				//console.log(res);
				if (res.data.code === 200) {
					navigate("/home/current");
				} else {
					messageApi.error(`未登录`);
					setTimeout(()=>{
						navigate("/login");
					},500);
				}
			} catch (e) {
				check_error(e, messageApi, navigate);
			}
		}
		check_me();
	},[navigate]);
	return <div>{contextHolder}</div>
}