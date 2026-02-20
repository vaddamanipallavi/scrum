"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: string;
  type: string;
  message: string;
  timestamp: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = (await response.json()) as { notifications: Notification[] };
        setNotifications(data.notifications);
      }
    };

    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        aria-label="Notifications"
      >
        🔔
        {notifications.length > 0 ? (
          <span className="absolute right-0 top-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {notifications.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <div className="max-h-96 overflow-y-auto p-4">
            {notifications.length === 0 ? (
              <p className="text-xs text-zinc-500">No notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {notif.message}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
