import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

function getPushLink(payload) {
  return String(payload?.data?.link || payload?.fcmOptions?.link || "").trim();
}

function openPushLink(link, navigate) {
  if (!link) {
    return;
  }

  try {
    const target = new URL(link, window.location.origin);

    if (target.origin === window.location.origin) {
      navigate(`${target.pathname}${target.search}${target.hash}`);
      return;
    }

    window.location.assign(target.href);
  } catch {
    navigate(link);
  }
}

export default function PushNotificationBootstrap() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

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
          const link = getPushLink(payload);

          if (!link) {
            void showSuccessToast(`${message.title}: ${message.body}`);
            return;
          }

          void Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: message.title,
            text: message.body,
            showCancelButton: true,
            confirmButtonText: "Open order",
            cancelButtonText: "Dismiss",
            timer: 7000,
            timerProgressBar: true,
          }).then((result) => {
            if (result.isConfirmed) {
              openPushLink(link, navigate);
            }
          });
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
  }, [isLoggedIn, navigate, user?.id]);

  return null;
}
