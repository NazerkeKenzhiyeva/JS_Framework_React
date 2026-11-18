import useOnlineStatus from "../hooks/useOnlineStatus.js";

export default function ConnectivityIndicator() {
  const online = useOnlineStatus();

  return (
    <div className={`connectivity-indicator ${online ? "is-online" : "is-offline"}`} role="status" aria-live="polite">
      <span aria-hidden="true" />
      {online ? "ONLINE" : "OFFLINE · CACHED DATA"}
    </div>
  );
}
