import DashboardLayout from "@/components/DashboardLayout";
import "./globals.css";

export const metadata = {
  title: "CFAnalytics | User Behavior Analytics",
  description: "Advanced visitor journey, visual heatmaps, and design optimization suite.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 text-slate-800 antialiased selection:bg-blue-500/20 selection:text-blue-800">
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
