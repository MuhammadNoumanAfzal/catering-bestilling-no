import AppRouter from "./app/router/AppRouter";
import PushNotificationBootstrap from "./components/push/PushNotificationBootstrap";
import SmartsuppBootstrap from "./components/support/SmartsuppBootstrap";

export default function App() {
  return (
    <>
      <PushNotificationBootstrap />
      <SmartsuppBootstrap />
      <AppRouter />
    </>
  );
}
