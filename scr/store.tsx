import React from 'react';

// BGrowth Design Constants
export const PRIMARY_BLUE = '#1061EC';
export const DARK_NAVY = '#0D2A59';

export const LoginMockup: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-50 flex font-sans select-none" style={{ aspectRatio: '16/10', minHeight: '600px' }}>
      {/* Left Column: Visual Brand Banner */}
      <div className="w-1/2 bg-[#0D2A59] p-12 flex flex-col justify-between relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1061EC,transparent_55%)] opacity-40"></div>
        
        {/* Header Logo */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-[#1061EC] flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
            B
          </div>
          <span className="font-bold tracking-tight text-lg">BGrowth Club</span>
        </div>

        {/* Feature Teaser */}
        <div className="z-10 max-w-md">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-300 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Version 2.4 Pre-release</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4 tracking-tight">
            Accelerate Your Product Growth.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            The all-in-one software review visual studio, engineered to streamline version comparison, screen annotations, and AI development prompt generation.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-slate-400 z-10 border-t border-slate-700/50 pt-6">
          <span>© 2026 BGrowth Club</span>
          <div className="flex space-x-4">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
          </div>
        </div>

        {/* Abstract shape illustration */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border border-blue-500/10 pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-120 h-120 rounded-full border border-blue-500/5 pointer-events-none"></div>
      </div>

      {/* Right Column: Interactive Login form */}
      <div className="w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="w-full max-w-sm flex flex-col space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-500">Enter your credentials to access the BGrowth Suite.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Corporate Email Address
              </label>
              <input
                type="email"
                disabled
                value="review-team@bgrowth.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition text-sm font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <input
                type="password"
                disabled
                value="••••••••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              disabled
              defaultChecked
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
            />
            <label htmlFor="remember" className="text-xs text-slate-600 select-none">
              Keep me logged in for 30 days
            </label>
          </div>

          <button
            disabled
            className="w-full py-3 px-4 bg-[#1061EC] hover:bg-[#0d50c7] text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
          >
            <span>Sign In to Workspace</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-medium">or continue with</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button
            disabled
            className="w-full py-2.5 px-4 border border-slate-200 text-slate-700 font-medium rounded-xl text-xs hover:bg-slate-50 transition flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign In with Enterprise SSO</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DashboardMockup: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#fafbfc] flex font-sans select-none" style={{ aspectRatio: '16/10', minHeight: '600px' }}>
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#0D2A59] text-white flex flex-col justify-between border-r border-slate-800">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[#1061EC] flex items-center justify-center font-black text-sm text-white">
              B
            </div>
            <span className="font-bold tracking-tight text-md text-slate-100">BGrowth Admin</span>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-blue-600/20 text-blue-400 font-medium text-sm cursor-pointer border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Workspace Console</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm transition cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              <span>CRM Directory</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm transition cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              <span>Campaign Monitor</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 text-sm transition cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
              <span>Billing & API</span>
            </div>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800/60 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm text-white border border-blue-400/20">
            AM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-100 truncate">Alex Mercer</p>
            <p className="text-[10px] text-slate-400 truncate">Product Lead</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <div className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-slate-800">Workspace Console</h1>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              ● All Systems Live
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search leads, records, modules..."
              disabled
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500 w-64 focus:outline-none"
            />
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer">
              ⚙️
            </div>
          </div>
        </div>

        {/* Dashboard Grid Content */}
        <div className="p-8 space-y-6 overflow-y-auto">
          {/* Quick Stat Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">MRR Revenue</span>
                <span className="text-emerald-500 text-xs font-semibold flex items-center">↑ 12.4%</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">$42,850</p>
                <p className="text-xs text-slate-400 mt-1">vs. last month ($38,120)</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Trials</span>
                <span className="text-blue-500 text-xs font-semibold flex items-center">↑ 8.1%</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">1,842</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-slate-400">82 active right now</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demo Booking Rate</span>
                <span className="text-red-500 text-xs font-semibold flex items-center">↓ 1.2%</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">3.48%</p>
                <p className="text-xs text-slate-400 mt-1">Goal: 4.0% minimum</p>
              </div>
            </div>
          </div>

          {/* Graph & Lead Lists */}
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800">Growth Projection & Activity</h3>
                <div className="flex space-x-2">
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-md">1D</span>
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-sm shadow-blue-500/25">1W</span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-md">1M</span>
                </div>
              </div>

              {/* Simple Vector Trend Representation */}
              <div className="h-44 flex items-end relative border-b border-slate-100">
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-300 pointer-events-none">
                  <div>50k</div>
                  <div>25k</div>
                  <div>0k</div>
                </div>
                <svg className="w-full h-full text-blue-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path
                    d="M 0 25 Q 15 20, 30 15 T 60 10 T 90 2 T 100 5 L 100 30 L 0 30 Z"
                    fill="url(#grad)"
                    opacity="0.15"
                  />
                  <path d="M 0 25 Q 15 20, 30 15 T 60 10 T 90 2 T 100 5" fill="none" stroke="#1061EC" strokeWidth="1.5" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1061EC" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Latest Conversions</h3>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                      KB
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Kate Bishop</p>
                      <p className="text-[10px] text-slate-400">kate.b@shield.com</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">+$249/mo</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 text-xs font-bold flex items-center justify-center">
                      TS
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Tony Stark</p>
                      <p className="text-[10px] text-slate-400">tony@stark.com</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">+$999/mo</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center">
                      BP
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Bruce Parker</p>
                      <p className="text-[10px] text-slate-400">bruce@dailybugle.com</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">+$120/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CrmMockup: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#f8fafc] flex flex-col font-sans select-none" style={{ aspectRatio: '16/10', minHeight: '600px' }}>
      {/* Top Bar Navigation */}
      <div className="h-16 bg-[#0D2A59] text-white px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-[#1061EC] flex items-center justify-center font-bold text-xs text-white">
              B
            </div>
            <span className="font-extrabold text-sm tracking-tight">BGrowth CRM</span>
          </div>

          <nav className="flex space-x-4 text-xs font-medium text-slate-300">
            <span className="text-white bg-white/10 px-3 py-1 rounded-md cursor-pointer">Directory</span>
            <span className="hover:text-white px-3 py-1 rounded-md cursor-pointer transition">Pipelines</span>
            <span className="hover:text-white px-3 py-1 rounded-md cursor-pointer transition">Workflows</span>
            <span className="hover:text-white px-3 py-1 rounded-md cursor-pointer transition">Logs</span>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-300">Region: APAC</span>
          <div className="w-8 h-8 rounded-full bg-indigo-500 border border-slate-700"></div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h2 className="text-sm font-bold text-slate-800">Contact Management</h2>
          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
            Total 1,280 contacts
          </span>
        </div>

        <div className="flex space-x-2">
          <button disabled className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg bg-white">
            Export CSV
          </button>
          <button disabled className="px-3 py-1.5 bg-[#1061EC] text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20">
            + New Contact
          </button>
        </div>
      </div>

      {/* Main Grid table */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/65 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Company & Contact</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Pipeline Value</th>
                <th className="py-3.5 px-6">Last Touchpoint</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr>
                <td className="py-4 px-6 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                    AC
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Acme Corporation</p>
                    <p className="text-[10px] text-slate-400">Contact: John Smith</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                    Qualified
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-slate-800">$18,500</td>
                <td className="py-4 px-6 text-slate-500">2 hours ago by Alex</td>
                <td className="py-4 px-6 text-right">
                  <span className="text-blue-600 hover:underline font-bold cursor-pointer">Edit</span>
                </td>
              </tr>

              <tr>
                <td className="py-4 px-6 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 font-bold flex items-center justify-center">
                    GL
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Gringotts Labs</p>
                    <p className="text-[10px] text-slate-400">Contact: Harry P.</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                    Nurturing
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-slate-800">$45,000</td>
                <td className="py-4 px-6 text-slate-500">Yesterday by Mercer</td>
                <td className="py-4 px-6 text-right">
                  <span className="text-blue-600 hover:underline font-bold cursor-pointer">Edit</span>
                </td>
              </tr>

              <tr>
                <td className="py-4 px-6 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-purple-100 text-purple-800 font-bold flex items-center justify-center">
                    WD
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Wayne Defense</p>
                    <p className="text-[10px] text-slate-400">Contact: Alfred P.</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                    Stalled
                  </span>
                </td>
                <td className="py-4 px-6 font-bold text-slate-800">$120,000</td>
                <td className="py-4 px-6 text-slate-500">3 days ago by Alex</td>
                <td className="py-4 px-6 text-right">
                  <span className="text-blue-600 hover:underline font-bold cursor-pointer">Edit</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
