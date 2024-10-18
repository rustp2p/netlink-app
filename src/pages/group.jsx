import { Button, Table, message, Row, Col, Tag ,Input} from 'antd';
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
	const [groupInfo, setGroupInfo] = useState([]);
	const columns = [
		{
			title: '组名',
			dataIndex: 'group_code',
			key: 'group_code',
		},
		{
			title: '节点数',
			dataIndex: 'node_num',
			key: 'node_num',
		},
	];

	useEffect(() => {
		const fetch = async () => {
			try {
				const req = await new_req();
				const res = await req.get(`/api/groups`);
				//console.log(res);
				setGroupInfo(res.data.data);
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
			<div style={{ marginTop: 10 }}>
				<div>
					<Table size='small' pagination={false} columns={columns} dataSource={groupInfo} rowKey="group_code" />
				</div>
			</div>
			{contextHolder}
		</div>
	);
}