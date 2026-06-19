import { 
  Eye, 
  MousePointer, 
  ChevronsDown, 
  Gauge, 
  Clock, 
  Monitor, 
  Globe 
} from "lucide-react";

export default function SessionTimeline({ session, events, onClose }) {
  if (!session || !events) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "page_view":
        return <Eye className="h-3.5 w-3.5 text-emerald-500" />;
      case "click":
        return <MousePointer className="h-3.5 w-3.5 text-blue-500" />;
      case "scroll":
        return <ChevronsDown className="h-3.5 w-3.5 text-amber-500" />;
      case "performance":
        return <Gauge className="h-3.5 w-3.5 text-pink-500" />;
      default:
        return <Globe className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  const getEventTitle = (event) => {
    switch (event.event_type) {
      case "page_view":
        return (
          <span>
            Visited page <code className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono text-[11px] font-semibold">{event.page_url}</code>
          </span>
        );
      case "click":
        return (
          <span>
            Clicked coordinate <span className="text-blue-600 font-bold font-mono">({event.x}px, {event.y}px)</span> on <code className="text-slate-600 font-mono text-[11px]">{event.page_url}</code>
          </span>
        );
      case "scroll":
        return (
          <span>
            Scrolled <span className="text-amber-600 font-bold font-mono">{event.scroll_depth}%</span> of page <code className="text-slate-600 font-mono text-[11px]">{event.page_url}</code>
          </span>
        );
      case "performance":
        return (
          <span>
            Page fully loaded in <span className="text-pink-600 font-bold font-mono">{event.load_time_ms}ms</span>
          </span>
        );
      default:
        return <span>Triggered {event.event_type} event</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-100 w-full md:w-[450px] shadow-2xl fixed md:relative right-0 top-0 bottom-0 z-50">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h3 className="font-extrabold text-base text-slate-800">Session Timeline</h3>
          <p className="text-[10px] text-slate-400 font-mono mt-1 select-all truncate max-w-[240px] md:max-w-[300px]">
            ID: {session.session_id}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
        >
          Close &times;
        </button>
      </div>

      {/* Device Metadata Summary */}
      <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/60 grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Browser</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Globe className="h-3.5 w-3.5 text-blue-500" />
            {session.browser}
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Platform</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Monitor className="h-3.5 w-3.5 text-indigo-500" />
            {session.os}
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Duration</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Clock className="h-3.5 w-3.5 text-pink-500" />
            {session.duration_seconds}s
          </div>
        </div>
      </div>

      {/* Event Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
        <div className="relative border-l-2 border-slate-200 pl-6 ml-3 space-y-6">
          {events.map((event, index) => (
            <div key={event._id || index} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-[36px] top-1 h-6 w-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center group-hover:border-blue-500 transition-colors duration-300">
                {getEventIcon(event.event_type)}
              </div>
              
              {/* Event card */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow transition-all duration-350">
                <div className="flex justify-between items-start mb-1.5 gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {event.event_type.replace("_", " ")}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold font-mono">
                    {formatDate(event.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {getEventTitle(event)}
                </p>
                {event.window_width && (
                  <p className="text-[9px] text-slate-400 mt-1 font-mono font-medium">
                    Viewport: {event.window_width}x{event.window_height}px
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
