import { Button, Table, message, Row, Col, Tag, Input ,notification} from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate, } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { new_req, check_error } from "../network";
const { Search } = Input;
export default function Group() {
	const navigate = useNavigate();
	const page = useRef({
		current: 1,
		total: 0,
		pageSize: 15
	});

	const [messageApi, contextHolder] = message.useMessage();
	const [pageReload, setPageReload] = useState(1);
	const [nodesList, setNodesList] = useState([]);
	const [searchKey,setSearchKey] = useState("");
	const [api, NotificationContext] = notification.useNotification();
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
				if(searchKey===""){
					setNodesList([]);
					return;
				}
				const req = await new_req();
				const res = await req.get(`/api/nodes-by-group/${searchKey}`);
				//console.log(res);
				if(res.data.code===200){
					setNodesList(res.data.data.map((item,key)=>{
						return {id:key,...item};
					}));
				}else if (res.data.code === 503) {
					api.error({
						key: "shutdown",
						message: '提示',
						description: '节点尚未启动',
					});
				} else {
					messageApi.error(`${res.data.data}`);
				}
			} catch (e) {
				//console.log(e);
				check_error(e, messageApi, navigate);
			}
		};
		fetch();
	}, [pageReload, messageApi, navigate,searchKey]);

	return (
		<div>
			<div style={{ marginTop: 10 }}>
				<div style={{width:450,marginBottom:10}}>
					<Search allowClear placeholder="输入组名进行搜索" onSearch={(e)=>{
						setSearchKey(e);
					}} />
				</div>
				<div>
					<Table size='small' pagination={false} columns={columns} dataSource={nodesList} rowKey="id" />
				</div>
			</div>
			{contextHolder}
			{NotificationContext}
		</div>
	);
}