import { createPortal } from "react-dom";
import { useNotifications } from "../hooks/useNotifications";

type TopBarNotificationsProps = {
    top: number;
    left: number;
    width: number;
    contentMaxHeight: number;
    nowTimestamp: number;
};

export const TopBarNotifications = ({ top, left, width, contentMaxHeight, nowTimestamp }: TopBarNotificationsProps) => {
    const notifications = useNotifications(nowTimestamp);

    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div
            className="fixed z-[320] overflow-hidden rounded-[24px] border border-[rgba(195,198,214,0.25)] bg-white shadow-[0_20px_40px_0_rgba(19,27,46,0.14)]"
            style={{ top, left, width }}
        >
            <div className="border-b border-[rgba(195,198,214,0.22)] px-4 py-3">
                <p className="[font-family:'Inter-SemiBold',Helvetica] text-[13px] font-semibold text-[#131b2e]">
                    Notificaciones
                </p>
            </div>

            <div className="overflow-y-auto p-2" style={{ maxHeight: contentMaxHeight }}>
                {notifications.length === 0 ? (
                    <div className="rounded-[16px] px-3 py-4 text-[13px] text-[#64748b]">
                        No hay notificaciones por ahora.
                    </div>
                ) : (
                    notifications.map((item) => (
                        <div
                            key={item.id}
                            className={`mb-1 rounded-[16px] px-3 py-3 ${
                                item.level === "high"
                                    ? "bg-[#fff1f0]"
                                    : item.level === "medium"
                                        ? "bg-[#fff8e8]"
                                        : "bg-[#f4f7ff]"
                            }`}
                        >
                            <p className="[font-family:'Inter-SemiBold',Helvetica] text-[13px] font-semibold text-[#131b2e]">
                                {item.title}
                            </p>
                            <p className="mt-1 [font-family:'Inter-Regular',Helvetica] text-[12px] text-[#475569]">
                                {item.detail}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>,
        document.body,
    );
};
