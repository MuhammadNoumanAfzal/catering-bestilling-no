import { useEffect } from "react";
import { useAuth } from "../../features/auth";
import { graphqlRequest } from "../../lib/api/graphqlClient";
import { startFirebasePush } from "../../lib/push/firebasePush";
import { showSuccessToast } from "../../utils/alerts";

const REGISTER_DEVICE_TOKEN_MUTATION = `
  mutation RegisterDeviceToken($deviceToken: String!, $deviceType: String!) {
    deviceToken(deviceToken: $deviceToken, deviceType: $deviceType) {
      success
      message
    }
  }
`;

function getMessage(payload) {
  return {
    title: payload?.notification?.title || payload?.data?.title || "New notification",
    body: payload?.notification?.body || payload?.data?.body || "You have a new update.",
  };
}

export default function PushNotificationBootstrap() {
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      return undefined;
    }

    let unsubscribe = () => {};
    let isDisposed = false;
    const storageKey = `gocatering:fcm:customer:${user.id}`;

    async function enablePush() {
      try {
        const { token, unsubscribe: stopListening } = await startFirebasePush((payload) => {
          const message = getMessage(payload);
          showSuccessToast(`${message.title}: ${message.body}`);
        });
        unsubscribe = stopListening;

        if (!token || window.localStorage.getItem(storageKey) === token || isDisposed) {
          return;
        }

        const result = await graphqlRequest({
          query: REGISTER_DEVICE_TOKEN_MUTATION,
          variables: { deviceToken: token, deviceType: "WEB" },
        });
        const payload = result?.deviceToken;

        if (!payload?.success) {
          throw new Error(payload?.message || "Unable to register this device for notifications.");
        }

        window.localStorage.setItem(storageKey, token);
      } catch (error) {
        // Push must never interrupt sign-in when the user declines permission or config is unavailable.
        console.warn("Firebase push setup was skipped:", error?.message || error);
      }
    }

    void enablePush();
    return () => {
      isDisposed = true;
      unsubscribe();
    };
  }, [isLoggedIn, user?.id]);

  return null;
}
