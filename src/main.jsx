import PageErrorBoundary from './components/shared/PageErrorBoundary.jsx';
import { recoverModuleLoad } from './utils/moduleLoadRecovery.js';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PageErrorBoundary><App /></PageErrorBoundary>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);

// Recover once per minute; repeated failures show a usable retry screen.
window.addEventListener('error',event=>recoverModuleLoad(event.message||''),true);
window.addEventListener('unhandledrejection',event=>recoverModuleLoad(event.reason));
