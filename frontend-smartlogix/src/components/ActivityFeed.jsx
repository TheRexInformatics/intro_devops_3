const TYPE_CONFIG = {
  order: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    color: "bg-blue-50 text-blue-600",
  },
  stock: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    color: "bg-amber-50 text-amber-600",
  },
  ship: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    color: "bg-violet-50 text-violet-600",
  },
  user: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    color: "bg-slate-100 text-slate-500",
  },
};

export default function ActivityFeed({ events }) {
  return (
    <ul className="divide-y divide-slate-50">
      {events.map((event) => {
        const config = TYPE_CONFIG[event.type] ?? TYPE_CONFIG.user;
        return (
          <li
            key={event.id}
            className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
          >
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
              {config.icon}
            </span>
            <p className="text-sm text-slate-600 flex-1">{event.msg}</p>
            <span className="text-xs text-slate-400 font-mono shrink-0">{event.time}</span>
          </li>
        );
      })}
    </ul>
  );
}
