// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::sync::OnceLock;

static API_URL:OnceLock<String> = OnceLock::new(); 

#[tauri::command]
fn get_api_url() -> String {
	API_URL.get_or_init(||match Config::from_config_file("./host.toml"){
		Ok(config)=>{
			config.host
		}
		Err(_e)=>{
			"http://127.0.0.1:23336".to_string()
		}
	}).to_owned()
}
use serde::Deserialize;
use config_file::FromConfigFile;
// use tauri::Manager;

#[derive(Deserialize)]
struct Config {
    host: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_api_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
