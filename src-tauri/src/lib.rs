#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![chat_api])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn chat_api(message: String) -> Result<String, String> {
  // This is a placeholder. In a real application, you would send this message
  // to an AI model and return its response.
  println!("Received message from frontend: {}", message);
  Ok(format!("Echo from backend: {}", message))
}
