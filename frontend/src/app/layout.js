import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "CFAnalytics | User Behavior Analytics",
  description: "Advanced visitor journey, visual heatmaps, and design optimization suite.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#090d16] text-[#f8fafc] antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <div className="flex h-screen overflow-hidden">
          {/* Main Glow Backdrops */}
          <div className="bg-glow-main"></div>
          <div className="bg-glow-alt-main"></div>

          {/* Sidebar */}
          <Sidebar />

          {/* Right Panel Viewport */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
