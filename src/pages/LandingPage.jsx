import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Shield,
  Radio,
  Waves,
  Activity,
  ArrowRight,
  Mail,
  MapPin,
  Users,
  CircleHelp,
  BadgeCheck,
  Train,
  Menu,
  X,
} from "lucide-react";

const demoUrl = "/demo";
const contactEmail = "hello@railhermes.com";

const mediaItems = [
  {
    type: "image",
    src: "/images/hero-1.jpg",
    alt: "Prototype overview",
    caption: "Prototype and system concept overview.",
  },
  {
    type: "image",
    src: "/images/hero-2.jpg",
    alt: "Field testing",
    caption: "Field testing and deployment context.",
  },
  {
    type: "image",
    src: "/images/hero-3.jpg",
    alt: "Device close-up",
    caption: "Device close-up and mounting concept.",
  },
  {
    type: "video",
    src: "/videos/demo.mp4",
    alt: "Demo video",
    caption: "Short product overview or testing video.",
    poster: "/images/video-poster.jpg",
  },
];

const faqs = [
  {
    q: "What problem does RailHermes solve?",
    a: "RailHermes is designed to provide earlier warnings to workers operating near rail-adjacent industrial zones by detecting an approaching train and propagating the alert before the vehicle reaches the crew.",
  },
  {
    q: "Who is this system for?",
    a: "The system is relevant for industrial rail yards, mining and plant environments, maintenance crews, and other sites where workers operate close to active rail segments.",
  },
  {
    q: "How does the system work at a high level?",
    a: "A vibration-sensing device detects train-related rail activity, a nearby forwarding device relays the signal over longer distance, a station device receives it close to the work area, and worker wearables issue a warning.",
  },
  {
    q: "Does the website show the real hardware?",
    a: "This page is a presentation layer for interviews and product communication. The interactive demo illustrates the intended workflow and can be used even when the full hardware setup is not present.",
  },
  {
    q: "Can the system be adapted to different sites?",
    a: "Yes. The concept is modular and can be adapted to different site geometries, warning distances, and operational needs.",
  },
  {
    q: "Where can I see the digital simulation?",
    a: "Use the main demo button on this page to open the separate interactive digital demo website.",
  },
];

function Section({ id, eyebrow, title, description, children }) {
  return (
    <section id={id} className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {(eyebrow || title || description) && (
          <div className="mb-10 max-w-3xl">
            {eyebrow && (
              <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
                {eyebrow}
              </div>
            )}
            {title && <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h2>}
            {description && <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-3xl font-semibold text-slate-900 md:text-4xl">{value}</div>
      <div className="mt-2 text-sm text-slate-600 md:text-base">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-900">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function FAQItem({ item, open, onToggle }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-lg font-medium text-slate-900">{item.q}</span>
        <span className="text-slate-500">{open ? <X className="h-5 w-5" /> : <CircleHelp className="h-5 w-5" />}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-base leading-7 text-slate-600">{item.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MediaCarousel() {
  const [index, setIndex] = useState(0);
  const active = mediaItems[index];

  const next = () => setIndex((prev) => (prev + 1) % mediaItems.length);
  const prev = () => setIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[16/10] bg-slate-100">
          {active.type === "video" ? (
            <video controls poster={active.poster} className="h-full w-full object-cover">
              <source src={active.src} />
            </video>
          ) : (
            <img src={active.src} alt={active.alt} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
            <div className="text-lg font-medium">{active.alt}</div>
            <div className="mt-1 text-sm text-white/85 md:text-base">{active.caption}</div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 p-4">
          <div className="text-sm text-slate-500">{index + 1} / {mediaItems.length}</div>
          <div className="flex gap-2">
            <button onClick={prev} className="rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-50">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="rounded-full border border-slate-200 p-2 text-slate-700 hover:bg-slate-50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {mediaItems.map((item, i) => (
          <button
            key={item.src}
            onClick={() => setIndex(i)}
            className={`overflow-hidden rounded-3xl border text-left transition ${
              i === index ? "border-slate-900 bg-slate-900 text-white shadow-md" : "border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="h-20 w-28 overflow-hidden rounded-2xl bg-slate-100">
                {item.type === "video" ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                    <PlayCircle className="h-8 w-8" />
                  </div>
                ) : (
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <div className="font-medium">{item.alt}</div>
                <div className={`mt-1 text-sm ${i === index ? "text-white/80" : "text-slate-500"}`}>{item.caption}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#about", label: "About" },
    { href: "#how-it-works", label: "How it works" },
    { href: "#media", label: "Media" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-900">
            <Train className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-semibold text-slate-900">RailHermes</div>
            <div className="text-xs text-slate-500">Industrial rail safety system</div>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-slate-600 transition hover:text-slate-900">
              {link.label}
            </a>
          ))}
          <a
            href={demoUrl}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            View digital demo
            <ArrowRight className="h-4 w-4" />
          </a>
        </nav>

        <button onClick={() => setOpen((v) => !v)} className="rounded-2xl border border-slate-200 p-2 md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:px-8">
              {links.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-slate-700" onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a href={demoUrl} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">
                View digital demo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const features = useMemo(
    () => [
      {
        icon: <Activity className="h-6 w-6" />,
        title: "Early vibration sensing",
        description:
          "A rail-mounted sensing unit detects train-related vibrations before the vehicle reaches the work area.",
      },
      {
        icon: <Radio className="h-6 w-6" />,
        title: "Long-range signal forwarding",
        description:
          "A nearby forwarding module relays the event over longer distance to the station-side device.",
      },
      {
        icon: <Waves className="h-6 w-6" />,
        title: "Local warning distribution",
        description:
          "A station device near the crew receives the signal and broadcasts the warning close to the work zone.",
      },
      {
        icon: <Shield className="h-6 w-6" />,
        title: "Worker wearable alerts",
        description:
          "Wearable devices notify workers early enough to help them move out of the danger zone.",
      },
    ],
    []
  );

  const useCases = useMemo(
    () => [
      "Industrial rail yards",
      "Mining and plant internal rail infrastructure",
      "Maintenance and inspection crews",
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fbff,white_45%,#f8fafc_100%)] text-slate-900">
      <Navbar />

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.08),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.08),transparent_20%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
              Industrial rail safety · early warning · wearable alerts
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl md:leading-[1.05]">
              Early railway worker warning for industrial and rail-adjacent environments
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-xl">
              RailHermes is a modular safety concept that detects approaching train-related vibration, relays the warning over distance, and helps alert workers before a vehicle reaches the active work zone.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={demoUrl}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-base font-medium text-white shadow-sm transition hover:bg-slate-800"
              >
                View digital demo
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Contact us
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard value="~500 m" label="Indicative early vibration detection zone" />
              <StatCard value="~3–4 km" label="Indicative forwarding distance to station-side device" />
              <StatCard value="~200 m" label="Indicative worker danger zone context" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl md:p-6">
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
                <img src="/images/landing-hero.jpg" alt="RailHermes overview" className="aspect-[4/3] h-full w-full object-cover" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-500">Who it is for</div>
                  <div className="mt-2 text-base leading-7 text-slate-700">Industrial operators, rail-adjacent crews, maintenance teams, and sites where earlier warning matters.</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-500">Main value</div>
                  <div className="mt-2 text-base leading-7 text-slate-700">Early sensing, long-range relay, and local wearable warning in one workflow.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="about"
        eyebrow="About RailHermes"
        title="A presentation layer for explaining the system clearly"
        description="This page is designed as a concise company-style front page that explains the concept, the motivation, and the intended workflow before the visitor opens the detailed interactive digital demo."
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">What we do</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              RailHermes focuses on improving awareness around active rail environments by combining early rail-side detection, wireless signal forwarding, and worker-facing alerts. The goal is to provide a practical and understandable warning chain for product conversations, pilots, and early stakeholder interviews.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 inline-flex rounded-2xl border border-slate-200 bg-white p-3 text-slate-900">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-lg font-medium text-slate-900">Who we are</div>
                <div className="mt-2 text-sm leading-7 text-slate-600">
                  A team exploring safer workflows for workers operating near active industrial or rail-side movement.
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 inline-flex rounded-2xl border border-slate-200 bg-white p-3 text-slate-900">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div className="text-lg font-medium text-slate-900">What this site is for</div>
                <div className="mt-2 text-sm leading-7 text-slate-600">
                  A clear visit-card style website for introductions, product interviews, and easier explanation of the concept.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">Why this matters</h3>
            <div className="mt-5 space-y-4">
              {[
                "Workers can operate close to active track-adjacent areas in noisy or visually complex environments.",
                "Manual awareness alone may not always provide enough early reaction time.",
                "A modular early-warning chain helps communicate a safer workflow before a train reaches the crew.",
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-base leading-7 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="A simple four-part safety chain"
        description="The landing page should keep this part simple and executive-friendly, while the separate demo page provides the deeper interactive explanation."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Workflow summary</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Rail sensor", "Forwarder", "Station device", "Wearables"].map((item, i) => (
                  <React.Fragment key={item}>
                    <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 md:text-base">{item}</div>
                    {i < 3 && <ArrowRight className="mt-2 h-5 w-5 text-slate-400" />}
                  </React.Fragment>
                ))}
              </div>
              <p className="mt-6 text-base leading-8 text-slate-600">
                The idea is to detect early, relay reliably, warn locally, and help workers clear the danger zone before a train reaches the active work area.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
              <div className="text-lg font-semibold text-slate-900">Example use cases</div>
              <div className="mt-4 space-y-3">
                {useCases.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="media"
        eyebrow="Media"
        title="Photos, visuals, and demo video"
        description="Use this section for prototype photos, field visuals, close-ups, testing media, and a short overview video."
      >
        <MediaCarousel />
      </Section>

      <Section
        id="demo"
        eyebrow="Interactive demo"
        title="Open the digital simulation"
        description="When the visitor wants to go beyond the high-level overview, this section sends them to the separate interactive digital demo website you already built."
      >
        <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-xl md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-3xl font-semibold">See the system workflow in motion</h3>
              <p className="mt-4 max-w-3xl text-base leading-8 text-white/80 md:text-lg">
                The digital demo illustrates the warning flow step by step: train approach, vibration sensing, forwarding, station-side reception, wearable warning, and worker movement to safety.
              </p>
            </div>
            <div>
              <a
                href={demoUrl}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-base font-medium text-slate-900 transition hover:bg-slate-100"
              >
                Open digital demo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="faq"
        eyebrow="FAQ"
        title="Questions a visitor may ask first"
        description="A short FAQ helps reduce friction and keeps the landing page easy to scan before a meeting or interview."
      >
        <div className="grid gap-4">
          {faqs.map((item, i) => (
            <FAQItem key={item.q} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
          ))}
        </div>
      </Section>

      <Section
        id="contact"
        eyebrow="Next step"
        title="Interested in the concept or demo?"
        description="Use the final section for a contact email, a meeting request, or a direct introduction message."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">Get in touch</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              This page can be adapted into a compact public-facing introduction, a customer interview page, or a private landing page for stakeholders and pilot discussions.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a href={`mailto:${contactEmail}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-slate-100">
                <div className="mb-3 inline-flex rounded-2xl border border-slate-200 bg-white p-3 text-slate-900">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="text-lg font-medium text-slate-900">Email</div>
                <div className="mt-2 text-sm text-slate-600">{contactEmail}</div>
              </a>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-3 inline-flex rounded-2xl border border-slate-200 bg-white p-3 text-slate-900">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="text-lg font-medium text-slate-900">Use this block for</div>
                <div className="mt-2 text-sm text-slate-600">Location, LinkedIn, meeting link, or company info</div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">How to adapt this page</h3>
            <div className="mt-5 space-y-4 text-base leading-7 text-slate-600">
              <p>Replace placeholder images and video with your real materials.</p>
              <p>Swap the text blocks with your company story, team intro, and use cases.</p>
              <p>Point the demo button to the deployed interactive simulation route on your Vercel site.</p>
              <p>Add your real logo, contact details, and brand colors when ready.</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

