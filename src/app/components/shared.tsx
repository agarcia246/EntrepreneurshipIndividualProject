import { motion, useTransform, useMotionValue, animate } from "motion/react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function PageHeader({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  action?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {back && (
            <button
              onClick={() => navigate(back)}
              aria-label="Go back"
              className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </motion.div>
  );
}

export function AnimatedNumber({
  value,
  suffix = "",
  className = "",
  duration = 1,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    return controls.stop;
  }, [value, duration, motionValue]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v.toLocaleString() + suffix;
    });
    return unsubscribe;
  }, [rounded, suffix]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}

export function AnimatedProgress({
  value,
  max = 100,
  className = "",
  barClass = "bg-white",
  height = "h-2",
}: {
  value: number;
  max?: number;
  className?: string;
  barClass?: string;
  height?: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className={`${height} bg-white/20 rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        className={`h-full rounded-full ${barClass}`}
      />
    </div>
  );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-[var(--shadow-card)] animate-pulse">
      <div className="h-4 bg-muted rounded-lg w-1/3 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-muted rounded-lg mb-2"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonScreen({ cards = 4 }: { cards?: number }) {
  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6 space-y-4">
      <div className="animate-pulse">
        <div className="h-7 bg-muted rounded-lg w-2/5 mb-2" />
        <div className="h-4 bg-muted rounded-lg w-3/5" />
      </div>
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} lines={i === 0 ? 2 : 3} />
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[260px] mb-5">{description}</p>
      {action}
    </motion.div>
  );
}

export function StatPill({
  icon: Icon,
  label,
  value,
  suffix = "",
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
        <Icon className="w-5 h-5 opacity-90" />
      </div>
      <AnimatedNumber value={value} suffix={suffix} className="text-2xl font-bold" />
      <span className="text-[11px] opacity-70 leading-tight">{label}</span>
    </div>
  );
}

export function GradientCard({
  children,
  gradient = "var(--gradient-primary)",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  gradient?: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ background: gradient }}
      className={`rounded-2xl p-5 text-white shadow-[var(--shadow-elevated)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Card({
  children,
  className = "",
  delay = 0,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      className={`bg-card rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow ${onClick ? "cursor-pointer active:scale-[0.98]" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function OnboardingProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="h-1 rounded-full flex-1"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          style={{
            background: i < step ? "var(--primary)" : "var(--border)",
            transformOrigin: "left",
          }}
        />
      ))}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
  variant = "solid",
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    variant === "solid"
      ? "text-white shadow-[var(--shadow-card)] active:shadow-none"
      : variant === "outline"
      ? "border-2 border-primary text-primary bg-transparent"
      : "text-primary bg-transparent";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={variant === "solid" ? { background: "var(--gradient-primary)" } : undefined}
      className={`w-full py-3.5 rounded-xl font-semibold text-[15px] disabled:opacity-50 transition-all flex items-center justify-center gap-2 ${base} ${className}`}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
        />
      )}
      {children}
    </motion.button>
  );
}
