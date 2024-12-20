import { Button, Table, message, Row, Col, Tag, Space, Modal, Form, Input, Popconfirm, notification, Select } from 'antd';
import { SettingOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
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

	const default_config = {
		config_name: "default",
		group_code: null,
		node_ipv4: null,
		prefix: 24,
		node_ipv6: null,
		prefix_v6: 96,
		mtu: 1400,
		group_code_filter: null,
		group_code_filter_regex: null,
		port: 23333,
		tun_name: null,
		encrypt: null,
		algorithm: "chacha20-poly1305",
		bind_dev_name: null,
		exit_node: null,
		peer: [],
		udp_stun: null,
		tcp_stun: null
	};
	const [messageApi, contextHolder] = message.useMessage();
	const [pageReload, setPageReload] = useState(1);
	const [currentInfo, setCurrentInfo] = useState({});
	const [nodeInfo, setNodeInfo] = useState([]);
	const [configOpen, setConfigOpen] = useState(false);
	const [currentConfig, setCurrentConfig] = useState(default_config);
	const [loadingConfig, setLoadingConfig] = useState(false);
	const [formHandler] = Form.useForm();
	const [api, NotificationContext] = notification.useNotification();
	const hasError1 = useRef(false);
	const hasError2 = useRef(false);
	const [encryptOption, setEncryptOption] = useState([]);
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
				const res = await req.get(`/api/application-info`);
				//console.log(res);
				if (res.data.code === 200) {
					setEncryptOption(res.data.data.algorithm_list);
				} else if (res.data.code === 503) {
					api.error({
						key: "shutdown",
						message: '提示',
						description: '节点尚未启动',
					});
				} else {
					messageApi.error(`${res.data.data}`);
				}
			} catch (e) {
				check_error(e, messageApi, navigate);
			}
		};
		fetch();
	}, [])

	useEffect(() => {
		const fetch = async () => {
			try {
				const req = await new_req();
				const res = await req.get(`/api/current-info`);
				//console.log(res);
				if (res.data.code === 200) {
					setCurrentInfo(res.data.data);
					hasError1.current = false;
				} else if (res.data.code === 503) {
					api.error({
						key: "shutdown",
						message: '提示',
						description: '节点尚未启动',
					});
					hasError1.current = true;
				} else {
					messageApi.error(`${res.data.data}`);
					hasError1.current = true;
				}
			} catch (e) {
				check_error(e, messageApi, navigate);
				hasError1.current = true;
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
				if (res.data.code === 200) {
					setNodeInfo(res.data.data);
					hasError2.current = false;
				} else if (res.data.code === 503) {
					api.error({
						key: "shutdown",
						message: '提示',
						description: '节点尚未启动',
					});
					hasError2.current = true;
				} else {
					messageApi.error(`${res.data.data}`);
					hasError2.current = true;
				}
			} catch (e) {
				check_error(e, messageApi, navigate);
				hasError2.current = true;
			}
		};
		fetch();
	}, [pageReload, messageApi, navigate]);

	useEffect(() => {
		const time_id = setInterval(() => {
			if (hasError2.current || hasError1.current) {
				return;
			}
			setPageReload(r => r + 1);
		}, [2000]);
		return () => {
			clearInterval(time_id);
		}
	}, []);

	return (
		<div>
			<div style={{ marginTop: 10, paddingBottom: 20 }}>
				<div>
					<Space>
						<Button type="primary" loading={loadingConfig} icon={<SettingOutlined />} onClick={async () => {
							setLoadingConfig(true);
							try {
								const req = await new_req();
								const res = await req.get(`/api/current-config`);
								if (res.data.code === 200) {
									const current_config = res.data.data === null ? default_config : res.data.data;
									current_config.group_code_filter = current_config.group_code_filter === null ? "" : current_config.group_code_filter.join("\n");
									current_config.group_code_filter_regex = current_config.group_code_filter_regex === null ? "" : current_config.group_code_filter_regex.join("\n");
									setCurrentConfig(current_config);
									formHandler.setFieldsValue({
										...current_config
									})
									setConfigOpen(true);
								} else {
									message.error(`${res.data.data}`);
								}
							} catch (e) {
								check_error(e, messageApi, navigate);
							}
							setLoadingConfig(false);
						}}>节点配置</Button>
						<Popconfirm
							title="提示"
							description="是否确定用当前配置启动节点?"
							onConfirm={async () => {
								setLoadingConfig(true);
								try {
									const req = await new_req();
									const res = await req.get(`/api/open`);
									if (res.data.code === 200) {
										hasError1.current = false;
										hasError2.current = false;
									} else {
										message.error(`${res.data.data}`);
									}
								} catch (e) {
									check_error(e, messageApi, navigate);
								}
								setLoadingConfig(false);
							}}
							okText="确定"
							cancelText="取消"
						>
							<Button loading={loadingConfig}>启动节点</Button>
						</Popconfirm>
						<Popconfirm
							title="提示"
							description="是否确定关闭当前节点?"
							onConfirm={async () => {
								setLoadingConfig(true);
								try {
									const req = await new_req();
									const res = await req.get(`/api/close`);
									if (res.data.code === 200) {
									} else {
										message.error(`${res.data.data}`);
									}
								} catch (e) {
									check_error(e, messageApi, navigate);
								}
								setLoadingConfig(false);
							}}
							okText="确定"
							cancelText="取消"
						>
							<Button danger loading={loadingConfig}>关闭节点</Button>
						</Popconfirm>
					</Space>
				</div>
				<div>
					<h3>当前节点信息：</h3>
					<div style={{ padding: 8 }}>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>NAT类型：</Col>
							<Col>{currentInfo?.nat_type}</Col>
						</Row>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>虚拟IP(V4)：</Col>
							<Col>{currentInfo?.node_ip}</Col>
						</Row>
						<Row style={{ marginBottom: 5 }}>
							<Col span={6}>本地IP(V4)：</Col>
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
									currentInfo?.local_udp_ports?.map((item, key) => {
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
									currentInfo?.public_ips?.map((item, key) => {
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
									currentInfo?.public_udp_ports?.map((item, key) => {
										return <Tag key={key}>{item}</Tag>
									})
								}
							</Col>
						</Row>
					</div>
				</div>
				<div style={{ marginTop: 10 }}>
					<h3>可达节点：</h3>
					<Table columns={columns} dataSource={nodeInfo} size='small' pagination={false} rowKey="node_id"></Table>
				</div>
				<Modal title="节点配置" open={configOpen} onCancel={() => setConfigOpen(false)} footer={false}>
					<Form
						name="basic"
						form={formHandler}
						labelCol={{
							span: 8,
						}}
						wrapperCol={{
							span: 16,
						}}
						style={{
							maxWidth: 600,
						}}
						onFinish={async () => {
							setLoadingConfig(true);
							try {
								const req = await new_req();
								const group_code_filter = currentConfig.group_code_filter;
								const group_code_filter_regex = currentConfig.group_code_filter_regex
								currentConfig.group_code_filter_regex = group_code_filter_regex === "" ? null : group_code_filter_regex.replace(/\r/gi,"\n").split("\n").map((e) => { return e.trim() }).filter((e) => e !== "");
								currentConfig.group_code_filter = group_code_filter === "" ? null : group_code_filter.replace(/\r/gi,"\n").split("\n").map((e) => { return e.trim() }).filter((e) => e !== "");
								currentConfig.mtu = currentConfig.mtu ? parseInt(currentConfig.mtu) : null;
								currentConfig.node_ipv6 = currentConfig.node_ipv6 ? currentConfig.node_ipv6 : null;
								const res = await req.post(`/api/update-config`, {
									...currentConfig
								});
								if (res.data.code === 200) {
									message.success("提交成功");
									setConfigOpen(false);
								} else {
									message.error(`${res.data.data}`);
								}
							} catch (e) {
								check_error(e, messageApi, navigate);
							}
							setLoadingConfig(false);
						}}
						autoComplete="off"
					>
						<Form.Item
							label="配置名"
							name="config_name"
							rules={[
								{
									required: true,
									message: '请输入配置名',
								},
							]}
						>
							<Input value={currentConfig.config_name} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									config_name: e.target.value
								})
							}} />
						</Form.Item>

						<Form.Item
							label="所在组"
							name="group_code"
							rules={[
								{
									required: true,
									message: '请输入组名',
								},
							]}
						>
							<Input value={currentConfig.group_code} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									group_code: e.target.value
								})
							}} />
						</Form.Item>

						<Form.Item
							label="节点地址(V4)"
							name="node_ipv4"
							rules={[
								{
									required: true,
									message: '请输入节点地址',
								},
							]}
						>
							<Input value={currentConfig.node_ipv4} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									node_ipv4: e.target.value
								})
							}} />
						</Form.Item>

						<Form.Item
							label="V4掩码"
							name="prefix"
							rules={[
								{
									required: true,
									message: '请输入V4掩码',
								},
							]}
						>
							<Input value={currentConfig.prefix} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									prefix: parseInt(e.target.value)
								})
							}} />
						</Form.Item>

						<Form.Item
							label="本地绑定端口"
							name="port"
							rules={[
								{
									required: true,
									message: '请输入本地绑定端口',
								},
							]}
						>
							<Input value={currentConfig.port} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									port: parseInt(e.target.value)
								})
							}} />
						</Form.Item>

						<Form.Item
							label="节点地址(V6)"
							name="node_ipv6"
						>
							<Input value={currentConfig.node_ipv6} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									node_ipv6: e.target.value
								})
							}} />
						</Form.Item>

						<Form.Item
							label="V6掩码"
							name="prefix_v6"
							rules={[
								{
									required: false,
									message: '请输入V6掩码',
								},
							]}
						>
							<Input value={currentConfig.prefix_v6} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									prefix_v6: parseInt(e.target.value)
								})
							}} />
						</Form.Item>

						<Form.Item
							label="MTU"
							name="mtu"
							rules={[
								{
									required: false,
									message: '请输入mtu大小',
								},
							]}
						>
							<Input value={currentConfig.mtu} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									mtu: e.target.value
								})
							}} />
						</Form.Item>

						<Form.Item
							label="虚拟网卡名"
							name="tun_name"
						>
							<Input value={currentConfig.tun_name} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									tun_name: e.target.value
								})
							}} />
						</Form.Item>

						<Form.Item
							label="加密秘钥"
							name="encrypt"
						>
							<Input value={currentConfig.encrypt} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									encrypt: e.target.value
								})
							}} />
						</Form.Item>

						<Form.Item
							label="加密算法"
							name="algorithm"
							rules={[
								{
									required: false,
									message: '请输入加密算法',
								},
							]}
						>
							<Select options={encryptOption.map((item) => { return { label: item, value: item } })} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									algorithm: e
								})
							}}></Select>
							{/* <Input value={currentConfig.algorithm} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									algorithm: e.target.value
								})
							}} /> */}
						</Form.Item>

						<Form.Item
							label="流量出口绑定网卡"
							name="bind_dev_name"
						>
							<Input value={currentConfig.bind_dev_name} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									bind_dev_name: e.target.value
								})
							}} />
						</Form.Item>

						<Form.Item
							label="流量出口网关"
							name="exit_node"
						>
							<Input value={currentConfig.exit_node} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									exit_node: e.target.value
								})
							}} />
						</Form.Item>

						<Form.Item
							label="远端节点"
						>
							<Space style={{ marginBottom: 5 }}>
								<Button icon={<PlusOutlined />} onClick={() => {
									currentConfig.peer.push("");
									setCurrentConfig({
										...currentConfig,
										peer: [...currentConfig.peer]
									})
								}}></Button>
								<Button icon={<MinusOutlined />} onClick={() => {
									currentConfig.peer.pop();
									setCurrentConfig({
										...currentConfig,
										peer: [...currentConfig.peer]
									})
								}}></Button>
							</Space>
							<Row>
								{
									currentConfig?.peer?.map((item, key) => {
										return <Col key={key} style={{ marginBottom: 5 }}>
											<Input value={item} onChange={(e) => {
												currentConfig.peer[key] = e.target.value;
												setCurrentConfig({
													...currentConfig,
													peer: [...currentConfig.peer]
												})
											}} /></Col>
									})
								}
							</Row>
						</Form.Item>
						<Form.Item
							label="白名单组(换行分割)"
							name="group_code_filter"
						>
							<Input.TextArea value={currentConfig.group_code_filter} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									group_code_filter: e.target.value
								})
							}} />
						</Form.Item>
						<Form.Item
							label="白名单组正则(换行分割)"
							name="group_code_filter_regex"
						>
							<Input.TextArea value={currentConfig.group_code_filter_regex} onChange={(e) => {
								setCurrentConfig({
									...currentConfig,
									group_code_filter_regex: e.target.value
								})
							}} />
						</Form.Item>
						<Form.Item
							wrapperCol={{
								offset: 8,
								span: 16,
							}}
						>
							<Button loading={loadingConfig} type="primary" htmlType="submit">
								提交配置
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			</div>
			{contextHolder}
			{NotificationContext}
		</div>
	);
}