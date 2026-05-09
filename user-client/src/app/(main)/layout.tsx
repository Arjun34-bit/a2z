/**
 * Main app layout — mobile-first shell.
 *
 * The outer wrapper constrains width to a phone-like viewport (max-w-lg)
 * and centres it on larger screens, mimicking the mobile app design.
 * The Header is rendered inside HomeView itself so it can be sticky
 * within the phone frame; we skip the shared <Header/> / <Footer/> here.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F0EDFC] md:bg-white flex items-start justify-center">
      {/* Phone-frame container on mobile, full width on desktop */}
      <div className="relative w-full max-w-lg md:max-w-none min-h-screen bg-white flex flex-col shadow-[0_0_60px_rgba(111,85,200,0.12)] md:shadow-none">
        {children}
      </div>
    </div>
  );
}
