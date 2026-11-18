import { useRegisterSW } from "virtual:pwa-register/react";

export default function PwaUpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  function close() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  return (
    <aside className="pwa-toast" role="status" aria-live="polite">
      <strong>{needRefresh ? "NEW VERSION AVAILABLE" : "APP READY OFFLINE"}</strong>
      <p>{needRefresh ? "Update now to load the latest streetALA version." : "The app shell and public catalog have been cached."}</p>
      <div>
        {needRefresh && (
          <button className="button primary" type="button" onClick={() => updateServiceWorker(true)}>
            UPDATE NOW
          </button>
        )}
        <button className="button secondary" type="button" onClick={close}>LATER</button>
      </div>
    </aside>
  );
}
