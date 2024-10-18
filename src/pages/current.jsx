import { Button, Table, message, Row, Col, Tag } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate, } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { new_req, check_error } from "../network";

export default function Current() {
	const navigate = useNavigate();
	const page = useRef({
		current: 1,
		total: 0,
		pageSize: 15
	});

	const [messageApi, contextHolder] = message.useMessage();
	const [pageReload, setPageReload] = useState(1);
	const [currentInfo, setCurrentInfo] = useState({});
	const [nodeInfo, setNodeInfo] = useState([]);
	const columns = [
		{
			title: '节点ID',
			dataIndex: 'node_id',
			key: 'node_id',
		},
		{
			title: '下一跳点',
			dataIndex: 'next_hop',
			key: 'next_hop',
		},
		{
			title: '协议',
			dataIndex: 'protocol',
			key: 'protocol',
		},
		{
			title: 'metric',
			dataIndex: 'metric',
			key: 'metric',
		},
		{
			title: 'rtt',
			dataIndex: 'rtt',
			key: 'rtt',
		},
	];

	useEffect(() => {
		const fetch = async () => {
			try {
				const req = await new_req();
				const res = await req.get(`/api/current-info`);
				//console.log(res);
				setCurrentInfo(res.data.data);
			} catch (e) {
				check_error(e, messageApi, navigate);
			}
		};
		fetch();
	}, [pageReload, messageApi, navigate]);

	useEffect(() => {
		const fetch = async () => {
			try {
				const req = await new_req();
				const res = await req.get(`/api/current-nodes`);
				//console.log(res);
				setNodeInfo(res.data.data);
			} catch (e) {
				check_error(e, messageApi, navigate);
			}
		};
		fetch();
	}, [pageReload, messageApi, navigate]);

	useEffect(()=>{
		const time_id = setInterval(()=>{
			setPageReload(r=>r+1);
		},[2000]);
		return ()=>{
			clearInterval(time_id);
		}
	},[]);

	return (
		<div>
			<div style={{ marginTop: 10,paddingBottom:20 }}>
				<div>
					<h3>当前节点信息：</h3>
					<div style={{ padding: 8 }}>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>NAT类型：</Col>
							<Col>{currentInfo?.nat_type}</Col>
						</Row>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>虚拟IP(V4)：</Col>
							<Col>{currentInfo?.local_ipv4}</Col>
						</Row>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>IP(V6)：</Col>
							<Col>{currentInfo?.ipv6 === null ? '暂无' : currentInfo?.ipv6}</Col>
						</Row>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>本地UDP端口号：</Col>
							<Col>
								{
									currentInfo?.local_udp_ports?.map((item,key) => {
										return <Tag key={key}>{item}</Tag>
									})
								}
							</Col>
						</Row>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>本地TCP端口号：</Col>
							<Col>{currentInfo?.local_tcp_port}</Col>
						</Row>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>公网地址：</Col>
							<Col>
								{
									currentInfo?.public_ips?.map((item,key) => {
										return <Tag key={key}>{item}</Tag>
									})
								}
							</Col>
						</Row>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>公网TCP端口号：</Col>
							<Col>{currentInfo?.public_tcp_port}</Col>
						</Row>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>公网UDP端口号：</Col>
							<Col>
								{
									currentInfo?.public_udp_ports?.map((item,key) => {
										return <Tag key={key}>{item}</Tag>
									})
								}
							</Col>
						</Row>
					</div>
				</div>
				<div style={{marginTop:10}}>
					<h3>可达节点：</h3>
					<Table columns={columns} dataSource={nodeInfo} size='small' pagination={false} rowKey="node_id"></Table>
				</div>
			</div>
			{contextHolder}
		</div>
	);
}