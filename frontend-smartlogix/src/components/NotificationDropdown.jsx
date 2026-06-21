import { useState, useRef, useEffect } from 'react';
import { getDashboard } from '../facade/BffFacade';

const TYPE_CONFIG = {
  order: {
    color: "bg-blue-50 text-blue-600",
  },
  stock: {
    color: "bg-amber-50 text-amber-600",
  },
  ship: {
    color: "bg-violet-50 text-violet-600",
  },
  user: {
    color: "bg-slate-100 text-slate-500",
  },
};

export default function NotificationDropdown({ onCountChange }) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastEventIds = useRef(new Set());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getDashboard();
        const feed = data.activityFeed || [];
        const newEvents = feed.filter(e => !lastEventIds.current.has(e.id));
        if (newEvents.length > 0) {
          setUnreadCount(prev => prev + newEvents.length);
          newEvents.forEach(e => lastEventIds.current.add(e.id));
        }
        setEvents(feed.slice(0, 8));
      } catch {}
    };
    fetchEvents();
    const id = setInterval(fetchEvents, 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    onCountChange?.(unreadCount);
  }, [unreadCount]);

  const handleToggle = () => {
    setOpen(!open);
    if (!open) setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button onClick={handleToggle} className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Notificaciones</h3>
              {unreadCount > 0 && (
                <button onClick={() => setUnreadCount(0)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Marcar como leídas
                </button>
              )}
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {events.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-400 text-sm">No hay notificaciones</div>
              ) : events.map((event) => {
                const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.user;
                return (
                  <div key={event.id} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                    <div className="flex items-start gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${config.color}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          {event.type === 'order' && <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>}
                          {event.type === 'stock' && <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />}
                          {event.type === 'ship' && <><rect x="1" y="3" width="15" height="13" rx="1" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>}
                          {event.type === 'user' && <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>}
                          {!event.type && <rect x="3" y="3" width="18" height="18" rx="2" />}
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-600">{event.msg}</p>
                        <span className="text-xs text-slate-400">{event.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
