import {
  cardClass, tagClass, iconWrapClass, typeIcon, timeAgo
} from "../utils/helpers";

export default function NotificationCard({ item, isRead, onRead, rank }) {
  const cls = cardClass(item.Type);

  return (
    <div
      className={`notif-card ${cls} ${isRead ? "read" : "unread"}`}
      onClick={() => !isRead && onRead?.(item.ID)}
      title={isRead ? "" : "Click to mark as read"}
    >
      {rank && rank <= 3 && (
        <span className="rank-badge">#{rank}</span>
      )}

      <div className={iconWrapClass(item.Type)}>
        {typeIcon(item.Type)}
      </div>

      <div className="notif-body">
        <div className="notif-top">
          <span className={tagClass(item.Type)}>{item.Type}</span>
          {!isRead && <span className="notif-new-dot" title="Unread" />}
          <span className="notif-time">{timeAgo(item.Timestamp)}</span>
        </div>
        <p className="notif-message">{item.Message}</p>
      </div>
    </div>
  );
}
