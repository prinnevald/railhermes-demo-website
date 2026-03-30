import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Radio,
  Train,
  ShieldAlert,
  Activity,
  Waves,
  RotateCcw,
  PlayCircle,
  PauseCircle,
} from "lucide-react";

const STAGES = [
  "Idle",
  "Train approaching",
  "Rail vibrations detected",
  "Forwarder relays signal",
  "Station receives alert",
  "Wearables warn workers",
  "Workers move to safety",
];

const workersDefault = [
  { id: 1, name: "Worker A", x: 78, y: 72, safeX: 93, safeY: 28 },
  { id: 2, name: "Worker B", x: 87, y: 58, safeX: 70, safeY: 70 },
  { id: 3, name: "Worker C", x: 70, y: 56, safeX: 65, safeY: 30 },
];

const deviceImages = {
  railSensor: "/images/rail-sensor.jpg",
  forwarder: "/images/forwarder.jpg",
  station: "/images/station.jpg",
  wearables: "/images/wearable.jpg",
};

function StagePill({ active, children }) {
  return (
    <div
      className={`rounded-full px-3 py-1 text-xs md:text-sm border transition-all ${
        active
          ? "bg-black text-white border-black shadow"
          : "bg-white text-slate-700 border-slate-200"
      }`}
    >
      {children}
    </div>
  );
}

function Panel({ className = "", children }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white shadow-lg ${className}`}>
      {children}
    </div>
  );
}

function PanelHeader({ children }) {
  return <div className="p-6 pb-3">{children}</div>;
}

function PanelTitle({ children, className = "" }) {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
}

function PanelContent({ children, className = "" }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

function UIButton({ children, onClick, variant = "default", className = "", ...props }) {
  const styles =
    variant === "outline"
      ? "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50"
      : variant === "ghost"
      ? "bg-transparent text-slate-700 hover:bg-slate-100"
      : "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function BadgePill({ children }) {
  return <span className="rounded-full border border-slate-200 px-3 py-1 text-xs">{children}</span>;
}

function RangeSlider({ value, onChange, min, max, step = 1 }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange([Number(e.target.value)])}
      className="w-full accent-slate-900"
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-slate-900" : "bg-slate-300"}`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`}
      />
    </button>
  );
}

function SignalDot({ x, y, delay = 0, duration = 1.6, label }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1.1, 1, 0.8] }}
      transition={{ delay, duration, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/80 px-2 py-1 text-[10px] text-white shadow-lg whitespace-nowrap">
        {label}
      </div>
    </motion.div>
  );
}

function PulseRing({ x, y, color = "bg-emerald-500", size = 14, active = true }) {
  if (!active) return null;
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <motion.div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${color}/20`}
        style={{ width: size, height: size }}
        initial={{ scale: 0.7, opacity: 0.8 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${color}`}
        style={{ width: 10, height: 10 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </div>
  );
}

function DeviceLabel({ x, y, title, subtitle, icon, active = false, imageSrc, imageAlt }) {
  return (
    <div className="absolute group" style={{ left: `${x}%`, top: `${y}%` }}>
      <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
        <div
          className={`h-12 w-12 rounded-full border-4 shadow-lg flex items-center justify-center transition ${
            active ? "bg-white border-black scale-105" : "bg-white/95 border-white"
          }`}
        >
          <div className="text-slate-900">{icon}</div>
        </div>

        <div className="pointer-events-none opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-200">
          <div className="rounded-2xl border px-4 py-4 shadow-xl backdrop-blur bg-white border-slate-200 w-120">
            <div className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-[3/4] flex items-center justify-center">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="hidden h-full w-full items-center justify-center text-center text-xs text-slate-500 p-4">
                Placeholder image for {title}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              {icon}
              <span>{title}</span>
            </div>
            <div className="text-xs text-slate-600 mt-1 leading-5">{subtitle}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Worker({ x, y, safeX, safeY, alerted, moved, name }) {
  return (
    <motion.div
      className="absolute"
      initial={false}
      animate={{ left: `${moved ? safeX : x}%`, top: `${moved ? safeY : y}%` }}
      transition={{ duration: 1.3, ease: "easeInOut" }}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
        <motion.div
          animate={alerted ? { y: [0, -2, 0] } : { y: 0 }}
          transition={{ duration: 0.7, repeat: alerted ? Infinity : 0 }}
          className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
            alerted ? "bg-red-50 border-red-500 text-red-700" : "bg-white border-slate-400 text-slate-700"
          }`}
        >
          W
        </motion.div>
        <div className="rounded-full bg-white/90 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-700 shadow-sm">
          {name}
        </div>
        <AnimatePresence>
          {alerted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] text-white shadow"
            >
              ALERT
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function RailwaySafetyInteractiveDemo() {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [trainSpeed, setTrainSpeed] = useState([60]);
  const [workerCount, setWorkerCount] = useState([3]);
  const [autoReset, setAutoReset] = useState(true);
  const [scenarioCount, setScenarioCount] = useState(0);
  const intervalRef = useRef(null);

  const workers = useMemo(() => workersDefault.slice(0, workerCount[0]), [workerCount]);

  const reset = () => {
    setIsRunning(false);
    setStep(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startScenario = () => {
    setScenarioCount((v) => v + 1);
    setStep(1);
    setIsRunning(true);
  };

  const nextStep = () => {
    setStep((prev) => {
      if (prev >= STAGES.length - 1) {
        if (autoReset) {
          setTimeout(() => {
            setStep(0);
            setIsRunning(false);
          }, 1600);
        } else {
          setIsRunning(false);
        }
        return prev;
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const base = 1500;
    const speedFactor = (110 - trainSpeed[0]) * 8;
    const delay = Math.max(1000, base + speedFactor);

    intervalRef.current = setInterval(() => {
      setStep((prev) => {
        if (prev >= STAGES.length - 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          if (autoReset) {
            setTimeout(() => {
              setStep(0);
              setIsRunning(false);
            }, 1600);
          } else {
            setIsRunning(false);
          }
          return prev;
        }
        return prev + 1;
      });
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, trainSpeed, autoReset, scenarioCount]);

  const vibrationDetected = step >= 2;
  const relayActive = step >= 3;
  const stationActive = step >= 4;
  const workersAlerted = step >= 5;
  const workersMoved = step >= 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-[2400px] mx-auto grid grid-cols-1 xl:grid-cols-[1.78fr_0.22fr] gap-6">
        <Panel className="overflow-hidden shadow-xl">
          <PanelHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <PanelTitle className="text-2xl md:text-3xl">Railway Worker Safety Demo</PanelTitle>
                <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                  Interactive static presentation showing how rail vibrations are detected, forwarded over distance, and turned into alerts for workers wearing warning devices.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <BadgePill>Static frontend</BadgePill>
                <BadgePill>Interview demo</BadgePill>
                <BadgePill>Interactive scenario</BadgePill>
              </div>
            </div>
          </PanelHeader>

          <PanelContent>
            <div className="flex flex-wrap gap-2 mb-5">
              {STAGES.map((label, i) => (
                <StagePill key={label} active={i === step}>
                  {i + 1}. {label}
                </StagePill>
              ))}
            </div>

            <div className="relative h-[980px] w-full overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#dff4ff_0%,#f8fafc_18%,#d9f99d_18%,#bbf7d0_100%)]">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_25%),radial-gradient(circle_at_80%_15%,white,transparent_20%),radial-gradient(circle_at_50%_80%,white,transparent_18%)]" />

              <div className="absolute left-0 right-0 top-[50%] h-24 -translate-y-1/2 bg-slate-700/90 shadow-inner" />
              <div className="absolute left-0 right-0 top-[47.3%] h-1 bg-slate-300" />
              <div className="absolute left-0 right-0 top-[52.7%] h-1 bg-slate-300" />

              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-[50%] h-12 w-2 -translate-y-1/2 bg-amber-950/80 rounded"
                  style={{ left: `${1 + i * 2.75}%` }}
                />
              ))}

              {/* Rail sensor moved noticeably to the right */}
              <div className="absolute left-[27%] top-[28%] h-[22%] w-1 bg-slate-700" />
              <div className="absolute left-[26.2%] top-[22%] h-10 w-10 rounded-full bg-slate-700 border-4 border-white shadow-lg" />

              {/* Forwarder close to sensor */}
              <div className="absolute left-[36%] top-[20%] h-[28%] w-3 rounded bg-slate-700" />
              <div className="absolute left-[35.2%] top-[16%] h-8 w-8 rounded-full bg-amber-500 border-4 border-white shadow-lg" />

              {/* Station near workers */}
              <div className="absolute left-[84%] top-[20%] h-[30%] w-4 rounded bg-slate-700" />
              <div className="absolute left-[83.1%] top-[15%] h-9 w-9 rounded-full bg-sky-600 border-4 border-white shadow-lg" />

              <motion.div
                className="absolute top-[43%] scale-90 origin-left"
                animate={{ left: step >= 1 ? ["-20%", "200%"] : "-20%" }}
                transition={{ duration: Math.max(11.5, 40 - trainSpeed[0] / 11), ease: "linear" }}
                style={{ left: "-20%" }}
              >
                <div className="relative h-28 w-56">
                  <div className="absolute bottom-8 left-3 h-14 w-32 rounded-lg bg-red-600 shadow-lg border-2 border-red-800" />
                  <div className="absolute bottom-11 left-24 h-10 w-18 rounded bg-red-500 border-2 border-red-800" />
                  <div className="absolute bottom-5 left-40 h-16 w-12 rounded bg-zinc-700 border-2 border-zinc-800" />
                  <div className="absolute bottom-3 left-10 h-7 w-7 rounded-full bg-zinc-900" />
                  <div className="absolute bottom-3 left-41 h-7 w-7 rounded-full bg-zinc-900" />
                </div>
              </motion.div>

              <AnimatePresence>
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-[2%] top-[34%] rounded-full bg-white/95 px-3 py-1 text-xs font-medium border border-slate-200 shadow"
                  >
                    Train approaching from far outside the monitored zone
                  </motion.div>
                )}
              </AnimatePresence>

              {vibrationDetected && (
                <>
                  <PulseRing x={28} y={50} color="bg-emerald-500" size={20} active />
                  <PulseRing x={31} y={50} color="bg-emerald-500" size={18} active />
                  <SignalDot x={31} y={40} label="Vibration sensed long before arrival" delay={0.2} duration={1.6} />
                </>
              )}

              <div className="absolute left-[10%] top-[39%] h-[21%] w-[20%] rounded-[40px] border-2 border-dashed border-emerald-500/70 bg-emerald-100/30" />
              <div className="absolute left-[23%] top-[62%] rounded-full bg-emerald-600 px-3 py-1 text-xs text-white shadow">
                Early vibration detection zone
              </div>

              {relayActive && (
                <>
                  <motion.div
                    className="absolute left-[29%] top-[31%] h-1 origin-left rounded-full bg-sky-500 shadow"
                    initial={{ width: 0, opacity: 0.4 }}
                    animate={{ width: "7%", opacity: 1 }}
                    transition={{ duration: 1.1, ease: "easeInOut" }}
                  />
                  <SignalDot x={34} y={31} label="Forwarded wirelessly" delay={0.4} duration={1.8} />
                </>
              )}

              {stationActive && (
                <>
                  <motion.div
                    className="absolute left-[37%] top-[24%] h-1 origin-left rounded-full bg-orange-500 shadow"
                    initial={{ width: 0, opacity: 0.4 }}
                    animate={{ width: "46%", opacity: 1 }}
                    transition={{ duration: 1.0, ease: "easeInOut" }}
                  />
                  <PulseRing x={84} y={30} color="bg-sky-500" size={22} active />
                  <SignalDot x={60} y={24} label="Station receives alert" delay={0.2} duration={1.8} />
                </>
              )}

              {workersAlerted && (
                <>
                  <PulseRing x={78} y={72} color="bg-red-500" size={20} active />
                  <PulseRing x={87} y={58} color="bg-red-500" size={20} active />
                  <PulseRing x={70} y={56} color="bg-red-500" size={20} active />
                </>
              )}

              <div className="absolute left-[63%] top-[44%] h-[21%] w-[33%] rounded-[40px] border-2 border-dashed border-red-400/70 bg-red-100/30" />
              <div className="absolute left-[70%] top-[66%] rounded-full bg-red-600 px-3 py-1 text-xs text-white shadow">
                Worker danger zone near rails
              </div>

              {workers.map((w) => (
                <Worker
                  key={w.id}
                  x={w.x}
                  y={w.y}
                  safeX={w.safeX}
                  safeY={w.safeY}
                  name={w.name}
                  alerted={workersAlerted}
                  moved={workersMoved}
                />
              ))}

              <DeviceLabel
                x={27}
                y={50}
                title="Rail Sensor"
                subtitle="Mounted on the rails to sense early vibration from an approaching train"
                icon={<Activity className="h-4 w-4" />}
                active={vibrationDetected}
                imageSrc={deviceImages.railSensor}
                imageAlt="Rail sensor placeholder"
              />
              <DeviceLabel
                x={37}
                y={40}
                title="Forwarder"
                subtitle="Mounted on a ~2 m pole near the sensor to relay the event wirelessly over long distance"
                icon={<Radio className="h-4 w-4" />}
                active={relayActive}
                imageSrc={deviceImages.forwarder}
                imageAlt="Forwarder placeholder"
              />
              <DeviceLabel
                x={84}
                y={40}
                title="Station Device"
                subtitle="Placed near workers to receive the alert and trigger local warning"
                icon={<Waves className="h-4 w-4" />}
                active={stationActive}
                imageSrc={deviceImages.station}
                imageAlt="Station device placeholder"
              />
              <DeviceLabel
                x={74}
                y={65}
                title="Wearables"
                subtitle="Immediately warn workers so they move away from the track zone"
                icon={<ShieldAlert className="h-4 w-4" />}
                active={workersAlerted}
                imageSrc={deviceImages.wearables}
                imageAlt="Wearable placeholder"
              />

              <AnimatePresence>
                {workersMoved && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-4 bottom-4 rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-xl"
                  >
                    <div className="font-semibold">Workers reached safer positions</div>
                    <div className="text-xs text-emerald-50 mt-1">Train continues through while the area is cleared</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </PanelContent>
        </Panel>

        <div className="grid gap-6">
          <Panel>
            <PanelHeader>
              <PanelTitle className="text-xl">Controls</PanelTitle>
            </PanelHeader>
            <PanelContent className="space-y-5">
              <div className="flex flex-wrap gap-3">
                <UIButton onClick={startScenario}>
                  <Train className="mr-2 h-4 w-4" />
                  Send a train
                </UIButton>
                <UIButton onClick={() => setIsRunning((v) => !v)} variant="outline">
                  {isRunning ? <PauseCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                  {isRunning ? "Pause" : "Resume"}
                </UIButton>
                <UIButton onClick={nextStep} variant="outline">
                  Step forward
                </UIButton>
                <UIButton onClick={reset} variant="ghost">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </UIButton>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Train speed</span>
                  <span className="text-slate-600">{trainSpeed[0]}%</span>
                </div>
                <RangeSlider value={trainSpeed[0]} onChange={setTrainSpeed} min={20} max={100} step={5} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Workers nearby</span>
                  <span className="text-slate-600">{workerCount[0]}</span>
                </div>
                <RangeSlider value={workerCount[0]} onChange={setWorkerCount} min={1} max={3} step={1} />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
                <div>
                  <div className="text-sm font-medium">Auto reset after scenario</div>
                  <div className="text-xs text-slate-600">Useful during interviews to replay quickly</div>
                </div>
                <Toggle checked={autoReset} onChange={setAutoReset} />
              </div>
            </PanelContent>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitle className="text-xl">What the viewer is seeing</PanelTitle>
            </PanelHeader>
            <PanelContent>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  Current stage
                </div>
                <div className="mt-3 text-lg font-semibold">{STAGES[step]}</div>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  {step === 0 && "The system is waiting. No train has entered the monitored section yet."}
                  {step === 1 && "A train is still far away and approaching the monitored section from a much greater distance."}
                  {step === 2 && "The rail sensor detects vibration well before the train reaches the sensor location, triggering an early warning event."}
                  {step === 3 && "The nearby forwarder wirelessly receives the signal and relays it over long range."}
                  {step === 4 && "The station device near the workers receives the warning message and prepares local broadcast."}
                  {step === 5 && "Wearable devices alert workers immediately so they know a train is coming."}
                  {step === 6 && "Workers spread outward into safer positions while the train keeps passing through the section."}
                </p>
              </div>
            </PanelContent>
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitle className="text-xl">Extra interaction ideas</PanelTitle>
            </PanelHeader>
            <PanelContent>
              <div className="grid gap-3">
                {[
                  "Toggle between one-way rail section and a larger industrial site layout.",
                  "Add an option to simulate different warning distances or train speeds.",
                  "Let the user click each device to view its role, location, and communication type.",
                  "Show estimated timeline from detection to worker alert as a visual progress bar.",
                  "Add a comparison mode: current manual safety process vs. automated warning process.",
                  "Display a night/fog mode to emphasize why autonomous warning matters in low visibility.",
                ].map((idea) => (
                  <div key={idea} className="rounded-2xl border border-slate-200 p-3 text-sm text-slate-700 bg-white">
                    {idea}
                  </div>
                ))}
              </div>
            </PanelContent>
          </Panel>
        </div>
      </div>
    </div>
  );
}
