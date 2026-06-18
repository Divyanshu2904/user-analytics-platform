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
        return <Eye className="h-4 w-4 text-emerald-400" />;
      case "click":
        return <MousePointer className="h-4 w-4 text-sky-400" />;
      case "scroll":
        return <ChevronsDown className="h-4 w-4 text-amber-400" />;
      case "performance":
        return <Gauge className="h-4 w-4 text-pink-400" />;
      default:
        return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEventTitle = (event) => {
    switch (event.event_type) {
      case "page_view":
        return (
          <span>
            Visited page <code className="text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded font-mono text-xs">{event.page_url}</code>
          </span>
        );
      case "click":
        return (
          <span>
            Clicked coordinate <span className="text-sky-400 font-semibold font-mono">({event.x}px, {event.y}px)</span> on <code className="text-gray-300 font-mono text-xs">{event.page_url}</code>
          </span>
        );
      case "scroll":
        return (
          <span>
            Scrolled <span className="text-amber-400 font-bold font-mono">{event.scroll_depth}%</span> of page <code className="text-gray-300 font-mono text-xs">{event.page_url}</code>
          </span>
        );
      case "performance":
        return (
          <span>
            Page fully loaded in <span className="text-pink-400 font-bold font-mono">{event.load_time_ms}ms</span>
          </span>
        );
      default:
        return <span>Triggered {event.event_type} event</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c1220] border-l border-gray-800 w-[450px] shadow-2xl relative z-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0c1220]">
        <div>
          <h3 className="font-bold text-base text-white">Session Timeline</h3>
          <p className="text-[11px] text-gray-400 font-mono mt-1 select-all truncate max-w-[340px]">
            ID: {session.session_id}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-2 rounded-lg transition-all"
        >
          &times; Close
        </button>
      </div>

      {/* Device Metadata Summary */}
      <div className="px-6 py-4 border-b border-gray-800 bg-[#0f172a]/30 grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Browser</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
            <Globe className="h-3.5 w-3.5 text-indigo-400" />
            {session.browser}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Platform</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
            <Monitor className="h-3.5 w-3.5 text-cyan-400" />
            {session.os}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Duration</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
            <Clock className="h-3.5 w-3.5 text-pink-400" />
            {session.duration_seconds}s
          </div>
        </div>
      </div>

      {/* Event Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="relative border-l-2 border-gray-800 pl-6 ml-3 space-y-6">
          {events.map((event, index) => (
            <div key={event._id || index} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-[35px] top-1 h-6 w-6 rounded-full bg-gray-900 border-2 border-gray-800 flex items-center justify-center group-hover:border-indigo-500 transition-colors duration-300">
                {getEventIcon(event.event_type)}
              </div>
              
              {/* Event card */}
              <div className="p-3.5 rounded-xl bg-gray-900/40 border border-gray-800/60 hover:border-gray-800 hover:bg-gray-900/70 transition-all duration-300">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {event.event_type.replace("_", " ")}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {formatDate(event.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {getEventTitle(event)}
                </p>
                {event.window_width && (
                  <p className="text-[9px] text-gray-500 mt-1 font-mono">
                    Screen Resolution: {event.window_width}x{event.window_height}px
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
