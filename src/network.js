import axios from "axios";
import { invoke } from '@tauri-apps/api/core';


export const new_req = async function () {
	const api_url = window.__TAURI_INTERNALS__? await invoke("get_api_url"):window.api_url;
	//console.log(api_url);
	const req = axios.create({
		baseURL: `${api_url}`,
		timeout: 5000,
	});
	req.interceptors.request.use(async function (config) {
		// 在发送请求之前做些什么
		//console.log("config == ", config);
		try {
			// const token = await localforage.getItem("token");
			// config["headers"]["Authorization"] = `Bearer ${token}`;
		} catch (e) {

		}
		return config;
	}, function (error) {
		// 对请求错误做些什么
		throw error;
	});

	req.interceptors.response.use(function (response) {
		// 对响应数据做点什么
		//console.log("网络错误",response)
		// if (response.status !== 200) {
		// 	return Promise.reject("接口错误");
		// }
		// if (response.data.code === 400) {
		// 	return Promise.reject("接口错误");
		// }
		return response;
	}, function (error) {
		// 对响应错误做点什么
		return Promise.reject(error);
	});
	return req;
}

export const req = axios.create({
	baseURL: `${window.api_url}`,
	timeout: 5000,
});

req.interceptors.request.use(async function (config) {
	// 在发送请求之前做些什么
	//console.log("config == ", config);
	try {
		// const token = await localforage.getItem("token");
		// config["headers"]["Authorization"] = `Bearer ${token}`;
	} catch (e) {

	}
	return config;
}, function (error) {
	// 对请求错误做些什么
	throw error;
});

req.interceptors.response.use(function (response) {
	// 对响应数据做点什么
	if (response.status !== 200) {
		console.log("网络错误")
		return Promise.reject("接口错误");
	}
	if (response.data.code === 400) {
		return Promise.reject("接口错误");
	}
	return response;
}, function (error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});


export const check_error = (e, message, navigator) => {
	if (e && e.response) {
		//console.log(e.response);
		if (e.response.status === 404) {
			message.error(`${e.response.statusText}`);
		}
	} else if (e) {
		message.error(`${e}`);
	}
}
