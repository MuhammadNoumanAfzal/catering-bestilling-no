import AppRouter from "./app/router/AppRouter";
import PushNotificationBootstrap from "./components/push/PushNotificationBootstrap";

export default function App() {
  return (
    <>
      <PushNotificationBootstrap />
      <AppRouter />
    </>
  );
}
