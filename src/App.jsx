import React, { useEffect, useRef, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STAGES = [
  "Idle",
  "Train approaching",
  "Rail vibrations detected",
  "Forwarder relays signal",
  "Station receives alert",
  "Wearables warn workers",
  "Workers move to safety",
  "Train clears the area",
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

const TRAIN_LEFT_BY_STEP = {
  0: -28,
  1: -14,
  2: -6,
  3: 2,
  4: 12,
  5: 24,
  6: 34,
  7: 88,
};

function StagePill({ active, children }) {
  return (
    <div
      className={`rounded-full px-3 py-1 text-sm md:text-base border transition-all ${
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
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-base font-medium transition ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function BadgePill({ children }) {
  return <span className="rounded-full border border-slate-200 px-3 py-1 text-sm">{children}</span>;
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
      <div className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/80 px-2 py-1 text-sm text-white shadow-lg whitespace-nowrap">
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
          <div className="rounded-2xl border px-3 py-3 shadow-xl backdrop-blur bg-white border-slate-200 w-60">
            <div className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 aspect-[4/5] flex items-center justify-center">
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
              <div className="hidden h-full w-full items-center justify-center text-center text-sm text-slate-500 p-4">
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
          className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
            alerted ? "bg-red-50 border-red-500 text-red-700" : "bg-white border-slate-400 text-slate-700"
          }`}
        >
          W
        </motion.div>
        <div className="rounded-full bg-white/90 border border-slate-200 px-2 py-0.5 text-xs text-slate-700 shadow-sm">
          {name}
        </div>
        <AnimatePresence>
          {alerted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white shadow"
            >
              ALERT
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function TrainWithCars() {
  return (
    <div className="relative h-20 w-[330px] scale-[0.88] origin-left">
      <div className="absolute left-0 bottom-1 h-16 w-[110px]">
        <div className="absolute bottom-5 left-1 h-8 w-[64px] rounded-md bg-red-500 border-2 border-red-700 shadow-md" />
        <div className="absolute bottom-8 left-[52px] h-8 w-[28px] rounded-t-md rounded-b-sm bg-red-400 border-2 border-red-700" />
        <div className="absolute bottom-5 left-[78px] h-10 w-[24px] rounded-md bg-slate-600 border-2 border-slate-800" />
        <div className="absolute bottom-2 left-[18px] h-5 w-5 rounded-full bg-zinc-900" />
        <div className="absolute bottom-2 left-[76px] h-5 w-5 rounded-full bg-zinc-900" />
      </div>

      <div className="absolute left-[106px] bottom-6 h-1 w-4 bg-zinc-700 rounded" />

      <div className="absolute left-[118px] bottom-1 h-16 w-[88px]">
        <div className="absolute bottom-5 left-0 h-8 w-[76px] rounded-md bg-slate-400 border-2 border-slate-600 shadow-sm" />
        <div className="absolute bottom-2 left-[12px] h-5 w-5 rounded-full bg-zinc-900" />
        <div className="absolute bottom-2 left-[56px] h-5 w-5 rounded-full bg-zinc-900" />
      </div>

      <div className="absolute left-[200px] bottom-6 h-1 w-4 bg-zinc-700 rounded" />

      <div className="absolute left-[212px] bottom-1 h-16 w-[88px]">
        <div className="absolute bottom-5 left-0 h-8 w-[76px] rounded-md bg-amber-400 border-2 border-amber-600 shadow-sm" />
        <div className="absolute bottom-2 left-[12px] h-5 w-5 rounded-full bg-zinc-900" />
        <div className="absolute bottom-2 left-[56px] h-5 w-5 rounded-full bg-zinc-900" />
      </div>
    </div>
  );
}

export default function RailwaySafetyInteractiveDemo() {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [autoReset, setAutoReset] = useState(true);
  const [teleportTrain, setTeleportTrain] = useState(false);

  const stepTimeoutRef = useRef(null);
  const finishTimeoutRef = useRef(null);

  const workers = workersDefault;
  const stepDelay = 1800;
  const trainMoveDuration = 1.05;
  const trainLeft = TRAIN_LEFT_BY_STEP[step] ?? TRAIN_LEFT_BY_STEP[0];

  const clearTimers = () => {
    if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    stepTimeoutRef.current = null;
    finishTimeoutRef.current = null;
  };

  const reset = () => {
    clearTimers();
    setIsRunning(false);
    setTeleportTrain(true);
    setStep(0);
    setTimeout(() => setTeleportTrain(false), 40);
  };

  const startScenario = () => {
    clearTimers();
    setTeleportTrain(true);
    setStep(0);
    setIsRunning(false);
    setTimeout(() => {
      setTeleportTrain(false);
      setStep(1);
      setIsRunning(true);
    }, 40);
  };

  const stepForward = () => {
    clearTimers();
    setIsRunning(false);
    setStep((prev) => Math.min(prev + 1, STAGES.length - 1));
  };

  const stepBack = () => {
    clearTimers();
    setIsRunning(false);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    clearTimers();

    if (!isRunning) return;

    if (step >= STAGES.length - 1) {
      if (autoReset) {
        finishTimeoutRef.current = setTimeout(() => {
          setIsRunning(false);
          setTeleportTrain(true);
          setStep(0);
          setTimeout(() => setTeleportTrain(false), 40);
        }, 5000);
      } else {
        setIsRunning(false);
      }
      return;
    }

    stepTimeoutRef.current = setTimeout(() => {
      setStep((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, stepDelay);

    return clearTimers;
  }, [isRunning, step, stepDelay, autoReset]);

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
                <p className="text-base text-slate-600 mt-2 max-w-2xl">
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

              <div className="absolute left-0 right-0 top-[50%] h-16 -translate-y-1/2 bg-slate-700/90 shadow-inner" />
              <div className="absolute left-0 right-0 top-[48.2%] h-1 bg-slate-300" />
              <div className="absolute left-0 right-0 top-[51.8%] h-1 bg-slate-300" />

              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-[50%] h-10 w-1.5 -translate-y-1/2 bg-amber-950/80 rounded"
                  style={{ left: `${1 + i * 2.75}%` }}
                />
              ))}

              <div className="absolute left-[27%] top-[28%] h-[22%] w-1 bg-slate-700" />
              <div className="absolute left-[26.2%] top-[22%] h-10 w-10 rounded-full bg-slate-700 border-4 border-white shadow-lg" />

              <div className="absolute left-[36%] top-[20%] h-[28%] w-3 rounded bg-slate-700" />
              <div className="absolute left-[35.2%] top-[16%] h-8 w-8 rounded-full bg-amber-500 border-4 border-white shadow-lg" />

              <div className="absolute left-[84%] top-[20%] h-[30%] w-4 rounded bg-slate-700" />
              <div className="absolute left-[83.1%] top-[15%] h-9 w-9 rounded-full bg-sky-600 border-4 border-white shadow-lg" />

              <motion.div
                className="absolute top-[43%] origin-left"
                animate={{ left: `${trainLeft}%` }}
                transition={teleportTrain ? { duration: 0 } : { duration: trainMoveDuration, ease: "easeInOut" }}
                style={{ left: `${trainLeft}%` }}
              >
                <TrainWithCars />
              </motion.div>

              <AnimatePresence>
                {step >= 1 && step < 7 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-[2%] top-[34%] rounded-full bg-white/95 px-3 py-1 text-sm font-medium border border-slate-200 shadow"
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

              <div className="absolute left-[2%] top-[39%] h-[21%] w-[30%] rounded-[40px] border-2 border-dashed border-emerald-500/70 bg-emerald-100/30" />
              <div className="absolute left-[23%] top-[62%] rounded-full bg-emerald-600 px-3 py-1 text-sm text-white shadow">
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
              <div className="absolute left-[70%] top-[66%] rounded-full bg-red-600 px-3 py-1 text-sm text-white shadow">
                Worker danger zone near rails
              </div>

              {workersDefault.map((w) => (
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
                imageAlt="Rail sensor"
              />
              <DeviceLabel
                x={37}
                y={40}
                title="Forwarder"
                subtitle="Mounted on a ~2 m pole near the sensor to relay the event wirelessly over long distance"
                icon={<Radio className="h-4 w-4" />}
                active={relayActive}
                imageSrc={deviceImages.forwarder}
                imageAlt="Forwarder"
              />
              <DeviceLabel
                x={84}
                y={40}
                title="Station Device"
                subtitle="Placed near workers to receive the alert and trigger local warning"
                icon={<Waves className="h-4 w-4" />}
                active={stationActive}
                imageSrc={deviceImages.station}
                imageAlt="Station device"
              />
              <DeviceLabel
                x={74}
                y={65}
                title="Wearables"
                subtitle="Immediately warn workers so they move away from the track zone"
                icon={<ShieldAlert className="h-4 w-4" />}
                active={workersAlerted}
                imageSrc={deviceImages.wearables}
                imageAlt="Wearables"
              />

              <AnimatePresence>
                {workersMoved && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-4 bottom-4 rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-xl"
                    >
                      <div className="font-semibold text-lg">
                        {step >= 7 ? "Train passed safely" : "Workers reached safer positions"}
                      </div>
                      <div className="text-sm text-emerald-50 mt-1">
                        {step >= 7
                          ? "The train clears the work area in a separate final step."
                          : "Workers are clear of the rails. The next step sends the train out of the scene."}
                      </div>
                    </motion.div>

                    {step >= 7 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="absolute right-6 top-[36%] rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg"
                      >
                        Train passed safely
                      </motion.div>
                    )}
                  </>
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
                <UIButton onClick={stepBack} variant="outline">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Step back
                </UIButton>
                <UIButton onClick={stepForward} variant="outline">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Step forward
                </UIButton>
                <UIButton onClick={reset} variant="ghost">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </UIButton>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
                <div>
                  <div className="text-base font-medium">Auto reset after final step</div>
                  <div className="text-sm text-slate-600">
                    Train pauses for 5 seconds at the end, then teleports back.
                  </div>
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
                <div className="flex items-center gap-2 text-base font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  Current stage
                </div>
                <div className="mt-3 text-xl font-semibold">{STAGES[step]}</div>
                <p className="mt-2 text-base text-slate-600 leading-7">
                  {step === 0 && "The system is waiting. No train has entered the monitored section yet."}
                  {step === 1 && "The train moves into the monitored approach zone."}
                  {step === 2 && "The rail sensor detects vibration before the train reaches the workers."}
                  {step === 3 && "The forwarder relays the warning further down the line."}
                  {step === 4 && "The station device near the workers receives the alert."}
                  {step === 5 && "Wearables warn workers that a train is approaching."}
                  {step === 6 && "Workers spread outward into safer positions and the train pauses before the final clearance step."}
                  {step === 7 && "The train clears the work area in a separate final step after workers are already safe."}
                </p>
              </div>
            </PanelContent>
          </Panel>


        </div>
      </div>
    </div>
  );
}
