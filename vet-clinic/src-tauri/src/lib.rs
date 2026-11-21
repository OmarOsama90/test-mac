use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // make sure the data folder exists before the first save
            std::fs::create_dir_all(app.path().app_data_dir()?)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Vet Clinic");
}
