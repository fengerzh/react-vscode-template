import { createRoot } from "react-dom/client";
import App from "./App";
import "./tailwind/tailwind.css";

const container = document.getElementById("root");
if (container) {
  // 临时禁用StrictMode，等待antd团队解决问题
  // <React.StrictMode>
  createRoot(container).render(<App />); // </React.StrictMode>
}
