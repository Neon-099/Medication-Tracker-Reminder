import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 text-gray-900">
      {/* Hero + Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-indigo-100/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg tracking-tight">M+</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                MedTrack+
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Medication reminders that actually help</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#safety" className="hover:text-indigo-600 transition-colors">Safety</a>
            <Link
              to="/"
              className="ml-2 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 text-xs uppercase tracking-[0.18em]"
            >
              OPEN APP
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-16 space-y-16">
        {/* Hero section */}
        <section className="grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.26em] text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 mb-5 uppercase">
              MEDICATION • ROUTINES ��� PEACE OF MIND
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-gray-900">
              Never miss an important dose
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
                again.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mb-6">
              MedTrack+ turns scattered pill boxes and sticky notes into a calm, clear schedule. See exactly what to
              take, when to take it, and how you’re doing over time — without complicated charts or hospital software.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all text-sm"
              >
                Start tracking now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white/70 text-gray-800 text-sm font-medium hover:border-indigo-200 hover:bg-indigo-50/80 transition-all shadow-sm"
              >
                See how it works
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="bg-white/80 rounded-2xl border border-indigo-50 shadow-sm px-4 py-3">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.16em] mb-1">Daily view</div>
                <div className="text-xl font-bold text-gray-900">Clear</div>
                <p className="text-[11px] text-gray-500 mt-0.5">See only what you need to take today.</p>
              </div>
              <div className="bg-white/80 rounded-2xl border border-emerald-50 shadow-sm px-4 py-3">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.16em] mb-1">Reminders</div>
                <div className="text-xl font-bold text-gray-900">Smart</div>
                <p className="text-[11px] text-gray-500 mt-0.5">Alarms tuned for real life, not just alerts.</p>
              </div>
              <div className="bg-white/80 rounded-2xl border border-purple-50 shadow-sm px-4 py-3">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.16em] mb-1">Adherence</div>
                <div className="text-xl font-bold text-gray-900">Visible</div>
                <p className="text-[11px] text-gray-500 mt-0.5">See patterns and progress at a glance.</p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="absolute -top-6 -right-4 w-32 h-32 bg-indigo-200/60 rounded-full blur-3xl" />
            <div className="absolute bottom-0 -left-6 w-40 h-40 bg-emerald-200/60 rounded-full blur-3xl" />
            <div className="relative bg-white/80 border border-indigo-100 rounded-3xl shadow-xl shadow-indigo-100 p-5 flex flex-col gap-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.2em] mb-1">TODAY</p>
                  <p className="text-sm font-semibold text-gray-900">Your day, at a glance</p>
                  <p className="text-xs text-gray-500">Upcoming doses, taken meds, and gentle nudges.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 8v4l3 3M5 3h14M5 21h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2 text-[11px] text-gray-600">
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl px-3 py-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">Morning meds</p>
                    <p className="text-[11px] text-gray-500">08:00 • 2 medications</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                    Upcoming
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white border border-emerald-100 rounded-xl px-3 py-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">Afternoon dose</p>
                    <p className="text-[11px] text-gray-500">13:00 • 1 medication</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                    Taken
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white border border-amber-100 rounded-xl px-3 py-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">Evening meds</p>
                    <p className="text-[11px] text-gray-500">20:00 • 3 medications</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                    Reminder set
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 text-[11px] text-gray-600">
                <span>Built to be as calm and clear as your best days.</span>
                <Link to="/" className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                  Open app
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Designed for real routines</h3>
              <p className="text-sm text-gray-600 max-w-xl">
                MedTrack+ focuses on the few things that actually matter: knowing what to take, staying on time, and
                seeing how well things are going.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <article className="bg-white/85 border border-indigo-100 rounded-2xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Crystal-clear daily schedule</h4>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                A clean timeline of just today’s medications. No cluttered calendars, no hospital EHR screens.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1">
                <li>• See upcoming, missed, and taken meds separately</li>
                <li>• Tap into full medication details when you need them</li>
              </ul>
            </article>

            <article className="bg-white/85 border border-emerald-100 rounded-2xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Gentle but reliable reminders</h4>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Alarms and notifications that are hard to ignore but easy to act on, with snooze built in.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1">
                <li>• Clear alert screens with simple choices</li>
                <li>• Snooze when life happens, without losing track</li>
              </ul>
            </article>

            <article className="bg-white/85 border border-purple-100 rounded-2xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Adherence you can actually use</h4>
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                Simple visuals that show patterns: good days, rough weeks, and what might need adjusting.
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1">
                <li>• High-level adherence view, not overwhelming charts</li>
                <li>• Easy to share with caregivers or clinicians</li>
              </ul>
            </article>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,1.1fr)] gap-8 items-start">
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">From prescription to calm routine</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li>
                <span className="font-semibold text-gray-900">1. Add your medications.</span> Enter them manually or
                scan your prescription to speed things up.
              </li>
              <li>
                <span className="font-semibold text-gray-900">2. Set times that actually work.</span> Align reminders
                with how your days really run, not idealized schedules.
              </li>
              <li>
                <span className="font-semibold text-gray-900">3. Follow the nudges.</span> MedTrack+ keeps track of
                what you’ve taken, what’s upcoming, and where you might be slipping.
              </li>
            </ol>

            <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 text-xs text-gray-600 space-y-2">
              <p className="font-semibold text-gray-900 text-sm">Built to support, not judge</p>
              <p>
                Life is messy. MedTrack+ treats missed doses as information, not failure — so you and your care team can
                make better decisions together.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-50 via-white to-emerald-50 border border-indigo-100 rounded-2xl p-4 shadow-sm text-xs text-gray-600">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-500 mb-2">
                QUICK HIGHLIGHTS
              </p>
              <ul className="space-y-1.5">
                <li>• Works great on mobile — built with small screens in mind.</li>
                <li>• Clean, quiet interface with high contrast where it matters.</li>
                <li>• No dark patterns, no surprise popups, no spammy notifications.</li>
              </ul>
            </div>

            <div className="bg-white/90 border border-gray-100 rounded-2xl p-4 text-xs text-gray-600">
              <p className="font-semibold text-gray-900 text-sm mb-1">Who it’s for</p>
              <p>
                People juggling more than a couple of medications, caregivers helping someone stay on track, or anyone
                who wants a calmer way to manage chronic treatments.
              </p>
            </div>
          </div>
        </section>

        {/* Safety & trust */}
        <section id="safety" className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-7 border border-indigo-100/50 flex flex-col md:flex-row gap-5 items-start">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Your data, handled carefully</h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-2">
                MedTrack+ is designed to store your medication information securely and privately. It’s a tool to help
                you stay organized — not a replacement for professional medical advice.
              </p>
              <p className="text-xs text-gray-600">
                Always consult with your doctor or pharmacist about any changes to your medications or schedule.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 rounded-3xl p-[1px] shadow-xl shadow-indigo-200">
            <div className="bg-slate-950 rounded-[calc(1.5rem-1px)] px-6 py-7 sm:px-8 sm:py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-300">READY WHEN YOU ARE</p>
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Turn your medications into a routine that fits your life — not the other way around.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  It takes just a couple of minutes to set up your first few medications. You can adjust times anytime
                  as your days change.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-w-[220px]">
                <Link
                  to="/medications"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  Open MedTrack+
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
            <span>Built for the MedTrack+ experience you already have in the app.</span>
            <span className="text-gray-400">No account spam. No ads. Just reminders and clarity.</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
