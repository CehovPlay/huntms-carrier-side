import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  Download,
  FileText,
  Fuel,
  Home,
  LogOut,
  MapPin,
  Menu,
  Navigation,
  Plus,
  Receipt,
  Route,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Truck,
  Upload,
  UserRound,
  WalletCards,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const navSections = [
  { title: "Account", items: [{ id: "overview", label: "Home", icon: Home }, { id: "fleet", label: "Equipment", icon: Truck }, { id: "drivers", label: "Drivers", icon: UserRound }, { id: "settings", label: "Settings", icon: Settings }] },
  { title: "Freight", items: [{ id: "timeline", label: "Timeline", icon: Clock3 }, { id: "loads", label: "Loads", icon: Route }, { id: "map", label: "Map", icon: MapPin }, { id: "invoices", label: "Invoices", icon: FileText }, { id: "expenses", label: "Expenses", icon: Receipt }, { id: "salaries", label: "Salaries", icon: WalletCards }, { id: "fuel-cards", label: "Fuel Cards", icon: Fuel, disabled: true }] },
  { title: "Analytics", items: [{ id: "reports", label: "Reports", icon: BarChart3 }, { id: "analytics", label: "Analytics", icon: BarChart3, disabled: true }, { id: "insights", label: "Insights", icon: Activity, disabled: true }, { id: "activities", label: "Activities", icon: Activity, disabled: true }] },
];

const truckRows = [
  { id: "TRK-1974", unit: "#1974", driver: "Gudelio Ramos", trailer: "TRL-8841", fleet: "Zigzag Carrier LLC", status: "In Transit", cost: "$3,120/mo · $0.18/mi", next: "Delivery tomorrow", vin: "3AKJGLDR9KSKA1974", tag: "IL 88291P", fixed: "$3,120/mo", variable: "$0.18/mi" },
  { id: "TRK-2042", unit: "#2042", driver: "Andrew Stone", trailer: "TRL-1209", fleet: "Hunt Logistics", status: "Available", cost: "$2,840/mo · $0.14/mi", next: "Ready for load", vin: "1XPBD49X7JD204200", tag: "TX 74012K", fixed: "$2,840/mo", variable: "$0.14/mi" },
  { id: "TRK-1888", unit: "#1888", driver: "Maks Orlov", trailer: "TRL-7092", fleet: "Zigzag Carrier LLC", status: "Out of Service", cost: "$2,460/mo · $0.11/mi", next: "DOT inspection", vin: "4V4NC9EH8LN188800", tag: "OH 3812RT", fixed: "$2,460/mo", variable: "$0.11/mi" },
];

const driverRows = [
  { id: "DRV-1001", name: "Gudelio Ramos", email: "gudelio@zigzagcarrier.com", phone: "+1 312 555 0194", fleet: "Zigzag Carrier LLC", truck: "#1974", type: "Company Driver", status: "Active", app: "Enabled", payroll: "Enabled", docs: "Valid", safety: "Clear", cdl: "2027-02-18", medical: "2026-09-15", states: "None" },
  { id: "DRV-1002", name: "Andrew Stone", email: "andrew@huntlogistics.com", phone: "+1 214 555 0132", fleet: "Hunt Logistics", truck: "#2042", type: "Owner Operator", status: "Active", app: "Enabled", payroll: "Enabled", docs: "Expiring", safety: "Clear", cdl: "2026-06-20", medical: "2026-07-11", states: "CA, OR" },
  { id: "DRV-1003", name: "Maks Orlov", email: "maks@zigzagcarrier.com", phone: "+1 773 555 0188", fleet: "Zigzag Carrier LLC", truck: "#1888", type: "Company Driver", status: "Review", app: "Disabled", payroll: "Disabled", docs: "Missing", safety: "Needs review", cdl: "2026-12-01", medical: "Missing", states: "NY" },
];

const timelineRows = [
  { id: "TL-1974", truck: "#1974", driver: "Gudelio Ramos", badge: "R", home: "09/27 SOUTH WINDSOR CT", status: "On Route", note: "Running late", bars: [{ id: "T1974-A", status: "On Route", from: "MIAMI, FL", to: "SOUTH WINDSOR, CT", start: 46, width: 22, startLabel: "19:00 Appt.", endLabel: "00:01", tone: "blue" }] },
  { id: "TL-2042", truck: "#2042", driver: "Andrew Stone", badge: "OO", home: "09/20 DENVER CO", status: "Delivered", note: "Expense review needed", bars: [{ id: "T2042-A", status: "Delivered", from: "AUSTIN, TX", to: "DENVER, CO", start: 15, width: 35, startLabel: "FCFS", endLabel: "14:30", tone: "green" }] },
  { id: "TL-1888", truck: "#1888", driver: "Maks Orlov", badge: "R", home: "09/18 PHOENIX AZ", status: "Delivered", note: "Docs missing", bars: [{ id: "T1888-A", status: "Delivered", from: "OMAHA, NE", to: "PHOENIX, AZ", start: 5, width: 31, startLabel: "10:00", endLabel: "07:00", tone: "green" }] },
];

const invoiceRows = [
  { ref: "#101907", status: "In Review", load: "#9157553", customer: "Blue Arrow Brokerage", fleet: "Zigzag Carrier LLC", truck: "#1974 · Gudelio Ramos", pickup: "May 18 · 08:00-12:00", delivery: "May 20 · 09:00", amount: "$3,450.00", age: "2 / 30", issue: "Missing POD" },
  { ref: "#101908", status: "Invoiced", load: "#9157619", customer: "Summit Freight Partners", fleet: "Hunt Logistics", truck: "#2042 · Andrew Stone", pickup: "May 16 · FCFS", delivery: "May 19 · 14:30", amount: "$2,875.00", age: "4 / 30" },
  { ref: "#101909", status: "Partial", load: "#9157901", customer: "Northline Transport", fleet: "Zigzag Carrier LLC", truck: "#1888 · Maks Orlov", pickup: "May 13 · 10:00", delivery: "May 15 · 07:00", amount: "$4,100.00", age: "6 / 15", issue: "Aging risk" },
  { ref: "#101910", status: "Paid", load: "#9158028", customer: "Delta Fresh Logistics", fleet: "Hunt Logistics", truck: "#2042 · Andrew Stone", pickup: "May 10 · 12:00", delivery: "May 12 · 16:00", amount: "$2,225.00", age: "Paid" },
];

const expenseRows = [
  { id: "EXP-4421", type: "Fuel", amount: "$615.22", date: "May 19, 2026", fleet: "Zigzag Carrier LLC", truck: "#1974", driver: "Gudelio Ramos", load: "#9157553", status: "Approved", receipt: "Uploaded", match: "Assigned", approval: "Approved", impact: "Included in accounting" },
  { id: "EXP-4422", type: "Toll", amount: "$84.90", date: "May 19, 2026", fleet: "Hunt Logistics", truck: "#2042", driver: "Andrew Stone", load: "#9157619", status: "Review", receipt: "Uploaded", match: "Suggested", approval: "Review", impact: "Pending" },
  { id: "EXP-4423", type: "Maintenance", amount: "$1,240.00", date: "May 18, 2026", fleet: "Zigzag Carrier LLC", truck: "—", driver: "—", load: "—", status: "Review", receipt: "Missing", match: "Unassigned", approval: "Review", impact: "Pending" },
];

const salaryRows = [
  { id: "SET-1048", driver: "Gudelio Ramos", truck: "#1974", period: "May 13 - May 20", loads: 1, gross: "$720", deductions: "$245", reimbursements: "$60", net: "$535", status: "Ready", warning: "All docs valid" },
  { id: "SET-1049", driver: "Andrew Stone", truck: "#2042", period: "May 13 - May 20", loads: 1, gross: "$690", deductions: "$96", reimbursements: "$140", net: "$734", status: "Review", warning: "Expense needs review" },
  { id: "SET-1050", driver: "Maks Orlov", truck: "#1888", period: "May 06 - May 13", loads: 1, gross: "$690", deductions: "$420", reimbursements: "$0", net: "$270", status: "Paid", warning: "Paid on May 15" },
];

const canonicalLoadRows = [
  { id: "#9157553", source: "Driver documents", trip: "Chicago, IL → Dallas, TX", origin: "Chicago, IL", destination: "Dallas, TX", driver: "Gudelio Ramos", truck: "#1974", customer: "Blue Arrow Brokerage", status: "Delivered", docs: "Missing POD", invoice: "#101907", invoiceStatus: "In Review", expense: "$615.22", expenseStatus: "Approved", salary: "SET-1048", salaryStatus: "Ready", margin: "$2,595", next: "Upload POD before invoice send", rate: "$3,450", miles: "1,432 mi", pickup: "May 18 · 08:00-12:00", delivery: "May 20 · 09:00", documents: ["Rate Confirmation", "BOL", "POD missing", "Invoice PDF draft"] },
  { id: "#9157619", source: "Dispatch import", trip: "Austin, TX → Denver, CO", origin: "Austin, TX", destination: "Denver, CO", driver: "Andrew Stone", truck: "#2042", customer: "Summit Freight Partners", status: "Delivered", docs: "Ready", invoice: "#101908", invoiceStatus: "Invoiced", expense: "$84.90", expenseStatus: "Needs assignment", salary: "SET-1049", salaryStatus: "Review", margin: "$2,235", next: "Review expense", rate: "$2,875", miles: "1,260 mi", pickup: "May 16 · FCFS", delivery: "May 19 · 14:30", documents: ["Rate Confirmation", "BOL", "POD", "Toll receipt uploaded"] },
  { id: "#9157901", source: "Manual entry", trip: "Omaha, NE → Phoenix, AZ", origin: "Omaha, NE", destination: "Phoenix, AZ", driver: "Maks Orlov", truck: "#1888", customer: "Northline Transport", status: "Docs Missing", docs: "Missing POD", invoice: "#101909", invoiceStatus: "Partial", expense: "$1,240.00", expenseStatus: "Needs receipt", salary: "SET-1050", salaryStatus: "Paid", margin: "$3,080", next: "Upload POD / receipt", rate: "$4,100", miles: "1,540 mi", pickup: "May 13 · 10:00", delivery: "May 15 · 07:00", documents: ["Rate Confirmation", "BOL", "POD missing", "Maintenance receipt missing"] },
];

const reportRows = [
  { id: "RPT-1101", name: "Profit by Load", metric: "$8,140 net profit", period: "May 13 - May 20", status: "Generated", source: "Performance overview" },
  { id: "RPT-1102", name: "Driver Performance", metric: "12 loads · 94% on-time", period: "May 13 - May 20", status: "Draft", source: "Driver scorecard" },
  { id: "RPT-1103", name: "Invoice Aging", metric: "$14,525 open", period: "May 2026", status: "Generated", source: "Receivables summary" },
  { id: "RPT-1104", name: "Expense Breakdown", metric: "$6,920 total expenses", period: "May 2026", status: "Generated", source: "Expense summary" },
];

const statusTone = {
  Available: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Enabled: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Valid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Uploaded: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Approved: "border-slate-200 bg-slate-50 text-slate-700",
  Ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Reviewed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Generated: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Review: "border-amber-200 bg-amber-50 text-amber-700",
  Missing: "border-amber-200 bg-amber-50 text-amber-700",
  Pending: "border-slate-200 bg-slate-50 text-slate-600",
  Suggested: "border-slate-200 bg-slate-50 text-slate-700",
  Unassigned: "border-red-200 bg-red-50 text-red-700",
  Disabled: "border-slate-200 bg-slate-50 text-slate-600",
  Waiting: "border-slate-200 bg-slate-50 text-slate-600",
  Excluded: "border-slate-200 bg-slate-50 text-slate-600",
  Linked: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Assigned: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Overhead: "border-slate-200 bg-slate-50 text-slate-700",
  Online: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Offline: "border-slate-200 bg-slate-50 text-slate-600",
  Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Invoiced: "border-slate-200 bg-slate-50 text-slate-700",
  Partial: "border-orange-200 bg-orange-50 text-orange-700",
  Draft: "border-slate-200 bg-slate-50 text-slate-600",
  "Needs receipt": "border-amber-200 bg-amber-50 text-amber-700",
  "Needs assignment": "border-amber-200 bg-amber-50 text-amber-700",
  "Needs review": "border-amber-200 bg-amber-50 text-amber-700",
  "Ready to approve": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Ready to pay": "border-slate-200 bg-slate-50 text-slate-700",
  "In Transit": "border-slate-200 bg-slate-50 text-slate-700",
  "Out of Service": "border-red-200 bg-red-50 text-red-700",
  "On Route": "border-cyan-200 bg-cyan-50 text-cyan-700",
  "Not Ready": "border-slate-200 bg-slate-50 text-slate-600",
  "In Review": "border-purple-200 bg-purple-50 text-purple-700",
  "Docs Missing": "border-amber-200 bg-amber-50 text-amber-700",
  "No loads": "border-slate-200 bg-slate-50 text-slate-600",
  "En route": "border-slate-200 bg-slate-50 text-slate-700",
};

const statusIconMap = {
  Available: CheckCircle2,
  Active: CheckCircle2,
  Enabled: CheckCircle2,
  Valid: CheckCircle2,
  Uploaded: CheckCircle2,
  Approved: CheckCircle2,
  Ready: CheckCircle2,
  Reviewed: CheckCircle2,
  Paid: CheckCircle2,
  Delivered: CheckCircle2,
  Review: AlertTriangle,
  Missing: AlertTriangle,
  Unassigned: AlertTriangle,
  Suggested: Route,
  "Needs receipt": Upload,
  "Needs assignment": Route,
  "Needs review": AlertTriangle,
  "Ready to approve": CheckCircle2,
  "Ready to pay": DollarSign,
  "On Route": Route,
  "In Transit": Route,
  "Out of Service": AlertTriangle,
  "In Review": Clock3,
  Invoiced: Send,
  Partial: Clock3,
  Draft: FileText,
  Disabled: X,
  Pending: Clock3,
  Linked: CheckCircle2,
  Assigned: CheckCircle2,
  Overhead: Receipt,
  Online: Wifi,
  Offline: WifiOff,
  "No loads": Clock3,
  "En route": Route,
  Resolved: CheckCircle2,
  Generated: CheckCircle2,
  Waiting: Clock3,
  Excluded: X,
};

const rolePermissions = {
  Admin: ["create", "edit", "upload", "send", "approve", "pay", "export"],
  Manager: ["create", "edit", "upload", "send", "approve", "export"],
  Accounting: ["create", "edit", "upload", "send", "approve", "pay", "export"],
  Dispatcher: ["upload", "export"],
  "Read-only": ["export"],
};

const chartData = [
  { month: "Jan", revenue: 28600, expenses: 14200, profit: 7200, rpm: 2.18, loads: 18, utilization: 72 },
  { month: "Feb", revenue: 31200, expenses: 15100, profit: 8100, rpm: 2.24, loads: 21, utilization: 76 },
  { month: "Mar", revenue: 34800, expenses: 16900, profit: 8900, rpm: 2.31, loads: 24, utilization: 78 },
  { month: "Apr", revenue: 38200, expenses: 17400, profit: 10200, rpm: 2.36, loads: 26, utilization: 81 },
  { month: "May", revenue: 42800, expenses: 16240, profit: 8140, rpm: 2.41, loads: 29, utilization: 84 },
  { month: "Jun", revenue: 46100, expenses: 18100, profit: 11600, rpm: 2.47, loads: 31, utilization: 87 },
];

const expenseBreakdownData = [
  { label: "Fuel", value: 6150, percent: 48 },
  { label: "Tolls", value: 1340, percent: 11 },
  { label: "Maintenance", value: 3220, percent: 25 },
  { label: "Insurance", value: 2060, percent: 16 },
];

const invoiceAgingData = [
  { label: "0-15", value: 8420, percent: 58 },
  { label: "16-30", value: 4110, percent: 28 },
  { label: "30+", value: 1995, percent: 14 },
];

const driverPerformanceData = [
  { label: "Gudelio", value: 94, sub: "$2.41 RPM" },
  { label: "Andrew", value: 88, sub: "$2.28 RPM" },
  { label: "Maks", value: 72, sub: "Docs review" },
];

const canRole = (role, action) => Boolean(rolePermissions[role]?.includes(action));
const moneyNumber = (value) => Number(String(value || "0").replace(/[^0-9.-]/g, "")) || 0;
const formatMoney = (value) => `$${Number(value || 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const contains = (row, q) => !q || JSON.stringify(row).toLowerCase().includes(q.toLowerCase());

const STORAGE_KEY = "hunt_tms_carrier_mvp_state_v2";
const demoState = {
  active: "overview",
  theme: "dark",
  role: "Accounting",
  truckRecords: truckRows,
  driverRecords: driverRows,
  timelineRecords: timelineRows,
  invoiceRecords: invoiceRows,
  expenseRecords: expenseRows,
  salaryRecords: salaryRows,
  reportRecords: reportRows,
  loadRecords: canonicalLoadRows,
};

const safeClone = (value) => JSON.parse(JSON.stringify(value));
const readStoredDemoState = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    console.warn("Failed to read Hunt TMS demo state", error);
    return null;
  }
};

const writeStoredDemoState = (state) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to persist Hunt TMS demo state", error);
  }
};

function MotionStyles() {
  return <style>{`
    @keyframes lhFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes lhScaleIn { from { opacity: 0; transform: translateY(10px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes lhDrawerIn { from { opacity: .4; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes lhOverlayFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes lhToastIn { 0% { opacity: 0; transform: translateY(12px) scale(.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes lhRouteFlow { to { stroke-dashoffset: -18; } }
    @keyframes lhPulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.45); opacity: .58; } }
    @keyframes lhLogoPulse { 0%, 100% { transform: scale(1); opacity: 1; } 45% { transform: scale(1.08); opacity: .92; } 70% { transform: scale(.98); opacity: 1; } }
    @keyframes lhLogoOrbit { 0% { transform: rotate(0deg) scale(.92); opacity: .28; } 50% { transform: rotate(180deg) scale(1.08); opacity: .55; } 100% { transform: rotate(360deg) scale(.92); opacity: .28; } }

    .motion-card { animation: lhFadeUp .34s cubic-bezier(.2,.8,.2,1) both; transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background-color .18s ease; will-change: transform; }
    .motion-card:hover { transform: translateY(-2px); box-shadow: 0 18px 45px rgba(15,23,42,.08); }
    .motion-btn { transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease, border-color .16s ease, color .16s ease; }
    .motion-btn:hover:not(:disabled) { transform: translateY(-1px); }
    .motion-btn:active:not(:disabled) { transform: translateY(0) scale(.985); }
    .motion-badge { transition: transform .16s ease, background-color .16s ease, border-color .16s ease; }
    .motion-badge:hover { transform: translateY(-1px); }
    .motion-field { transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease, background-color .16s ease; }
    .motion-field:focus-within { transform: translateY(-1px); }
    .lh-overlay { animation: lhOverlayFade .18s ease both; }
    .lh-drawer { animation: lhDrawerIn .22s cubic-bezier(.2,.8,.2,1) both; }
    .lh-modal { animation: lhScaleIn .22s cubic-bezier(.2,.8,.2,1) both; }
    .lh-toast { animation: lhToastIn .22s cubic-bezier(.2,.8,.2,1) both; }
    .lh-route-flow { stroke-dasharray: 4 3; animation: lhRouteFlow 1.1s linear infinite; }
    .lh-logo-pulse { transform-box: fill-box; transform-origin: center; animation: lhLogoPulse 1.6s ease-in-out infinite; }
    .lh-logo-orbit { transform-box: fill-box; transform-origin: center; animation: lhLogoOrbit 2.2s linear infinite; }

    aside nav button,
    header button,
    .lg\:hidden button,
    [class*="overflow-x-auto"] button {
      transition: transform .16s ease, background-color .16s ease, border-color .16s ease, color .16s ease, box-shadow .16s ease;
    }
    aside nav button:hover:not(:disabled),
    header button:hover:not(:disabled),
    .lg\:hidden button:hover:not(:disabled),
    [class*="overflow-x-auto"] button:hover:not(:disabled) {
      transform: translateY(-1px);
    }
    aside nav button:active:not(:disabled),
    header button:active:not(:disabled),
    [class*="overflow-x-auto"] button:active:not(:disabled) {
      transform: translateY(0) scale(.985);
    }

    tbody tr,
    [class*="divide-y"] > button,
    [class*="grid gap-3"] > button,
    [class*="space-y-1"] > button,
    [class*="space-y-2"] > button,
    [class*="space-y-3"] > button {
      transition: transform .16s ease, background-color .16s ease, border-color .16s ease, box-shadow .16s ease;
    }
    tbody tr:hover,
    [class*="divide-y"] > button:hover,
    [class*="grid gap-3"] > button:hover,
    [class*="space-y-1"] > button:hover,
    [class*="space-y-2"] > button:hover,
    [class*="space-y-3"] > button:hover {
      transform: translateY(-1px);
    }

    .fixed.inset-0[class*="z-[90]"],
    .fixed.inset-0[class*="z-[100]"] {
      animation: lhOverlayFade .18s ease both;
    }
    .fixed.inset-0[class*="z-[90]"] > div,
    .fixed.inset-0[class*="z-[100]"] > div {
      animation: lhScaleIn .22s cubic-bezier(.2,.8,.2,1) both;
    }
    .fixed.bottom-5.right-5 {
      animation: lhToastIn .22s cubic-bezier(.2,.8,.2,1) both;
    }

    /* Map pins must stay static. Animations on absolute pin wrappers cause hover jitter. */
    button[data-map-interactive="true"],
    button[data-map-interactive="true"]:hover,
    button[data-map-interactive="true"]:active {
      transform: translate(-50%, -100%) !important;
      filter: none !important;
      transition: none !important;
      animation: none !important;
    }
    button[data-map-interactive="true"] *,
    button[data-map-interactive="true"] *::before,
    button[data-map-interactive="true"] *::after {
      transition: none !important;
      animation: none !important;
    }
    button[data-map-interactive="true"] > div:last-child,
    button[data-map-interactive="true"]:hover > div:last-child,
    button[data-map-interactive="true"]:active > div:last-child {
      transform: none !important;
    }
    button[data-map-interactive="true"] > div:last-child::after {
      content: none !important;
      display: none !important;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: .001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: .001ms !important;
      }
    }

    input:not(.lh-search-field):not(.lh-flat-input):not([type="checkbox"]):not([type="radio"]), select, textarea {
      box-sizing: border-box !important;
      min-height: 2.5rem !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: .75rem !important;
      background-color: #fff !important;
      font-size: .875rem !important;
      line-height: 1.25rem !important;
      color: #0f172a !important;
      transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease !important;
    }
    input:not(.lh-search-field):not(.lh-flat-input):not([type="checkbox"]):not([type="radio"]), select { padding-left: .875rem !important; padding-right: .875rem !important; }
    textarea { padding: .75rem .875rem !important; }
    select {
      appearance: none !important;
      padding-right: 2.35rem !important;
      background-image: linear-gradient(45deg, transparent 50%, #64748b 50%), linear-gradient(135deg, #64748b 50%, transparent 50%) !important;
      background-position: calc(100% - 18px) 50%, calc(100% - 13px) 50% !important;
      background-size: 5px 5px, 5px 5px !important;
      background-repeat: no-repeat !important;
    }
    input:not(.lh-search-field):not(.lh-flat-input):not([type="checkbox"]):not([type="radio"]):focus, select:focus, textarea:focus {
      border-color: #2563eb !important;
      box-shadow: 0 0 0 4px rgba(37,99,235,.12) !important;
      outline: none !important;
    }
    input[type="checkbox"], input[type="radio"] { accent-color: #0f172a; }
    input.lh-search-field, input.lh-flat-input {
      height: auto !important;
      min-height: 0 !important;
      width: 100% !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      padding: 0 !important;
      outline: none !important;
    }
    input.lh-search-field:focus, input.lh-flat-input:focus {
      border: 0 !important;
      box-shadow: none !important;
      outline: none !important;
    }
    select.bg-transparent { border: 0 !important; box-shadow: none !important; background-color: transparent !important; background-image: none !important; min-height: auto !important; padding-left: 0 !important; padding-right: 0 !important; }

    .dark {
      --lh-bg: #0b0b0c;
      --lh-app: #0f0f10;
      --lh-surface: #161616;
      --lh-surface-2: #1d1d1d;
      --lh-surface-3: #262626;
      --lh-hover: #242424;
      --lh-border: #303030;
      --lh-border-soft: #262626;
      --lh-text: #f4f2ee;
      --lh-text-2: #d7d3cd;
      --lh-muted: #aaa39b;
      --lh-faint: #7c756d;
      color-scheme: dark;
      background: var(--lh-bg) !important;
      color: var(--lh-text) !important;
    }

    .dark.bg-slate-50,
    .dark .bg-slate-50,
    .dark .bg-slate-50\/90,
    .dark .bg-slate-50\/95,
    .dark [class*="bg-slate-50"] {
      background-color: var(--lh-app) !important;
    }
    .dark,
    .dark main,
    .dark section,
    .dark nav {
      background-color: var(--lh-bg) !important;
    }
    .dark aside,
    .dark header,
    .dark .bg-white,
    .dark .bg-white\/80,
    .dark .bg-white\/90,
    .dark .bg-white\/95,
    .dark [class*="bg-white"] {
      background-color: var(--lh-surface) !important;
    }
    .dark .bg-slate-100,
    .dark [class*="bg-slate-100"] {
      background-color: var(--lh-surface-2) !important;
    }
    .dark .bg-slate-200,
    .dark [class*="bg-slate-200"],
    .dark .bg-slate-950,
    .dark [class*="bg-slate-950"] {
      background-color: var(--lh-surface-3) !important;
    }

    .dark .border-slate-100,
    .dark .border-slate-200,
    .dark .border-slate-300,
    .dark [class*="border-slate-100"],
    .dark [class*="border-slate-200"],
    .dark [class*="border-slate-300"],
    .dark .rounded-xl,
    .dark .rounded-2xl,
    .dark .rounded-3xl,
    .dark .rounded-\[22px\] {
      border-color: var(--lh-border) !important;
    }
    .dark .divide-slate-100 > :not([hidden]) ~ :not([hidden]),
    .dark .divide-slate-200 > :not([hidden]) ~ :not([hidden]),
    .dark [class*="divide-slate-100"] > :not([hidden]) ~ :not([hidden]),
    .dark [class*="divide-slate-200"] > :not([hidden]) ~ :not([hidden]) {
      border-color: var(--lh-border-soft) !important;
    }
    .dark .border-white\/70 { border-color: rgba(255,255,255,.14) !important; }

    .dark .text-slate-950,
    .dark .text-slate-900,
    .dark [class*="text-slate-950"],
    .dark [class*="text-slate-900"],
    .dark .font-semibold:not([class*="text-emerald"]):not([class*="text-amber"]):not([class*="text-red"]):not([class*="text-orange"]):not([class*="text-purple"]):not([class*="text-cyan"]):not([class*="text-white"]) {
      color: var(--lh-text) !important;
    }
    .dark .text-slate-800,
    .dark .text-slate-700,
    .dark [class*="text-slate-800"],
    .dark [class*="text-slate-700"] {
      color: var(--lh-text-2) !important;
    }
    .dark .text-slate-600,
    .dark .text-slate-500,
    .dark [class*="text-slate-600"],
    .dark [class*="text-slate-500"] {
      color: var(--lh-muted) !important;
    }
    .dark .text-slate-400,
    .dark [class*="text-slate-400"] {
      color: var(--lh-faint) !important;
    }
    .dark .text-white { color: #ffffff !important; }

    .dark .hover\:bg-slate-50:hover,
    .dark .hover\:bg-slate-100:hover,
    .dark .hover\:bg-white:hover,
    .dark tr:hover,
    .dark tbody tr:hover {
      background-color: var(--lh-hover) !important;
    }
    .dark .hover\:text-slate-950:hover,
    .dark .hover\:text-slate-900:hover {
      color: var(--lh-text) !important;
    }

    .dark table {
      width: 100%;
      background-color: var(--lh-surface) !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
    }
    .dark thead,
    .dark table thead,
    .dark thead[class*="bg-slate-50"] {
      background-color: #1b1b1b !important;
      color: var(--lh-muted) !important;
    }
    .dark tbody,
    .dark tbody.bg-white {
      background-color: var(--lh-surface) !important;
    }
    .dark tbody tr {
      background-color: var(--lh-surface) !important;
    }
    .dark tbody.divide-y > tr + tr,
    .dark tbody tr + tr td,
    .dark tbody tr + tr th {
      border-top: 1px solid var(--lh-border-soft) !important;
    }
    .dark th,
    .dark td {
      border-color: var(--lh-border-soft) !important;
    }

    .dark input:not(.lh-search-field):not(.lh-flat-input):not([type="checkbox"]):not([type="radio"]),
    .dark select,
    .dark textarea {
      background-color: #111111 !important;
      border-color: var(--lh-border) !important;
      color: var(--lh-text) !important;
    }
    .dark input:not(.lh-search-field):not(.lh-flat-input):not([type="checkbox"]):not([type="radio"]):focus,
    .dark select:focus,
    .dark textarea:focus,
    .dark .focus-within\:border-blue-500:focus-within {
      border-color: #686868 !important;
      box-shadow: 0 0 0 4px rgba(130,130,130,.16) !important;
    }
    .dark input.lh-search-field,
    .dark input.lh-flat-input {
      color: var(--lh-text) !important;
    }
    .dark .placeholder\:text-slate-400::placeholder,
    .dark input::placeholder,
    .dark textarea::placeholder {
      color: var(--lh-faint) !important;
    }
    .dark input[type="checkbox"], .dark input[type="radio"] { accent-color: #737373; }

    .dark button[class*="bg-slate-950"],
    .dark [class*="bg-slate-950"][class*="text-white"] {
      background-color: #2b2b2b !important;
      border-color: #3a3a3a !important;
      color: #ffffff !important;
    }
    .dark button[class*="bg-slate-950"]:hover,
    .dark [class*="hover:bg-slate-800"]:hover {
      background-color: #383838 !important;
    }
    .dark button[class*="bg-white"] {
      background-color: var(--lh-surface) !important;
      color: var(--lh-text-2) !important;
    }
    .dark button[class*="bg-white"]:hover {
      background-color: var(--lh-hover) !important;
      color: var(--lh-text) !important;
    }
    .dark button:disabled { opacity: .48 !important; }

    .dark .bg-emerald-50, .dark [class*="bg-emerald-50"] { background-color: rgba(6,78,59,.28) !important; }
    .dark .bg-amber-50, .dark [class*="bg-amber-50"] { background-color: rgba(120,53,15,.32) !important; }
    .dark .bg-red-50, .dark [class*="bg-red-50"] { background-color: rgba(127,29,29,.32) !important; }
    .dark .bg-orange-50, .dark [class*="bg-orange-50"] { background-color: rgba(124,45,18,.32) !important; }
    .dark .bg-purple-50, .dark [class*="bg-purple-50"] { background-color: rgba(76,29,149,.28) !important; }
    .dark .bg-cyan-50, .dark [class*="bg-cyan-50"] { background-color: rgba(22,78,99,.28) !important; }
    .dark .border-emerald-200 { border-color: rgba(52,211,153,.30) !important; }
    .dark .border-amber-200 { border-color: rgba(251,191,36,.32) !important; }
    .dark .border-red-200 { border-color: rgba(248,113,113,.32) !important; }
    .dark .border-orange-200 { border-color: rgba(251,146,60,.32) !important; }
    .dark .border-purple-200 { border-color: rgba(196,181,253,.28) !important; }
    .dark .border-cyan-200 { border-color: rgba(103,232,249,.28) !important; }
    .dark .text-emerald-700, .dark .text-emerald-800 { color: #6ee7b7 !important; }
    .dark .text-amber-700, .dark .text-amber-800 { color: #fbbf24 !important; }
    .dark .text-red-700, .dark .text-red-600 { color: #fca5a5 !important; }
    .dark .text-orange-700, .dark .text-orange-600, .dark .hover\:text-red-600:hover { color: #fdba74 !important; }
    .dark .text-purple-700 { color: #d8b4fe !important; }
    .dark .text-cyan-700 { color: #67e8f9 !important; }

    .dark .bg-blue-600,
    .dark .bg-blue-500\/80 {
      background-color: #555555 !important;
    }
    .dark .bg-emerald-500 { background-color: #10b981 !important; }
    .dark .bg-slate-400 { background-color: #737373 !important; }

    .dark .shadow-2xl,
    .dark .shadow-xl,
    .dark .shadow-lg,
    .dark .shadow-sm,
    .dark .shadow-\[0_14px_45px_rgba\(15\,23\,42\,0\.06\)\] {
      box-shadow: 0 24px 70px rgba(0,0,0,.48) !important;
    }

    .dark .recharts-cartesian-grid line { stroke: var(--lh-border) !important; }
    .dark .recharts-text, .dark .recharts-layer text { fill: var(--lh-muted) !important; }
    .dark .recharts-tooltip-cursor { stroke: #777 !important; }
    .dark .recharts-curve { stroke: #8a8a8a !important; }
    .dark .recharts-area-area { fill-opacity: .18 !important; }

    .dark .bg-\[\#f5f5f5\], .dark [class*="bg-\[\#f5f5f5\]"] { background-color: #101010 !important; }
    .dark img[src*="cartocdn"] { filter: grayscale(1) invert(.94) hue-rotate(180deg) saturate(.05) brightness(.48) contrast(1.2) !important; opacity: .86 !important; }
    .dark .absolute.inset-0.bg-white\/5 { background-color: rgba(0,0,0,.24) !important; }
    .dark .fixed.inset-0[class*="bg-slate-950"],
    .dark [class*="bg-slate-950/20"],
    .dark [class*="bg-slate-950/30"],
    .dark [class*="bg-slate-950/35"] {
      background-color: rgba(0,0,0,.66) !important;
    }

    /* Reliable graphite layer: Tailwind slash classes must be matched with attributes */
    .dark[class*="bg-slate-50"],
    .dark [class~="bg-slate-50"],
    .dark [class~="bg-slate-50/90"],
    .dark [class~="bg-slate-50/95"],
    .dark [class*="bg-slate-50"] {
      background-color: #0b0b0c !important;
    }

    .dark [class~="bg-white"],
    .dark [class~="bg-white/5"],
    .dark [class~="bg-white/20"],
    .dark [class~="bg-white/80"],
    .dark [class~="bg-white/90"],
    .dark [class~="bg-white/95"],
    .dark [class*="bg-white"] {
      background-color: #151515 !important;
    }

    .dark [class~="bg-slate-100"],
    .dark [class*="bg-slate-100"] {
      background-color: #1d1d1d !important;
    }

    .dark [class~="bg-slate-200"],
    .dark [class*="bg-slate-200"],
    .dark [class~="bg-slate-950"],
    .dark [class*="bg-slate-950"] {
      background-color: #262626 !important;
    }

    .dark main,
    .dark section,
    .dark nav {
      background-color: #0b0b0c !important;
    }

    .dark aside,
    .dark header {
      background-color: #121212 !important;
    }

    .dark .motion-card,
    .dark [class*="shadow-[0_14px_45px"],
    .dark [class*="rounded-[22px]"] {
      background-color: #151515 !important;
      border-color: #303030 !important;
    }

    .dark [class*="border-slate-100"],
    .dark [class*="border-slate-200"],
    .dark [class*="border-slate-300"],
    .dark [class~="border-slate-100"],
    .dark [class~="border-slate-200"],
    .dark [class~="border-slate-300"] {
      border-color: #303030 !important;
    }

    .dark [class*="divide-slate-100"] > :not([hidden]) ~ :not([hidden]),
    .dark [class*="divide-slate-200"] > :not([hidden]) ~ :not([hidden]),
    .dark .divide-y > :not([hidden]) ~ :not([hidden]) {
      border-color: #292929 !important;
    }

    .dark table,
    .dark tbody,
    .dark tbody tr,
    .dark tbody.bg-white {
      background-color: #151515 !important;
    }

    .dark thead,
    .dark table thead,
    .dark [class~="bg-slate-50/95"] thead {
      background-color: #1b1b1b !important;
    }

    .dark tbody tr + tr td,
    .dark tbody tr + tr th,
    .dark tbody.divide-y > tr + tr,
    .dark tr + tr td {
      border-top: 1px solid #292929 !important;
    }

    .dark th,
    .dark td {
      border-color: #292929 !important;
    }

    .dark tr:hover,
    .dark tbody tr:hover,
    .dark [class*="hover:bg-slate-50"]:hover,
    .dark [class*="hover:bg-slate-100"]:hover,
    .dark [class*="hover:bg-white"]:hover {
      background-color: #222222 !important;
    }

    .dark [class*="text-slate-950"],
    .dark [class*="text-slate-900"],
    .dark .font-semibold:not([class*="text-emerald"]):not([class*="text-amber"]):not([class*="text-red"]):not([class*="text-orange"]):not([class*="text-purple"]):not([class*="text-cyan"]):not([class*="text-white"]) {
      color: #f4f2ee !important;
    }

    .dark [class*="text-slate-800"],
    .dark [class*="text-slate-700"] {
      color: #d7d3cd !important;
    }

    .dark [class*="text-slate-600"],
    .dark [class*="text-slate-500"] {
      color: #aaa39b !important;
    }

    .dark [class*="text-slate-400"] {
      color: #7c756d !important;
    }

    .dark input:not(.lh-search-field):not(.lh-flat-input):not([type="checkbox"]):not([type="radio"]),
    .dark select,
    .dark textarea {
      background-color: #111111 !important;
      border-color: #303030 !important;
      color: #f4f2ee !important;
    }

    .dark .lh-search-field,
    .dark .lh-flat-input {
      color: #f4f2ee !important;
    }

    .dark button[class*="bg-slate-950"],
    .dark [class*="bg-slate-950"][class*="text-white"] {
      background-color: #2a2a2a !important;
      border-color: #3a3a3a !important;
      color: #ffffff !important;
    }

    .dark .bg-emerald-50, .dark [class*="bg-emerald-50"] { background-color: rgba(6,78,59,.30) !important; }
    .dark .bg-amber-50, .dark [class*="bg-amber-50"] { background-color: rgba(120,53,15,.34) !important; }
    .dark .bg-red-50, .dark [class*="bg-red-50"] { background-color: rgba(127,29,29,.34) !important; }
    .dark .bg-orange-50, .dark [class*="bg-orange-50"] { background-color: rgba(124,45,18,.34) !important; }
    .dark .bg-purple-50, .dark [class*="bg-purple-50"] { background-color: rgba(76,29,149,.30) !important; }
    .dark .bg-cyan-50, .dark [class*="bg-cyan-50"] { background-color: rgba(22,78,99,.30) !important; }

    /* Soft divider polish: reduce bright drawer/card/table separators */
    .dark {
      --lh-border: #282828;
      --lh-border-soft: #202020;
      --lh-border-faint: #1b1b1b;
    }

    .dark [class*="border-slate-100"],
    .dark [class*="border-slate-200"],
    .dark [class*="border-slate-300"],
    .dark [class~="border-slate-100"],
    .dark [class~="border-slate-200"],
    .dark [class~="border-slate-300"],
    .dark [class*="border-white"] {
      border-color: var(--lh-border) !important;
    }

    .dark [class*="border-t"],
    .dark [class*="border-b"],
    .dark [class*="border-l"],
    .dark [class*="border-r"] {
      border-color: var(--lh-border-soft) !important;
    }

    .dark [class*="divide-x"] > :not([hidden]) ~ :not([hidden]) {
      border-left-color: var(--lh-border-soft) !important;
      border-right-color: var(--lh-border-soft) !important;
    }

    .dark [class*="divide-y"] > :not([hidden]) ~ :not([hidden]) {
      border-top-color: var(--lh-border-soft) !important;
      border-bottom-color: var(--lh-border-soft) !important;
    }

    .dark .divide-slate-100 > :not([hidden]) ~ :not([hidden]),
    .dark .divide-slate-200 > :not([hidden]) ~ :not([hidden]),
    .dark [class*="divide-slate-100"] > :not([hidden]) ~ :not([hidden]),
    .dark [class*="divide-slate-200"] > :not([hidden]) ~ :not([hidden]) {
      border-color: var(--lh-border-soft) !important;
    }

    .dark tbody tr + tr td,
    .dark tbody tr + tr th,
    .dark tbody.divide-y > tr + tr,
    .dark tr + tr td,
    .dark tr + tr th {
      border-top-color: var(--lh-border-faint) !important;
    }

    .dark th,
    .dark td {
      border-color: var(--lh-border-faint) !important;
    }

    .dark .rounded-xl,
    .dark .rounded-2xl,
    .dark .rounded-3xl,
    .dark .rounded-\[22px\] {
      border-color: var(--lh-border) !important;
    }

    .dark [class*="bg-white"],
    .dark [class*="bg-slate-50"],
    .dark [class*="bg-slate-100"] {
      box-shadow: none;
    }

    .dark .shadow-2xl,
    .dark .shadow-xl,
    .dark .shadow-lg,
    .dark .shadow-sm,
    .dark [class*="shadow-"] {
      box-shadow: 0 18px 54px rgba(0,0,0,.34) !important;
    }

    .dark .border-emerald-200 { border-color: rgba(52,211,153,.30) !important; }
    .dark .border-amber-200 { border-color: rgba(251,191,36,.30) !important; }
    .dark .border-red-200 { border-color: rgba(248,113,113,.30) !important; }
    .dark .border-orange-200 { border-color: rgba(251,146,60,.30) !important; }
    .dark .border-purple-200 { border-color: rgba(196,181,253,.26) !important; }
    .dark .border-cyan-200 { border-color: rgba(103,232,249,.26) !important; }

    /* Graphite final pass — keep this block last. It normalizes all remaining light/blue surfaces without touching product logic. */
    .dark {
      --lh-bg: #0a0a0b;
      --lh-app: #0d0d0e;
      --lh-surface: #141414;
      --lh-surface-2: #1a1a1a;
      --lh-surface-3: #202020;
      --lh-hover: #232323;
      --lh-border: #252525;
      --lh-border-soft: #1f1f1f;
      --lh-border-faint: #181818;
      --lh-text: #f3f0ea;
      --lh-text-2: #d5d0c8;
      --lh-muted: #a59e96;
      --lh-faint: #746e67;
      color-scheme: dark;
      background: var(--lh-bg) !important;
      color: var(--lh-text) !important;
    }

    .dark[class~="bg-slate-50"],
    .dark.min-h-screen,
    .dark main,
    .dark section,
    .dark nav {
      background-color: var(--lh-bg) !important;
    }

    .dark aside,
    .dark header,
    .dark [class~="bg-white"],
    .dark [class~="bg-white/80"],
    .dark [class~="bg-white/90"],
    .dark [class~="bg-white/95"] {
      background-color: var(--lh-surface) !important;
    }

    .dark [class~="bg-white/5"] { background-color: rgba(255,255,255,.035) !important; }
    .dark [class~="bg-white/20"] { background-color: rgba(255,255,255,.075) !important; }
    .dark [class~="bg-white/70"] { background-color: rgba(20,20,20,.72) !important; }

    .dark [class~="bg-slate-50"],
    .dark [class~="bg-slate-50/90"],
    .dark [class~="bg-slate-50/95"] {
      background-color: var(--lh-surface-2) !important;
    }

    .dark [class~="bg-slate-100"],
    .dark [class~="bg-slate-100/80"] {
      background-color: var(--lh-surface-3) !important;
    }

    .dark [class~="bg-slate-200"],
    .dark [class~="bg-slate-950"] {
      background-color: #2a2a2a !important;
    }

    .dark .fixed.inset-0[class*="bg-slate-950/"],
    .dark [class*="bg-slate-950/20"],
    .dark [class*="bg-slate-950/30"],
    .dark [class*="bg-slate-950/35"] {
      background-color: rgba(0,0,0,.68) !important;
    }

    .dark [class*="#f5f5f5"],
    .dark .bg-\[\#f5f5f5\] {
      background-color: #101010 !important;
    }

    .dark .motion-card,
    .dark [class*="rounded-[22px]"],
    .dark [class~="rounded-2xl"],
    .dark [class~="rounded-3xl"] {
      border-color: var(--lh-border) !important;
    }

    .dark [class*="border-slate-100"],
    .dark [class*="border-slate-200"],
    .dark [class*="border-slate-300"],
    .dark [class*="border-white"] {
      border-color: var(--lh-border) !important;
    }

    .dark [class*="border-t"],
    .dark [class*="border-b"],
    .dark [class*="border-l"],
    .dark [class*="border-r"] {
      border-color: var(--lh-border-soft) !important;
    }

    .dark [class*="divide-y"] > :not([hidden]) ~ :not([hidden]),
    .dark [class*="divide-x"] > :not([hidden]) ~ :not([hidden]),
    .dark .divide-slate-100 > :not([hidden]) ~ :not([hidden]),
    .dark .divide-slate-200 > :not([hidden]) ~ :not([hidden]) {
      border-color: var(--lh-border-soft) !important;
    }

    .dark table,
    .dark thead,
    .dark tbody,
    .dark tbody tr,
    .dark tbody.bg-white {
      background-color: var(--lh-surface) !important;
    }

    .dark thead,
    .dark table thead,
    .dark [class*="bg-slate-50"] thead {
      background-color: #181818 !important;
    }

    .dark th,
    .dark td,
    .dark tbody tr + tr td,
    .dark tbody tr + tr th,
    .dark tbody.divide-y > tr + tr,
    .dark tr + tr td,
    .dark tr + tr th {
      border-color: var(--lh-border-faint) !important;
      border-top-color: var(--lh-border-faint) !important;
    }

    .dark tr:hover,
    .dark tbody tr:hover,
    .dark [class*="hover:bg-slate-50"]:hover,
    .dark [class*="hover:bg-slate-100"]:hover,
    .dark [class*="hover:bg-white"]:hover {
      background-color: var(--lh-hover) !important;
    }

    .dark [class*="text-slate-950"],
    .dark [class*="text-slate-900"],
    .dark [class*="text-slate-800"],
    .dark .font-semibold:not([class*="text-emerald"]):not([class*="text-amber"]):not([class*="text-red"]):not([class*="text-orange"]):not([class*="text-purple"]):not([class*="text-cyan"]):not([class*="text-white"]) {
      color: var(--lh-text) !important;
    }

    .dark [class*="text-slate-700"] { color: var(--lh-text-2) !important; }
    .dark [class*="text-slate-600"], .dark [class*="text-slate-500"] { color: var(--lh-muted) !important; }
    .dark [class*="text-slate-400"] { color: var(--lh-faint) !important; }

    .dark input:not(.lh-search-field):not(.lh-flat-input):not([type="checkbox"]):not([type="radio"]),
    .dark select,
    .dark textarea {
      background-color: #101010 !important;
      border-color: var(--lh-border) !important;
      color: var(--lh-text) !important;
    }

    .dark input:not(.lh-search-field):not(.lh-flat-input):not([type="checkbox"]):not([type="radio"]):focus,
    .dark select:focus,
    .dark textarea:focus,
    .dark .focus-within\:border-blue-500:focus-within {
      border-color: #5b5b5b !important;
      box-shadow: 0 0 0 4px rgba(115,115,115,.14) !important;
    }

    .dark .lh-search-field,
    .dark .lh-flat-input {
      color: var(--lh-text) !important;
    }

    .dark input::placeholder,
    .dark textarea::placeholder,
    .dark .placeholder\:text-slate-400::placeholder {
      color: var(--lh-faint) !important;
    }

    .dark button[class*="bg-slate-950"],
    .dark [class*="bg-slate-950"][class*="text-white"],
    .dark [class*="bg-blue-600"],
    .dark [class*="bg-blue-500"] {
      background-color: #303030 !important;
      border-color: #3b3b3b !important;
      color: #fff !important;
    }

    .dark button[class*="bg-slate-950"]:hover,
    .dark [class*="hover:bg-slate-800"]:hover,
    .dark [class*="hover:bg-blue"]:hover {
      background-color: #3a3a3a !important;
    }

    .dark .shadow-2xl,
    .dark .shadow-xl,
    .dark .shadow-lg,
    .dark .shadow-sm,
    .dark [class*="shadow-"] {
      box-shadow: 0 22px 70px rgba(0,0,0,.38) !important;
    }

    .dark img[src*="cartocdn"] {
      filter: grayscale(1) invert(.94) hue-rotate(180deg) saturate(.04) brightness(.42) contrast(1.18) !important;
      opacity: .9 !important;
    }

    .dark .recharts-cartesian-grid line { stroke: var(--lh-border-soft) !important; }
    .dark .recharts-text,
    .dark .recharts-layer text { fill: var(--lh-muted) !important; }
    .dark .recharts-tooltip-wrapper [class*="bg-white"] { background-color: var(--lh-surface-2) !important; }
    .dark .recharts-curve { stroke: #9a9a9a !important; }
    .dark .recharts-area-area { fill-opacity: .12 !important; }

    .dark .bg-emerald-50, .dark [class*="bg-emerald-50"] { background-color: rgba(6,78,59,.28) !important; }
    .dark .bg-amber-50, .dark [class*="bg-amber-50"] { background-color: rgba(120,53,15,.30) !important; }
    .dark .bg-red-50, .dark [class*="bg-red-50"] { background-color: rgba(127,29,29,.30) !important; }
    .dark .bg-orange-50, .dark [class*="bg-orange-50"] { background-color: rgba(124,45,18,.30) !important; }
    .dark .bg-purple-50, .dark [class*="bg-purple-50"] { background-color: rgba(76,29,149,.26) !important; }
    .dark .bg-cyan-50, .dark [class*="bg-cyan-50"] { background-color: rgba(22,78,99,.26) !important; }

    .dark .border-emerald-200 { border-color: rgba(52,211,153,.30) !important; }
    .dark .border-amber-200 { border-color: rgba(251,191,36,.30) !important; }
    .dark .border-red-200 { border-color: rgba(248,113,113,.30) !important; }
    .dark .border-orange-200 { border-color: rgba(251,146,60,.30) !important; }
    .dark .border-purple-200 { border-color: rgba(196,181,253,.25) !important; }
    .dark .border-cyan-200 { border-color: rgba(103,232,249,.25) !important; }

    /* Divider kill-switch — must stay last. */
    .dark {
      --lh-divider: #191919;
      --lh-divider-soft: #202020;
      --lh-outline: #242424;
    }

    .dark .border,
    .dark .border-t,
    .dark .border-b,
    .dark .border-l,
    .dark .border-r,
    .dark .border-x,
    .dark .border-y,
    .dark [class~="border"],
    .dark [class*="border-t"],
    .dark [class*="border-b"],
    .dark [class*="border-l"],
    .dark [class*="border-r"],
    .dark [class*="border-x"],
    .dark [class*="border-y"],
    .dark [class*="border-slate"],
    .dark [class*="border-white"],
    .dark [class*="border-gray"],
    .dark [class*="border-zinc"],
    .dark [class*="border-neutral"] {
      border-color: var(--lh-outline) !important;
    }

    .dark [class*="divide-y"] > :not([hidden]) ~ :not([hidden]),
    .dark [class*="divide-x"] > :not([hidden]) ~ :not([hidden]),
    .dark .divide-y > :not([hidden]) ~ :not([hidden]),
    .dark .divide-x > :not([hidden]) ~ :not([hidden]),
    .dark .divide-slate-100 > :not([hidden]) ~ :not([hidden]),
    .dark .divide-slate-200 > :not([hidden]) ~ :not([hidden]) {
      border-color: var(--lh-divider) !important;
      border-top-color: var(--lh-divider) !important;
      border-right-color: var(--lh-divider) !important;
      border-bottom-color: var(--lh-divider) !important;
      border-left-color: var(--lh-divider) !important;
    }

    .dark table,
    .dark thead,
    .dark tbody,
    .dark tr,
    .dark th,
    .dark td,
    .dark tbody tr,
    .dark tbody tr + tr td,
    .dark tbody tr + tr th,
    .dark tr + tr td,
    .dark tr + tr th {
      border-color: var(--lh-divider) !important;
      border-top-color: var(--lh-divider) !important;
      border-right-color: var(--lh-divider) !important;
      border-bottom-color: var(--lh-divider) !important;
      border-left-color: var(--lh-divider) !important;
    }

    .dark header,
    .dark aside,
    .dark [class*="border-b"][class*="p-4"],
    .dark [class*="border-t"][class*="p-4"],
    .dark [class*="border-b"][class*="px-6"],
    .dark [class*="border-t"][class*="px-6"],
    .dark [class*="border-r"][class*="bg-white"] {
      border-color: var(--lh-divider-soft) !important;
    }

    .dark .border-transparent,
    .dark [class*="border-transparent"] {
      border-color: transparent !important;
    }

    .dark .border-emerald-200 { border-color: rgba(52,211,153,.30) !important; }
    .dark .border-amber-200 { border-color: rgba(251,191,36,.30) !important; }
    .dark .border-red-200 { border-color: rgba(248,113,113,.30) !important; }
    .dark .border-orange-200 { border-color: rgba(251,146,60,.30) !important; }
    .dark .border-purple-200 { border-color: rgba(196,181,253,.25) !important; }
    .dark .border-cyan-200 { border-color: rgba(103,232,249,.25) !important; }
  `}</style>;
}

function Button({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }) {
  const variants = {
    primary: "bg-slate-950 text-white hover:bg-slate-800",
    outline: "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900",
    ghost: "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 hover:text-slate-900",
  };
  return <button type={type} disabled={disabled} onClick={onClick} className={`motion-btn inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}>{children}</button>;
}

function Card({ children, className = "" }) {
  return <div className={`motion-card rounded-[22px] border border-slate-200 bg-white/95 shadow-[0_14px_45px_rgba(15,23,42,0.06)] backdrop-blur ${className}`}>{children}</div>;
}

function Badge({ children, className = "" }) {
  return <span className={`motion-badge inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>;
}

function Input(props) {
  return <input {...props} className={`h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm leading-5 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${props.className || ""}`} />;
}

function StatusBadge({ value }) {
  const Icon = statusIconMap[value] || Activity;
  return <Badge className={`${statusTone[value] || "border-slate-200 bg-slate-50 text-slate-600"} gap-1.5`}><Icon className="h-3.5 w-3.5" />{value || "Unknown"}</Badge>;
}

function KpiCard({ label, value, hint, icon: Icon, accent = "bg-slate-100" }) {
  return React.createElement(Card, { className: "motion-card p-4 transition" },
    React.createElement("div", { className: "flex items-center justify-between gap-3" },
      React.createElement("div", { className: "min-w-0" },
        React.createElement("p", { className: "text-xs font-medium uppercase tracking-wide text-slate-400" }, label),
        React.createElement("p", { className: "mt-1 truncate text-xl font-semibold tracking-tight text-slate-950" }, value),
        React.createElement("p", { className: "mt-0.5 truncate text-xs text-slate-500" }, hint)
      ),
      React.createElement("div", { className: `shrink-0 rounded-xl p-2 ${accent}` }, React.createElement(Icon, { className: "h-4 w-4 text-slate-700" }))
    )
  );
}

function EmptyState({ title = "No records found", text = "Clear filters or try another search." }) {
  return <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center"><Search className="h-5 w-5 text-slate-400" /><p className="mt-3 text-sm font-semibold text-slate-950">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div>;
}

function HuntLogo({ compact = false }) {
  const size = compact ? 30 : 122;
  return (
    <svg width={size} height="30" viewBox={compact ? "0 0 30 30" : "0 0 122 30"} fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible text-slate-950 dark:text-white" aria-label="Hunt TMS">
      <g transform="translate(5 5)">
        <g className="lh-logo-orbit" opacity="0.45">
          <circle cx="10" cy="10" r="9.2" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
        </g>
        <g className="lh-logo-pulse">
          <path d="M7.1.8C4.2 1.8 1.8 4.2.8 7.1c-.14.43-.4.82-.74 1.1-.15.12-.06.37.14.37h3.62c.25 0 .47-.15.55-.39.31-.88.83-1.66 1.5-2.28.62-.68 1.41-1.2 2.29-1.51.23-.08.39-.3.39-.55V.22c0-.2-.25-.29-.38-.14-.28.34-.66.6-1.09.73Z" fill="currentColor" />
          <path d="M12.9.8c2.9 1 5.3 3.4 6.3 6.3.14.43.4.82.74 1.1.15.12.06.37-.14.37h-3.62c-.25 0-.47-.15-.55-.39-.31-.88-.83-1.66-1.5-2.28-.62-.68-1.41-1.2-2.29-1.51a.58.58 0 0 1-.39-.55V.22c0-.2.25-.29.38-.14.28.34.66.6 1.09.73Z" fill="currentColor" />
          <path d="M12.9 19.15c2.9-1 5.3-3.4 6.3-6.3.14-.43.4-.82.74-1.1.15-.12.06-.37-.14-.37h-3.62c-.25 0-.47.15-.55.39-.31.88-.83 1.66-1.5 2.28-.37.4-.79.75-1.26 1.03-.88.53-1.42 1.48-1.42 2.5v2.17c0 .2.25.29.38.14.28-.34.66-.6 1.09-.74Z" fill="currentColor" />
          <path d="M7.1 19.15c-2.9-1-5.3-3.4-6.3-6.3-.15-.45-.42-.84-.77-1.12-.15-.12-.06-.35.12-.35h3.67c.25 0 .47.15.55.39.31.88.83 1.66 1.51 2.28.36.4.79.75 1.25 1.03.88.53 1.43 1.48 1.43 2.5v2.22c0 .19-.23.27-.35.13-.28-.36-.67-.63-1.11-.78Z" fill="currentColor" />
          <circle cx="10" cy="10" r="1.85" fill="currentColor" />
        </g>
      </g>
      {!compact && <text x="36" y="21" fill="currentColor" fontSize="16" fontWeight="700" fontFamily="Inter, ui-sans-serif, system-ui" letterSpacing="-.35">Hunt TMS</text>}
    </svg>
  );
}

function UserProfileDock({ collapsed, role, onLogout }) {
  const user = {
    name: "Dino Manager",
    initials: "DM",
    email: "dino@hunt.tms",
    company: "Hunt Carrier LLC",
    workspace: "Carrier operations",
    role: role || "Accounting",
  };

  if (collapsed) {
    return (
      <div className="border-t border-slate-200 p-3">
        <button onClick={onLogout} className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-transparent bg-white text-sm font-semibold text-slate-950 transition hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm" title="Dino Manager">
          D
        </button>
      </div>
    );
  }

  return (
    <div className="group border-t border-slate-200 p-3">
      <div className="overflow-hidden rounded-[22px] border border-transparent bg-white transition-all duration-200 hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm group-hover:border-slate-200 group-hover:bg-slate-50 group-hover:shadow-sm">
        <div className="flex cursor-pointer items-center gap-3 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">D</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-950">Dino</p>
            <p className="truncate text-xs text-slate-500">dino@hunt.tms</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:rotate-90" />
        </div>

        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-h-[390px] group-hover:opacity-100">
          <div className="px-3 pb-3">
            <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Account details</p>
                  <p className="mt-1 text-xs text-slate-500">Workspace access and current role.</p>
                </div>
                <StatusBadge value="Active" />
              </div>

              <div className="mt-3 grid gap-2 text-sm">
                <div className="rounded-xl bg-slate-50 px-3 py-2.5"><span className="block text-xs text-slate-500">Role</span><span className="mt-1 block font-medium text-slate-950">{user.role}</span></div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5"><span className="block text-xs text-slate-500">Company</span><span className="mt-1 block truncate font-medium text-slate-950">{user.company}</span></div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5"><span className="block text-xs text-slate-500">Workspace</span><span className="mt-1 block font-medium text-slate-950">{user.workspace}</span></div>
              </div>

              <button onClick={onLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-950">
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload || {};
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-2xl">
      <p className="font-semibold text-slate-950">{label} performance</p>
      <div className="mt-3 space-y-2">
        <div className="flex min-w-[190px] justify-between gap-6"><span className="text-slate-500">Revenue</span><span className="font-semibold text-slate-950">{formatMoney(row.revenue)}</span></div>
        <div className="flex justify-between gap-6"><span className="text-slate-500">Expenses</span><span className="font-semibold text-slate-950">{formatMoney(row.expenses)}</span></div>
        <div className="flex justify-between gap-6"><span className="text-slate-500">Profit</span><span className="font-semibold text-slate-950">{formatMoney(row.profit)}</span></div>
        <div className="border-t border-slate-200 pt-2 text-xs text-slate-500">Monthly operating summary</div>
      </div>
    </div>
  );
}

function MiniChart() {
  return <ResponsiveContainer width="100%" height={150}><AreaChart data={chartData}><defs><linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8a8a8a" stopOpacity={0.32} /><stop offset="95%" stopColor="#8a8a8a" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} /><Tooltip content={<ChartTooltip />} cursor={{ stroke: "#8a8a8a", strokeWidth: 1, strokeDasharray: "4 4" }} /><Area type="natural" dataKey="revenue" stroke="#8a8a8a" fill="url(#revenue)" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} /></AreaChart></ResponsiveContainer>;
}

function SmallChartTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload || {};
  const value = payload[0]?.value;
  return <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl"><p className="font-semibold text-slate-950">{label}</p><p className="mt-1 text-slate-500">{payload[0]?.name}: <span className="font-semibold text-slate-950">{typeof value === "number" && value > 1000 ? formatMoney(value) : value}{suffix}</span></p>{row.sub && <p className="mt-1 text-slate-500">{row.sub}</p>}</div>;
}

function SmallAreaMetric({ title, value, hint, dataKey, suffix = "", icon: Icon = Activity }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-2"><Icon className="h-4 w-4 text-slate-700" /></div>
      </div>
      <div className="mt-3 h-[86px]">
        <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id={`${dataKey}Gradient`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8a8a8a" stopOpacity={0.24} /><stop offset="95%" stopColor="#8a8a8a" stopOpacity={0.02} /></linearGradient></defs><XAxis dataKey="month" hide /><Tooltip content={<SmallChartTooltip suffix={suffix} />} /><Area type="natural" dataKey={dataKey} stroke="#8a8a8a" fill={`url(#${dataKey}Gradient)`} strokeWidth={2} dot={false} activeDot={{ r: 4 }} /></AreaChart></ResponsiveContainer>
      </div>
    </Card>
  );
}

function HorizontalBars({ title, value, hint, rows, icon: Icon = BarChart3 }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-2"><Icon className="h-4 w-4 text-slate-700" /></div>
      </div>
      <div className="mt-4 space-y-3">
        {rows.map((row) => <div key={row.label}><div className="flex justify-between text-xs"><span className="font-medium text-slate-600">{row.label}</span><span className="text-slate-500">{row.value > 1000 ? formatMoney(row.value) : row.value + "%"}</span></div><div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500/80" style={{ width: `${row.percent || row.value}%` }} /></div>{row.sub && <p className="mt-1 text-[11px] text-slate-400">{row.sub}</p>}</div>)}
      </div>
    </Card>
  );
}

function findConnectedLoad(item = {}, rows = canonicalLoadRows) {
  const values = [item.id, item.ref, item.load, item.invoice, item.salary, item.truck, item.driver, item.unit].filter(Boolean).join(" ");
  return rows.find((load) => values.includes(load.id) || values.includes(load.invoice) || values.includes(load.salary) || (item.driver && load.driver === item.driver) || (item.truck && load.truck === item.truck) || (item.unit && load.truck === item.unit)) || null;
}

function buildMapRows(loadRows) {
  return loadRows.map((load) => {
    const noRoute = load.status === "Delivered" && load.docs !== "Ready";
    return {
      id: `MAP-${load.truck.replace("#", "")}`,
      name: load.driver,
      truck: load.truck.replace("#", ""),
      load: load.id,
      status: noRoute ? "No loads" : "En route",
      signal: load.driver === "Maks Orlov" ? "Offline" : "Online",
      current: load.driver === "Maks Orlov" ? "Temple, TX" : "Harker Heights, TX",
      nextStop: noRoute ? "Waiting for documents" : `${load.destination} receiver`,
      eta: noRoute ? "—" : "3h 20m",
      origin: noRoute ? "Current location" : load.origin,
      destination: noRoute ? "No active route" : load.destination,
      loadPrice: load.rate,
      loaded: load.miles,
      rpm: load.id === "#9157553" ? "$2.41" : load.id === "#9157619" ? "$2.28" : "$2.66",
      partial: load.expenseStatus === "Needs assignment" ? "Expense needs review" : load.docs !== "Ready" ? "Docs missing" : "Load ready",
      route: noRoute ? [] : [[30.2672, -97.7431], [30.5169, -97.6789], [30.9055, -97.5689], [31.0835, -97.6597]],
    };
  });
}

function getExpenseDisplayStatus(row = {}) {
  if (row.approval === "Excluded" || row.status === "Excluded") return "Excluded";
  if (row.approval === "Approved" || row.status === "Approved") return "Approved";
  if (row.receipt === "Missing") return "Needs receipt";
  if (row.match !== "Assigned") return "Needs assignment";
  return "Ready to approve";
}

function getExpenseNextStep(row = {}) {
  const status = getExpenseDisplayStatus(row);
  if (status === "Needs receipt") return "Upload receipt";
  if (status === "Needs assignment") return "Assign expense";
  if (status === "Ready to approve") return "Approve";
  if (status === "Approved") return "Done";
  return "Done";
}

function getSalaryDisplayStatus(row = {}) {
  if (row.status === "Paid" || row.status === "Locked") return "Paid";
  if (row.status === "Approved") return "Ready to pay";
  if (row.status === "Ready") return "Ready to approve";
  return "Needs review";
}

function getSalaryNextStep(row = {}) {
  const status = getSalaryDisplayStatus(row);
  if (status === "Needs review") return "Resolve issue";
  if (status === "Ready to approve") return "Approve";
  if (status === "Ready to pay") return "Mark paid";
  return "Done";
}

function InfoLine({ label, value, icon: Icon = Activity }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="flex items-center gap-1.5 text-xs text-slate-500"><Icon className="h-3.5 w-3.5" />{label}</p><p className="mt-1 text-sm font-medium text-slate-950">{value}</p></div>;
}

const moduleGuideMap = {
  Equipment: { icon: Truck, title: "Equipment workflow", steps: ["Keep truck status clean", "Assign driver/trailer", "Review cost profile"], note: "Use this tab as the source of truth for trucks before dispatch, documents and payroll depend on clean assignment." },
  Drivers: { icon: UserRound, title: "Driver workflow", steps: ["Create profile", "Attach documents", "Enable app/payroll"], note: "Driver readiness controls mobile access, document requests and payroll generation." },
  Timeline: { icon: Clock3, title: "Dispatch workflow", steps: ["Track active route", "Resolve exception", "Mark delivered"], note: "Timeline is the operational board for appointments and route exceptions." },
  Loads: { icon: Route, title: "Load workflow", steps: ["Confirm delivery", "Collect POD/receipts", "Unblock invoice/payroll"], note: "The load record connects documents, invoice, expenses, payroll and reporting." },
  Map: { icon: MapPin, title: "Map workflow", steps: ["Find driver", "Check route status", "Open linked load"], note: "Map is a live operational view; the load drawer remains the canonical place for accounting actions." },
  Invoices: { icon: FileText, title: "Billing workflow", steps: ["Generate draft", "Resolve POD", "Send / mark paid"], note: "Invoices should move only after documents are ready, then payment closes the receivable." },
  Expenses: { icon: Receipt, title: "Expense workflow", steps: ["Upload receipt", "Assign to load", "Approve impact"], note: "Expense state controls accounting reports and can unblock payroll." },
  Salaries: { icon: WalletCards, title: "Payroll workflow", steps: ["Create settlement", "Review blockers", "Approve / pay"], note: "Payroll depends on linked load documents and expense state." },
  Reports: { icon: BarChart3, title: "Reporting workflow", steps: ["Choose scope", "Preview metrics", "Export snapshot"], note: "Reports summarize the current operational state for carrier management and accounting." },
  Settings: { icon: Settings, title: "Workspace workflow", steps: ["Set role", "Review modules", "Reset demo data"], note: "Settings controls the demo role, notifications and workspace state." },
};

function ModuleGuide({ icon: Icon = Activity, title, steps = [], note }) {
  return (
    <Card className="shrink-0 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-2xl bg-slate-50 p-2.5"><Icon className="h-4 w-4 text-slate-700" /></div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-950">{title}</p>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">{note}</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
          {steps.map((step, index) => <div key={step} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"><span className="mr-1.5 text-slate-400">{index + 1}.</span>{step}</div>)}
        </div>
      </div>
    </Card>
  );
}

function ConnectedLoadCard({ item = {}, rows = canonicalLoadRows }) {
  const load = findConnectedLoad(item, rows);
  if (!load) return null;
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-2 text-sm font-semibold text-slate-950"><Route className="h-4 w-4 text-slate-500" />Load overview</p><p className="mt-1 text-sm text-slate-500">Trip, driver, truck, documents, invoice, expenses and payroll in one view.</p></div><StatusBadge value={load.status === "Docs Missing" ? "Needs review" : load.status} /></div><div className="mt-4 grid gap-3 sm:grid-cols-4"><InfoLine label="Load" value={load.id} icon={Route} /><InfoLine label="Driver" value={load.driver} icon={UserRound} /><InfoLine label="Truck" value={load.truck} icon={Truck} /><InfoLine label="Invoice" value={load.invoice} icon={FileText} /></div><div className="mt-3 grid gap-3 sm:grid-cols-3"><InfoLine label="Expense" value={load.expense} icon={Receipt} /><InfoLine label="Payroll" value={load.salary} icon={WalletCards} /><InfoLine label="Margin" value={load.margin} icon={BarChart3} /></div></div>;
}

function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="motion-field flex h-10 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
      <Search className="h-4 w-4 shrink-0 text-slate-400" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="lh-search-field min-w-0 flex-1 text-sm leading-5 text-slate-950 placeholder:text-slate-400 outline-none" />
    </div>
  );
}

export default function HuntTMSCarrierMVPPreview() {
  const [persistedInitialState] = useState(() => readStoredDemoState());
  const [active, setActive] = useState(persistedInitialState?.active || demoState.active);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(persistedInitialState?.theme || demoState.theme);
  const [role, setRole] = useState(persistedInitialState?.role || demoState.role);
  const [drawer, setDrawer] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [truckRecords, setTruckRecords] = useState(() => persistedInitialState?.truckRecords || safeClone(demoState.truckRecords));
  const [driverRecords, setDriverRecords] = useState(() => persistedInitialState?.driverRecords || safeClone(demoState.driverRecords));
  const [timelineRecords, setTimelineRecords] = useState(() => persistedInitialState?.timelineRecords || safeClone(demoState.timelineRecords));
  const [invoiceRecords, setInvoiceRecords] = useState(() => persistedInitialState?.invoiceRecords || safeClone(demoState.invoiceRecords));
  const [expenseRecords, setExpenseRecords] = useState(() => persistedInitialState?.expenseRecords || safeClone(demoState.expenseRecords));
  const [salaryRecords, setSalaryRecords] = useState(() => persistedInitialState?.salaryRecords || safeClone(demoState.salaryRecords));
  const [reportRecords, setReportRecords] = useState(() => persistedInitialState?.reportRecords || safeClone(demoState.reportRecords));
  const [loadRecords, setLoadRecords] = useState(() => persistedInitialState?.loadRecords || safeClone(demoState.loadRecords));
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [truckModalOpen, setTruckModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    writeStoredDemoState({ active, theme, role, truckRecords, driverRecords, timelineRecords, invoiceRecords, expenseRecords, salaryRecords, reportRecords, loadRecords });
  }, [active, theme, role, truckRecords, driverRecords, timelineRecords, invoiceRecords, expenseRecords, salaryRecords, reportRecords, loadRecords]);

  const requestConfirm = ({ title, text, confirmText = "Confirm", tone = "default", onConfirm }) => {
    setConfirmDialog({ title, text, confirmText, tone, onConfirm });
  };

  const navCounts = useMemo(() => ({
    overview: loadRecords.filter((row) => row.next).length,
    fleet: truckRecords.filter((row) => row.status !== "Available").length,
    drivers: driverRecords.filter((row) => row.docs !== "Valid").length,
    timeline: timelineRecords.filter((row) => row.note).length,
    loads: loadRecords.filter((row) => row.next).length,
    map: buildMapRows(loadRecords).filter((row) => row.signal === "Offline" || row.partial !== "Load ready").length,
    invoices: invoiceRecords.filter((row) => row.issue).length,
    expenses: expenseRecords.filter((row) => getExpenseDisplayStatus(row) !== "Approved").length,
    salaries: salaryRecords.filter((row) => getSalaryDisplayStatus(row) !== "Paid").length,
    reports: reportRecords.filter((row) => row.status === "Draft").length,
  }), [truckRecords, driverRecords, timelineRecords, loadRecords, invoiceRecords, expenseRecords, salaryRecords, reportRecords]);

  const save = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const openDrawer = (type, item, mode = "view") => setDrawer({ type, item, mode });
  const closeDrawer = () => setDrawer(null);

  const resetDemoData = () => requestConfirm({
    title: "Reset demo data?",
    text: "This will restore trucks, drivers, loads, invoices, expenses, payroll and reports to the original MVP demo state.",
    confirmText: "Reset data",
    tone: "danger",
    onConfirm: () => {
      setActive(demoState.active);
      setTheme(demoState.theme);
      setRole(demoState.role);
      setTruckRecords(safeClone(demoState.truckRecords));
      setDriverRecords(safeClone(demoState.driverRecords));
      setTimelineRecords(safeClone(demoState.timelineRecords));
      setInvoiceRecords(safeClone(demoState.invoiceRecords));
      setExpenseRecords(safeClone(demoState.expenseRecords));
      setSalaryRecords(safeClone(demoState.salaryRecords));
      setReportRecords(safeClone(demoState.reportRecords));
      setLoadRecords(safeClone(demoState.loadRecords));
      setDrawer(null);
      save("Demo data reset.");
    },
  });

  const updateLoadRecord = (id, patch) => setLoadRecords((prev) => prev.map((row) => row.id === id ? { ...row, ...patch } : row));
  const updateInvoiceRecord = (ref, patch) => setInvoiceRecords((prev) => prev.map((row) => row.ref === ref ? { ...row, ...patch } : row));
  const updateExpenseRecord = (id, patch) => {
    const currentExpense = expenseRecords.find((row) => row.id === id);
    const nextExpense = { ...currentExpense, ...patch };
    const linkedLoadId = nextExpense.load && nextExpense.load !== "Overhead" && nextExpense.load !== "Unassigned" && nextExpense.load !== "—" ? nextExpense.load : null;
    setExpenseRecords((prev) => prev.map((row) => row.id === id ? { ...row, ...patch } : row));
    if (!linkedLoadId) return;
    const linkedLoad = loadRecords.find((load) => load.id === linkedLoadId);
    if (nextExpense.approval === "Excluded" || nextExpense.status === "Excluded") {
      updateLoadRecord(linkedLoadId, { expense: nextExpense.amount, expenseStatus: "Excluded", next: "Expense excluded from accounting" });
      return;
    }
    if (nextExpense.approval === "Approved" || nextExpense.status === "Approved") {
      updateLoadRecord(linkedLoadId, { expense: nextExpense.amount, expenseStatus: "Approved", salaryStatus: linkedLoad?.docs === "Ready" ? "Ready" : linkedLoad?.salaryStatus, next: linkedLoad?.docs === "Ready" ? "Payroll ready to approve" : "Upload POD before payroll" });
      if (linkedLoad?.salary) setSalaryRecords((prev) => prev.map((row) => row.id === linkedLoad.salary && row.status === "Review" ? { ...row, status: "Ready", warning: "Expense approved" } : row));
      return;
    }
    if (nextExpense.receipt === "Missing") {
      updateLoadRecord(linkedLoadId, { expense: nextExpense.amount, expenseStatus: "Needs receipt", next: "Upload expense receipt" });
      return;
    }
    if (nextExpense.match === "Assigned") {
      updateLoadRecord(linkedLoadId, { expense: nextExpense.amount, expenseStatus: "Ready", next: "Expense ready to approve" });
    }
  };
  const updateSalaryRecord = (id, patch) => setSalaryRecords((prev) => prev.map((row) => row.id === id ? { ...row, ...patch } : row));
  const updateReportRecord = (id, patch) => setReportRecords((prev) => prev.map((row) => row.id === id ? { ...row, ...patch } : row));
  const updateTimelineRecord = (id, patch) => setTimelineRecords((prev) => prev.map((row) => row.id === id ? { ...row, ...patch } : row));
  const updateDriverRecord = (id, patch) => setDriverRecords((prev) => prev.map((row) => row.id === id || row.name === id ? { ...row, ...patch } : row));
  const updateTruckRecord = (unit, patch) => setTruckRecords((prev) => prev.map((row) => row.unit === unit || row.id === unit ? { ...row, ...patch } : row));

  const saveGeneratedDriver = ({ firstName = "Anthony", lastName = "Jackson", email = "anthony@huntlogistics.com", phone = "+1 469 555 0177", assignedTruck = "Unassigned", cdl = "2027-03-10", medical = "2026-10-01", fleet = "Default", profileType = "Driver", driverType = "Company Driver", language = "English", labels = "", payrollEnabled = false, mobileAppEnabled = false, platformAccessEnabled = false, licenseNumber = "", blacklistedStates = "None", notes = "" } = {}) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const duplicateDriver = driverRecords.find((row) => String(row.email || "").trim().toLowerCase() === normalizedEmail);
    if (duplicateDriver) {
      setDriverModalOpen(false);
      save("Driver with this email already exists.");
      return;
    }
    const id = "DRV-" + (1000 + driverRecords.length + 1);
    const name = (firstName + " " + lastName).trim() || "New Driver";
    const docsStatus = cdl && medical ? "Valid" : "Missing";
    const driver = { id: id, name: name, email: email, phone: phone, fleet: fleet, truck: assignedTruck, type: driverType || profileType, status: "Active", app: mobileAppEnabled ? "Enabled" : "Disabled", payroll: payrollEnabled ? "Enabled" : "Disabled", docs: docsStatus, safety: docsStatus === "Valid" ? "Clear" : "Needs review", cdl: cdl || "Missing", medical: medical || "Missing", states: blacklistedStates || "None", language: language, labels: labels, platformAccess: platformAccessEnabled ? "Enabled" : "Disabled", licenseNumber: licenseNumber, notes: notes };
    setDriverRecords((prev) => [driver, ...prev]);
    if (assignedTruck !== "Unassigned") updateTruckRecord(assignedTruck, { driver: driver.name, status: "In Transit", next: "Assigned to active driver" });
    setDriverModalOpen(false);
    save("Driver " + driver.name + " created.");
  };

  const saveGeneratedTruck = ({ unit, truckType, vin, tag, registrationExpiration, dotInspectionExpiration, labels, notes, trailer, driver1, driver2, investor1, investor2, dispatchFeePercent, costItems, fleet } = {}) => {
    const nextNumber = 2099 + truckRecords.length;
    const truckUnit = unit || "#" + nextNumber;
    const duplicateTruck = truckRecords.find((row) => String(row.unit || "").trim().toLowerCase() === String(truckUnit || "").trim().toLowerCase());
    if (duplicateTruck) {
      setTruckModalOpen(false);
      save("Truck " + truckUnit + " already exists.");
      return;
    }
    const safeItems = Array.isArray(costItems) && costItems.length ? costItems : [];
    const monthlyTotal = safeItems.filter((row) => row.frequency === "1 month").reduce((sum, row) => sum + moneyNumber(row.amount), 0);
    const mileTotal = safeItems.filter((row) => row.frequency === "per mile").reduce((sum, row) => sum + moneyNumber(row.amount), 0);
    const fixedCost = formatMoney(monthlyTotal || 0) + "/mo";
    const variableCost = "$" + Number(mileTotal || 0).toFixed(2) + "/mi";
    const truckIdNumber = String(truckUnit).replace(/[^0-9]/g, "") || String(nextNumber);
    const primaryDriver = driver1 && driver1 !== "Unassigned" ? driver1 : "Unassigned";
    const truck = { id: "TRK-" + truckIdNumber, unit: truckUnit, driver: primaryDriver, driver2: driver2 || "Unassigned", trailer: trailer || "Unassigned", fleet: fleet || "Default", type: truckType || "Semi", status: primaryDriver === "Unassigned" ? "Available" : "In Transit", cost: fixedCost + " · " + variableCost, next: primaryDriver === "Unassigned" ? "Ready for assignment" : "Assigned to active driver", vin: vin || "1HTNEW" + nextNumber + "DEMO", tag: tag || "Pending", fixed: fixedCost, variable: variableCost, registrationExpiration: registrationExpiration || "", dotInspectionExpiration: dotInspectionExpiration || "", labels: labels || "", notes: notes || "", investor1: investor1 || "Unassigned", investor2: investor2 || "Unassigned", dispatchFeePercent: dispatchFeePercent || "", costItems: safeItems };
    setTruckRecords((prev) => [truck, ...prev]);
    if (driver1 && driver1 !== "Unassigned") updateDriverRecord(driver1, { truck: truck.unit });
    if (driver2 && driver2 !== "Unassigned") updateDriverRecord(driver2, { truck: truck.unit });
    setTruckModalOpen(false);
    save("Truck " + truck.unit + " created.");
  };

  const saveGeneratedInvoice = (payload) => {
    const loadIds = Array.isArray(payload) ? payload : Array.isArray(payload?.loadIds) ? payload.loadIds : [payload].filter(Boolean);
    const selectedLoads = loadRecords.filter((row) => loadIds.includes(row.id));
    if (!selectedLoads.length) {
      setInvoiceModalOpen(false);
      save("Select at least one load to generate invoice.");
      return;
    }
    const existing = invoiceRecords.find((row) => row.status !== "Paid" && selectedLoads.some((load) => row.load === load.id || (Array.isArray(row.loadIds) && row.loadIds.includes(load.id))));
    if (existing) {
      setInvoiceModalOpen(false);
      save("Invoice " + existing.ref + " already exists for selected load.");
      return;
    }
    const refNumbers = invoiceRecords.map((row) => Number(String(row.ref).replace(/[^0-9]/g, "")) || 101900);
    const nextRefNumber = Math.max(101900, ...refNumbers) + 1;
    const grouped = selectedLoads.length > 1;
    const total = selectedLoads.reduce((sum, load) => sum + moneyNumber(load.rate), 0);
    const firstLoad = selectedLoads[0];
    const missingDocsCount = selectedLoads.filter((load) => load.docs !== "Ready").length;
    const drivers = Array.from(new Set(selectedLoads.map((load) => load.driver).filter(Boolean)));
    const trucks = Array.from(new Set(selectedLoads.map((load) => load.truck).filter(Boolean)));
    const invoice = {
      ref: "#" + nextRefNumber,
      status: "Draft",
      load: grouped ? firstLoad.id + " + " + (selectedLoads.length - 1) + " loads" : firstLoad.id,
      loadIds: selectedLoads.map((load) => load.id),
      customer: grouped ? "Multiple customers" : firstLoad.customer,
      fleet: grouped ? "Grouped invoice" : firstLoad.source,
      truck: grouped ? trucks.length + " trucks · " + drivers.length + " drivers" : firstLoad.truck + " · " + firstLoad.driver,
      pickup: grouped ? selectedLoads.length + " pickups" : firstLoad.pickup,
      delivery: grouped ? selectedLoads.length + " deliveries" : firstLoad.delivery,
      amount: formatMoney(total),
      age: "0 / 30",
      issue: missingDocsCount ? "Missing POD on " + missingDocsCount + " load" + (missingDocsCount === 1 ? "" : "s") : null
    };
    setInvoiceRecords((prev) => [invoice, ...prev]);
    selectedLoads.forEach((load) => updateLoadRecord(load.id, { invoice: invoice.ref, invoiceStatus: "Draft", next: load.docs === "Ready" ? "Invoice draft ready" : "Upload POD before invoice send" }));
    setInvoiceModalOpen(false);
    save("Invoice " + invoice.ref + " generated for " + selectedLoads.length + " load" + (selectedLoads.length === 1 ? "" : "s") + ".");
  };

  const saveGeneratedExpense = ({ type = "Fuel", amount = 0, currency = "USD", date = "2026-05-22", fleet = "Zigzag Carrier LLC", truck = "#1974", driver = "Gudelio Ramos", load = "Unassigned", receiptUploaded = false, note = "" } = {}) => {
    const idNumbers = expenseRecords.map((row) => Number(String(row.id).replace(/[^0-9]/g, "")) || 4420);
    const nextIdNumber = Math.max(4420, ...idNumbers) + 1;
    const matched = load && load !== "Unassigned" && load !== "Overhead";
    const assigned = load && load !== "Unassigned";
    const isOverhead = load === "Overhead";
    const expense = {
      id: "EXP-" + nextIdNumber,
      type,
      amount: formatMoney(moneyNumber(amount)),
      currency,
      date: new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      fleet,
      truck,
      driver,
      load,
      status: receiptUploaded && assigned ? "Ready" : "Review",
      receipt: receiptUploaded ? "Uploaded" : "Missing",
      match: assigned ? "Assigned" : "Unassigned",
      approval: "Review",
      impact: isOverhead ? "Fleet overhead" : matched ? "Pending approval" : "Pending assignment",
      note,
    };
    setExpenseRecords((prev) => [expense, ...prev]);
    if (matched) updateLoadRecord(load, { expense: expense.amount, expenseStatus: receiptUploaded ? "Ready" : "Needs receipt", next: receiptUploaded ? "Expense ready to approve" : "Upload expense receipt" });
    setExpenseModalOpen(false);
    save("Expense " + expense.id + " created.");
  };

  const saveGeneratedPayroll = ({ period = "May 13 - May 20", rows = [] } = {}) => {
    const newRows = rows.filter((row) => !salaryRecords.some((salary) => salary.driver === row.driver && salary.period === period && salary.truck === row.truck));
    if (!newRows.length) {
      setSalaryModalOpen(false);
      save("Payroll already exists for selected drivers and period.");
      return;
    }
    const idNumbers = salaryRecords.map((row) => Number(String(row.id).replace(/[^0-9]/g, "")) || 1048);
    let nextId = Math.max(1048, ...idNumbers);
    const settlements = newRows.map((row) => {
      nextId += 1;
      return {
        id: "SET-" + nextId,
        driver: row.driver,
        truck: row.truck,
        period,
        loads: row.loads,
        gross: formatMoney(row.gross),
        deductions: formatMoney(row.deductions),
        reimbursements: formatMoney(row.reimbursements),
        net: formatMoney(row.net),
        status: row.blocked ? "Review" : "Ready",
        warning: row.blocked ? row.blocker : "Ready for approval",
      };
    });
    setSalaryRecords((prev) => [...settlements, ...prev]);
    setSalaryModalOpen(false);
    save(settlements.length + " payroll settlement" + (settlements.length === 1 ? "" : "s") + " generated.");
  };

  const approveReadyPayroll = () => {
    const readyRows = salaryRecords.filter((row) => getSalaryDisplayStatus(row) === "Ready to approve");
    if (!readyRows.length) {
      save("No payroll ready to approve.");
      return;
    }
    requestConfirm({
      title: "Approve ready payroll?",
      text: readyRows.length + " settlement" + (readyRows.length === 1 ? "" : "s") + " will be moved to Approved and become ready for payment.",
      confirmText: "Approve payroll",
      onConfirm: () => {
        setSalaryRecords((prev) => prev.map((row) => getSalaryDisplayStatus(row) === "Ready to approve" ? { ...row, status: "Approved", warning: "Approved" } : row));
        setLoadRecords((prev) => prev.map((load) => readyRows.some((salary) => salary.id === load.salary) ? { ...load, salaryStatus: "Approved", next: load.next === "Payroll ready to approve" ? "Payroll approved / ready to pay" : load.next } : load));
        save(readyRows.length + " payroll settlement" + (readyRows.length === 1 ? "" : "s") + " approved.");
      },
    });
  };

  const approveReadyExpenses = () => {
    const readyRows = expenseRecords.filter((row) => getExpenseDisplayStatus(row) === "Ready to approve");
    if (!readyRows.length) {
      save("No expenses ready to approve.");
      return;
    }
    requestConfirm({
      title: "Approve ready expenses?",
      text: readyRows.length + " expense" + (readyRows.length === 1 ? "" : "s") + " will be included in accounting and may unblock payroll.",
      confirmText: "Approve expenses",
      onConfirm: () => {
        setExpenseRecords((prev) => prev.map((row) => getExpenseDisplayStatus(row) === "Ready to approve" ? { ...row, status: "Approved", approval: "Approved", impact: row.load === "Overhead" ? "Approved overhead" : "Included in accounting" } : row));
        setLoadRecords((prev) => prev.map((load) => {
          const approvedExpense = readyRows.find((expense) => expense.load === load.id);
          if (!approvedExpense) return load;
          return { ...load, expense: approvedExpense.amount, expenseStatus: "Approved", salaryStatus: load.docs === "Ready" ? "Ready" : load.salaryStatus, next: load.docs === "Ready" ? "Payroll ready to approve" : "Upload POD before payroll" };
        }));
        setSalaryRecords((prev) => prev.map((salary) => {
          const hasApprovedLoad = loadRecords.some((load) => load.salary === salary.id && load.docs === "Ready" && readyRows.some((expense) => expense.load === load.id));
          return hasApprovedLoad && salary.status === "Review" ? { ...salary, status: "Ready", warning: "Expense approved" } : salary;
        }));
        save(readyRows.length + " expense" + (readyRows.length === 1 ? "" : "s") + " approved.");
      },
    });
  };

  const sendReadyInvoices = () => {
    const invoiceHasLoad = (invoice, loadId) => invoice.load === loadId || (Array.isArray(invoice.loadIds) && invoice.loadIds.includes(loadId));
    const readyRows = invoiceRecords.filter((row) => (row.status === "Ready" || row.status === "Draft") && !row.issue);
    if (!readyRows.length) {
      save("No invoices ready to send.");
      return;
    }
    const loadCount = readyRows.reduce((sum, invoice) => sum + (Array.isArray(invoice.loadIds) ? invoice.loadIds.length : 1), 0);
    requestConfirm({
      title: "Send ready invoices?",
      text: readyRows.length + " invoice" + (readyRows.length === 1 ? "" : "s") + " will be marked Invoiced across " + loadCount + " load" + (loadCount === 1 ? "" : "s") + ".",
      confirmText: "Send invoices",
      onConfirm: () => {
        setInvoiceRecords((prev) => prev.map((row) => readyRows.some((ready) => ready.ref === row.ref) ? { ...row, status: "Invoiced", issue: null } : row));
        setLoadRecords((prev) => prev.map((load) => readyRows.some((invoice) => invoiceHasLoad(invoice, load.id)) ? { ...load, invoiceStatus: "Invoiced", next: "Invoice sent / waiting for payment" } : load));
        save(readyRows.length + " invoice" + (readyRows.length === 1 ? "" : "s") + " sent for " + loadCount + " load" + (loadCount === 1 ? "" : "s") + ".");
      },
    });
  };

  const markInvoicedPaid = () => {
    const invoiceHasLoad = (invoice, loadId) => invoice.load === loadId || (Array.isArray(invoice.loadIds) && invoice.loadIds.includes(loadId));
    const payableRows = invoiceRecords.filter((row) => row.status === "Invoiced");
    if (!payableRows.length) {
      save("No invoiced records ready to mark paid.");
      return;
    }
    const loadCount = payableRows.reduce((sum, invoice) => sum + (Array.isArray(invoice.loadIds) ? invoice.loadIds.length : 1), 0);
    requestConfirm({
      title: "Mark invoices paid?",
      text: payableRows.length + " invoice" + (payableRows.length === 1 ? "" : "s") + " across " + loadCount + " load" + (loadCount === 1 ? "" : "s") + " will be closed as Paid.",
      confirmText: "Mark paid",
      tone: "danger",
      onConfirm: () => {
        setInvoiceRecords((prev) => prev.map((row) => payableRows.some((invoice) => invoice.ref === row.ref) ? { ...row, status: "Paid", age: "Paid", issue: null } : row));
        setLoadRecords((prev) => prev.map((load) => payableRows.some((invoice) => invoiceHasLoad(invoice, load.id)) ? { ...load, invoiceStatus: "Paid", next: "Invoice paid / ready for reports" } : load));
        save(payableRows.length + " invoice" + (payableRows.length === 1 ? "" : "s") + " marked paid for " + loadCount + " load" + (loadCount === 1 ? "" : "s") + ".");
      },
    });
  };

  const markLoadDocsReady = () => {
    const blockedRows = loadRecords.filter((row) => row.docs !== "Ready");
    if (!blockedRows.length) {
      save("No load documents need review.");
      return;
    }
    requestConfirm({
      title: "Mark load documents ready?",
      text: blockedRows.length + " load" + (blockedRows.length === 1 ? "" : "s") + " will be unblocked for invoice and payroll workflows.",
      confirmText: "Mark ready",
      onConfirm: () => {
        setLoadRecords((prev) => prev.map((row) => row.docs !== "Ready" ? { ...row, docs: "Ready", invoiceStatus: row.invoiceStatus === "In Review" ? "Ready" : row.invoiceStatus, next: "Documents ready" } : row));
        setInvoiceRecords((prev) => prev.map((invoice) => blockedRows.some((load) => load.invoice === invoice.ref) ? { ...invoice, issue: null, status: invoice.status === "In Review" ? "Ready" : invoice.status } : invoice));
        save(blockedRows.length + " load" + (blockedRows.length === 1 ? "" : "s") + " marked documents ready.");
      },
    });
  };

  const markActiveTripsDelivered = () => {
    const activeTrips = timelineRecords.filter((row) => row.status === "On Route");
    if (!activeTrips.length) {
      save("No active trips to mark delivered.");
      return;
    }
    requestConfirm({
      title: "Mark active trips delivered?",
      text: activeTrips.length + " active trip" + (activeTrips.length === 1 ? "" : "s") + " will move to Delivered and wait for POD.",
      confirmText: "Mark delivered",
      onConfirm: () => {
        setTimelineRecords((prev) => prev.map((row) => row.status === "On Route" ? { ...row, status: "Delivered", note: "Delivered. POD expected." } : row));
        setLoadRecords((prev) => prev.map((load) => activeTrips.some((trip) => trip.truck === load.truck) ? { ...load, status: "Delivered", invoiceStatus: load.invoiceStatus === "Invoiced" ? load.invoiceStatus : "In Review", next: "Upload POD before invoice send" } : load));
        save(activeTrips.length + " active trip" + (activeTrips.length === 1 ? "" : "s") + " marked delivered.");
      },
    });
  };

  const clearTimelineNotes = () => {
    const notedRows = timelineRecords.filter((row) => row.note);
    if (!notedRows.length) {
      save("No timeline notes to clear.");
      return;
    }
    setTimelineRecords((prev) => prev.map((row) => row.note ? { ...row, note: "" } : row));
    save(notedRows.length + " timeline note" + (notedRows.length === 1 ? "" : "s") + " cleared.");
  };

  const markReviewTrucksAvailable = () => {
    const reviewTrucks = truckRecords.filter((row) => row.status !== "Available" && row.status !== "In Transit");
    if (!reviewTrucks.length) {
      save("No trucks in review.");
      return;
    }
    setTruckRecords((prev) => prev.map((row) => reviewTrucks.some((truck) => truck.unit === row.unit) ? { ...row, status: "Available", next: "Ready for assignment" } : row));
    save(reviewTrucks.length + " truck" + (reviewTrucks.length === 1 ? "" : "s") + " marked available.");
  };

  const requestDriverDocuments = () => {
    const reviewDrivers = driverRecords.filter((row) => row.docs !== "Valid");
    if (!reviewDrivers.length) {
      save("No driver documents need review.");
      return;
    }
    setDriverRecords((prev) => prev.map((row) => row.docs !== "Valid" ? { ...row, docs: "Pending", safety: "Waiting" } : row));
    save("Document requests sent to " + reviewDrivers.length + " driver" + (reviewDrivers.length === 1 ? "" : "s") + ".");
  };

  const saveGeneratedReport = (type) => {
    const reportPeriod = "May 2026";
    const displayNameMap = { "Carrier performance": "Carrier Performance", "Driver performance": "Driver Performance" };
    const reportName = displayNameMap[type] || type;
    const existingReport = reportRecords.find((row) => row.name === reportName && row.period === reportPeriod);
    if (existingReport) {
      setReportModalOpen(false);
      save(reportName + " report already exists for " + reportPeriod + ".");
      return;
    }
    const idNumbers = reportRecords.map((row) => Number(String(row.id).replace(/[^0-9]/g, "")) || 1100);
    const nextIdNumber = Math.max(1100, ...idNumbers) + 1;
    const openInvoiceTotal = invoiceRecords.filter((row) => row.status !== "Paid").reduce((sum, row) => sum + moneyNumber(row.amount), 0);
    const expenseTotal = expenseRecords.reduce((sum, row) => sum + moneyNumber(row.amount), 0);
    const payrollTotal = salaryRecords.reduce((sum, row) => sum + moneyNumber(row.net), 0);
    const deliveredLoads = loadRecords.filter((row) => row.status === "Delivered" || row.status === "Docs Missing").length;
    const metricMap = {
      "Carrier Performance": deliveredLoads + " delivered loads",
      "Driver Performance": driverRecords.filter((row) => row.status === "Active").length + " active drivers",
      "Profit by Load": "$8,140 net profit",
      "Invoice Aging": formatMoney(openInvoiceTotal) + " open",
      "Expense Breakdown": formatMoney(expenseTotal) + " expenses",
      "Driver Payroll": formatMoney(payrollTotal) + " net payroll"
    };
    const sourceMap = {
      "Carrier Performance": "Operations summary",
      "Driver Performance": "Driver scorecard",
      "Profit by Load": "Performance overview",
      "Invoice Aging": "Receivables summary",
      "Expense Breakdown": "Expense summary",
      "Driver Payroll": "Payroll summary"
    };
    const report = { id: "RPT-" + nextIdNumber, name: reportName, metric: metricMap[reportName] || "Generated report", period: reportPeriod, status: "Generated", source: sourceMap[reportName] || "Report overview" };
    setReportRecords((prev) => [report, ...prev]);
    setReportModalOpen(false);
    save(reportName + " report generated.");
  };

  const searchItems = useMemo(() => {
    const mapRows = buildMapRows(loadRecords);
    return [
      ...driverRecords.map((item) => ({ type: "drivers", nav: "drivers", item, label: item.name, sub: `${item.truck} · ${item.docs}` })),
      ...truckRecords.map((item) => ({ type: "fleet", nav: "fleet", item, label: item.unit, sub: `${item.driver} · ${item.status}` })),
      ...loadRecords.map((item) => ({ type: "loads", nav: "loads", item, label: item.id, sub: `${item.trip} · ${item.next}` })),
      ...invoiceRecords.map((item) => ({ type: "invoices", nav: "invoices", item, label: item.ref, sub: `${item.customer} · ${item.status}` })),
      ...expenseRecords.map((item) => ({ type: "expenses", nav: "expenses", item, label: item.id, sub: `${item.type} · ${getExpenseDisplayStatus(item)}` })),
      ...salaryRecords.map((item) => ({ type: "salaries", nav: "salaries", item, label: item.id, sub: `${item.driver} · ${getSalaryDisplayStatus(item)}` })),
      ...mapRows.map((item) => ({ type: "map", nav: "map", item, label: item.name, sub: `${item.truck} · ${item.current}` })),
    ].filter((item) => contains(item, globalSearch)).slice(0, 8);
  }, [globalSearch, driverRecords, truckRecords, loadRecords, invoiceRecords, expenseRecords, salaryRecords]);

  return <div className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-slate-50 text-slate-950`}><MotionStyles /><div className="flex h-screen overflow-hidden"><aside className={`${collapsed ? "w-[76px]" : "w-[292px]"} hidden shrink-0 border-r border-slate-200 bg-white transition-all lg:flex lg:flex-col`}><div className={collapsed ? "flex h-16 items-center justify-center border-b border-slate-200 px-3" : "flex h-16 items-center justify-between border-b border-slate-200 px-4"}><button onClick={() => collapsed && setCollapsed(false)} className="rounded-xl p-1 hover:bg-slate-50"><HuntLogo compact={collapsed} /></button>{!collapsed && <Button variant="ghost" className="px-2" onClick={() => setCollapsed(true)}><Menu className="h-5 w-5" /></Button>}</div><nav className="min-h-0 flex-1 overflow-y-auto p-3">{navSections.map((section) => <div key={section.title} className="mb-5"><p className={`${collapsed ? "sr-only" : "px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400"}`}>{section.title}</p><div className="space-y-1">{section.items.map((item) => { const Icon = item.icon; const selected = active === item.id; return <button key={item.id} disabled={item.disabled} onClick={() => !item.disabled && setActive(item.id)} className={`group flex items-center rounded-xl text-sm font-medium transition ${collapsed ? "mx-auto h-11 w-11 justify-center p-0" : "w-full gap-3 px-3 py-2.5"} ${selected ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"} ${item.disabled ? "opacity-50" : ""}`}><Icon className="h-5 w-5 shrink-0" />{!collapsed && <><span className="flex-1 text-left">{item.label}</span>{item.disabled && <Badge className="border-slate-200 bg-slate-50 text-[10px] text-slate-500">Planned</Badge>}{!item.disabled && navCounts[item.id] > 0 && <span className={`rounded-full px-2 py-0.5 text-xs ${selected ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>{navCounts[item.id]}</span>}</>}</button>; })}</div></div>)}</nav><UserProfileDock collapsed={collapsed} role={role} onLogout={() => save("Logged out of demo workspace.")} /></aside><main className="flex min-w-0 flex-1 flex-col">{React.createElement("header", { className: "flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4" },
  React.createElement(Button, { variant: "ghost", className: "lg:hidden", onClick: () => setActive("overview") }, React.createElement(HuntLogo, { compact: true })),
  React.createElement("div", { className: "relative max-w-xl flex-1" },
    React.createElement(SearchBox, { value: globalSearch, onChange: setGlobalSearch, placeholder: "Search drivers, trucks, loads, invoices..." }),
    globalSearch ? React.createElement(Card, { className: "absolute left-0 right-0 top-11 z-50 max-h-80 overflow-auto p-2 shadow-xl" },
      searchItems.length ? searchItems.map((row) => React.createElement("button", {
        key: `${row.type}-${row.label}`,
        className: "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-slate-50",
        onClick: () => { setGlobalSearch(""); setActive(row.nav); openDrawer(row.type, row.item); }
      },
        React.createElement("span", null,
          React.createElement("span", { className: "block text-sm font-medium text-slate-950" }, row.label),
          React.createElement("span", { className: "block text-xs text-slate-500" }, row.sub)
        ),
        React.createElement(ChevronRight, { className: "h-4 w-4 text-slate-400" })
      )) : React.createElement(EmptyState, null)
    ) : null
  ),
  React.createElement("select", { value: role, onChange: (event) => setRole(event.target.value), className: "h-10 rounded-xl border border-slate-200 bg-white px-3.5 text-sm leading-5" },
    React.createElement("option", null, "Admin"),
    React.createElement("option", null, "Manager"),
    React.createElement("option", null, "Accounting"),
    React.createElement("option", null, "Dispatcher"),
    React.createElement("option", null, "Read-only")
  ),
  React.createElement(Button, { variant: "outline", onClick: () => setTheme(theme === "dark" ? "light" : "dark") }, theme === "dark" ? "Light" : "Dark")
)}
          <nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
            {navSections.flatMap((section) => section.items).filter((item) => !item.disabled).map((item) => { const Icon = item.icon; const selected = active === item.id; return <button key={item.id} onClick={() => setActive(item.id)} className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition ${selected ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}><Icon className="h-4 w-4" /><span>{item.label}</span>{navCounts[item.id] > 0 && <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${selected ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>{navCounts[item.id]}</span>}</button>; })}
          </nav><section className="min-h-0 flex-1 overflow-auto p-4 lg:p-6">{active === "overview" && <OverviewScreen loads={loadRecords} invoices={invoiceRecords} expenses={expenseRecords} salaries={salaryRecords} openDrawer={openDrawer} setActive={setActive} />}{active === "fleet" && <FleetScreen rows={truckRecords} openDrawer={openDrawer} openCreate={() => canRole(role, "create") ? setTruckModalOpen(true) : save("No permission to create trucks.")} markAvailable={() => canRole(role, "edit") ? markReviewTrucksAvailable() : save("No permission to update trucks.")} />}{active === "drivers" && <DriversScreen rows={driverRecords} openDrawer={openDrawer} openCreate={() => canRole(role, "create") ? setDriverModalOpen(true) : save("No permission to create drivers.")} requestDocuments={() => canRole(role, "upload") || canRole(role, "edit") ? requestDriverDocuments() : save("No permission to request documents.")} />}{active === "settings" && <SettingsScreen role={role} setRole={setRole} theme={theme} setTheme={setTheme} save={save} resetDemoData={resetDemoData} />}{active === "timeline" && <TimelineScreen rows={timelineRecords} openDrawer={openDrawer} markDelivered={() => canRole(role, "edit") ? markActiveTripsDelivered() : save("No permission to update timeline.")} clearNotes={() => canRole(role, "edit") ? clearTimelineNotes() : save("No permission to update timeline.")} />}{active === "loads" && <LoadsScreen rows={loadRecords} openDrawer={openDrawer} markDocsReady={() => canRole(role, "upload") || canRole(role, "edit") ? markLoadDocsReady() : save("No permission to update load documents.")} />}{active === "map" && <MapScreen rows={buildMapRows(loadRecords)} openDrawer={openDrawer} />}{active === "invoices" && <InvoicesScreen rows={invoiceRecords} openDrawer={openDrawer} openGenerate={() => canRole(role, "create") ? setInvoiceModalOpen(true) : save("No permission to generate invoices.")} sendReady={() => canRole(role, "send") ? sendReadyInvoices() : save("No permission to send invoices.")} markPaid={() => canRole(role, "pay") ? markInvoicedPaid() : save("No permission to mark invoices paid.")} />}{active === "expenses" && <ExpensesScreen rows={expenseRecords} openDrawer={openDrawer} openCreate={() => canRole(role, "create") ? setExpenseModalOpen(true) : save("No permission to create expenses.")} approveReady={() => canRole(role, "approve") ? approveReadyExpenses() : save("No permission to approve expenses.")} />}{active === "salaries" && <SalariesScreen rows={salaryRecords} openDrawer={openDrawer} openGenerate={() => canRole(role, "create") || canRole(role, "pay") ? setSalaryModalOpen(true) : save("No permission to generate payroll.")} approveReady={() => canRole(role, "approve") ? approveReadyPayroll() : save("No permission to approve payroll.")} />}{active === "reports" && <ReportsScreen rows={reportRecords} openDrawer={openDrawer} openGenerate={() => canRole(role, "create") || canRole(role, "export") ? setReportModalOpen(true) : save("No permission to generate reports.")} />}{active.includes("fuel") || active.includes("analytics") || active.includes("insights") || active.includes("activities") ? <SoonScreen title={navSections.flatMap((s) => s.items).find((item) => item.id === active)?.label || "Soon"} /> : null}</section></main></div>{drawer && <EntityDrawer drawer={drawer} closeDrawer={closeDrawer} role={role} truckRecords={truckRecords} loadRecords={loadRecords} updateLoad={updateLoadRecord} updateInvoice={updateInvoiceRecord} updateExpense={updateExpenseRecord} updateSalary={updateSalaryRecord} updateReport={updateReportRecord} updateDriver={updateDriverRecord} updateTruck={updateTruckRecord} updateTimeline={updateTimelineRecord} save={save} confirm={requestConfirm} />}{truckModalOpen && <TruckCreateModal onClose={() => setTruckModalOpen(false)} save={saveGeneratedTruck} driverRecords={driverRecords} />}{driverModalOpen && <DriverCreateModal onClose={() => setDriverModalOpen(false)} save={saveGeneratedDriver} truckRecords={truckRecords} />}{invoiceModalOpen && <InvoiceGenerateModal onClose={() => setInvoiceModalOpen(false)} save={saveGeneratedInvoice} loads={loadRecords} />}{expenseModalOpen && <ExpenseCreateModal onClose={() => setExpenseModalOpen(false)} save={saveGeneratedExpense} trucks={truckRecords} drivers={driverRecords} loads={loadRecords} />}{salaryModalOpen && <PayrollGenerateModal onClose={() => setSalaryModalOpen(false)} save={saveGeneratedPayroll} loads={loadRecords} drivers={driverRecords} salaries={salaryRecords} />}{reportModalOpen && <ReportGenerateModal onClose={() => setReportModalOpen(false)} save={saveGeneratedReport} notify={save} loads={loadRecords} drivers={driverRecords} trucks={truckRecords} invoices={invoiceRecords} expenses={expenseRecords} salaries={salaryRecords} />}{confirmDialog && <ConfirmDialog dialog={confirmDialog} onCancel={() => setConfirmDialog(null)} onConfirm={() => { const action = confirmDialog.onConfirm; setConfirmDialog(null); action?.(); }} />}{toast && <div className="fixed bottom-5 right-5 z-[80] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 shadow-2xl">{toast}</div>}</div>;
}

function OverviewScreen({ loads, invoices, expenses, salaries, openDrawer, setActive }) {
  const openInvoices = invoices.filter((row) => row.status !== "Paid");
  const openAr = openInvoices.reduce((sum, row) => sum + moneyNumber(row.amount), 0);
  const expenseTotal = expenses.reduce((sum, row) => sum + moneyNumber(row.amount), 0);
  const payrollTotal = salaries.reduce((sum, row) => sum + moneyNumber(row.net), 0);
  const deliveredLoads = loads.filter((row) => row.status === "Delivered" || row.status === "Docs Missing");
  const docsOpen = loads.filter((row) => row.docs !== "Ready");
  const invoiceBlocked = invoices.filter((row) => row.issue);
  const expenseIssues = expenses.filter((row) => getExpenseDisplayStatus(row) !== "Approved");
  const payrollIssues = salaries.filter((row) => getSalaryDisplayStatus(row) !== "Paid");
  const readyPayroll = salaries.filter((row) => getSalaryDisplayStatus(row) === "Ready to approve" || getSalaryDisplayStatus(row) === "Ready to pay");
  const attentionRows = [
    ...docsOpen.map((row) => ({ type: "loads", item: row, label: row.id, title: row.trip, meta: row.next || "Documents need review", status: "Needs review", icon: FileText })),
    ...invoiceBlocked.map((row) => ({ type: "invoices", item: row, label: row.ref, title: row.customer, meta: row.issue || "Invoice blocked", status: row.status, icon: FileText })),
    ...expenseIssues.map((row) => ({ type: "expenses", item: row, label: row.id, title: row.type + " · " + row.amount, meta: getExpenseNextStep(row), status: getExpenseDisplayStatus(row), icon: Receipt })),
    ...payrollIssues.map((row) => ({ type: "salaries", item: row, label: row.id, title: row.driver, meta: row.warning || getSalaryNextStep(row), status: getSalaryDisplayStatus(row), icon: WalletCards })),
  ].slice(0, 6);
  const healthCards = [
    { label: "Documents", value: loads.length - docsOpen.length + "/" + loads.length, hint: docsOpen.length ? docsOpen.length + " open" : "all ready", icon: FileText, status: docsOpen.length ? "Needs review" : "Ready" },
    { label: "Invoices", value: formatMoney(openAr), hint: openInvoices.length + " open", icon: DollarSign, status: invoiceBlocked.length ? "Needs review" : "Ready" },
    { label: "Expenses", value: String(expenseIssues.length), hint: "need action", icon: Receipt, status: expenseIssues.length ? "Needs review" : "Ready" },
    { label: "Payroll", value: String(readyPayroll.length), hint: "ready/approved", icon: WalletCards, status: readyPayroll.length ? "Ready" : "Pending" },
  ];
  const lanes = [
    { title: "Loads delivered", value: String(deliveredLoads.length), sub: "waiting for documents, billing or payroll", icon: Route, action: loads[0], type: "loads" },
    { title: "Billing open", value: formatMoney(openAr), sub: openInvoices.length + " receivables not closed", icon: FileText, action: openInvoices[0], type: "invoices" },
    { title: "Cost control", value: formatMoney(expenseTotal), sub: expenseIssues.length + " expenses need review", icon: Receipt, action: expenseIssues[0] || expenses[0], type: "expenses" },
    { title: "Payroll exposure", value: formatMoney(payrollTotal), sub: payrollIssues.length + " settlements not closed", icon: WalletCards, action: payrollIssues[0] || salaries[0], type: "salaries" },
  ];
  const checklistRows = [
    { label: "PODs collected", count: docsOpen.length, status: docsOpen.length ? "Needs review" : "Ready", detail: docsOpen.length ? docsOpen.length + " load" + (docsOpen.length === 1 ? "" : "s") + " still missing POD/documents" : "All load documents are ready", next: docsOpen.length ? "Open first blocked load" : "Review loads", tab: "loads", type: "loads", item: docsOpen[0] || loads[0], icon: FileText },
    { label: "Invoices sent", count: invoiceBlocked.length, status: invoiceBlocked.length ? "Needs review" : "Ready", detail: invoiceBlocked.length ? invoiceBlocked.length + " invoice" + (invoiceBlocked.length === 1 ? "" : "s") + " blocked by missing docs or aging" : openInvoices.length + " open invoice" + (openInvoices.length === 1 ? "" : "s") + " being tracked", next: invoiceBlocked.length ? "Open blocked invoice" : "Go to invoices", tab: "invoices", type: "invoices", item: invoiceBlocked[0] || openInvoices[0] || invoices[0], icon: Send },
    { label: "Expenses approved", count: expenseIssues.length, status: expenseIssues.length ? "Needs review" : "Ready", detail: expenseIssues.length ? expenseIssues.length + " expense" + (expenseIssues.length === 1 ? "" : "s") + " need receipt, assignment or approval" : "All expenses are approved for accounting", next: expenseIssues.length ? "Open expense issue" : "Review expenses", tab: "expenses", type: "expenses", item: expenseIssues[0] || expenses[0], icon: Receipt },
    { label: "Payroll clean", count: payrollIssues.length, status: payrollIssues.length ? "Needs review" : "Ready", detail: payrollIssues.length ? payrollIssues.length + " settlement" + (payrollIssues.length === 1 ? "" : "s") + " not closed yet" : "All settlements are paid or clean", next: payrollIssues.length ? "Open payroll blocker" : "Review payroll", tab: "salaries", type: "salaries", item: payrollIssues[0] || salaries[0], icon: WalletCards },
  ];
  const openChecklistItem = (row) => {
    setActive?.(row.tab);
    if (row.item) openDrawer(row.type, row.item);
  };

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
        <Card className="relative overflow-hidden p-5 lg:p-6">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-slate-100 blur-3xl" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live carrier workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">Operations command center</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">One screen to see what blocks cash collection, driver documents, expenses and payroll before the day gets messy.</p>
            </div>
            <div className="grid min-w-[260px] gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Open AR</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{formatMoney(openAr)}</p>
                <p className="mt-1 text-xs text-slate-500">{openInvoices.length} invoices waiting</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Action queue</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{attentionRows.length}</p>
                <p className="mt-1 text-xs text-slate-500">items visible in this demo state</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">Monthly trend</p>
                <p className="mt-1 text-sm text-slate-500">Revenue movement from demo operations.</p>
              </div>
              <StatusBadge value="Ready" />
            </div>
          </div>
          <div className="p-4"><MiniChart /></div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {healthCards.map((card) => {
          const Icon = card.icon;
          return <Card key={card.label} className="motion-card p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{card.label}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{card.value}</p><p className="mt-1 text-xs text-slate-500">{card.hint}</p></div><div className="rounded-xl bg-slate-50 p-2"><Icon className="h-4 w-4 text-slate-700" /></div></div><div className="mt-3"><StatusBadge value={card.status} /></div></Card>;
        })}
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1fr_380px]">
        <Card className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
            <div>
              <p className="text-base font-semibold text-slate-950">Priority board</p>
              <p className="mt-1 text-sm text-slate-500">Highest-impact records to open first.</p>
            </div>
            <Badge className="border-slate-200 bg-slate-50 text-slate-600">{attentionRows.length} items</Badge>
          </div>
          <div className="min-h-0 flex-1 overflow-auto divide-y divide-slate-100">
            {attentionRows.length ? attentionRows.map((row) => {
              const Icon = row.icon;
              return <button key={row.type + row.label} onClick={() => openDrawer(row.type, row.item)} className="flex w-full items-center gap-4 px-4 py-4 text-left hover:bg-slate-50"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50"><Icon className="h-4 w-4 text-slate-700" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-slate-950">{row.label}</p><StatusBadge value={row.status} /></div><p className="mt-1 truncate text-sm text-slate-500">{row.title}</p><p className="mt-1 truncate text-xs text-slate-400">{row.meta}</p></div><ChevronRight className="h-4 w-4 shrink-0 text-slate-400" /></button>;
            }) : <div className="p-4"><EmptyState title="No urgent records" text="Everything is clean in the current demo state." /></div>}
          </div>
        </Card>

        <div className="flex min-h-0 flex-col gap-4">
          <Card className="p-4">
            <p className="text-base font-semibold text-slate-950">Operating lanes</p>
            <div className="mt-4 grid gap-3">
              {lanes.map((lane) => {
                const Icon = lane.icon;
                return <button key={lane.title} onClick={() => lane.action && openDrawer(lane.type, lane.action)} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left hover:bg-slate-50"><div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-slate-50 p-2"><Icon className="h-4 w-4 text-slate-700" /></div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-950">{lane.title}</p><p className="truncate text-xs text-slate-500">{lane.sub}</p></div></div><p className="shrink-0 text-sm font-semibold text-slate-950">{lane.value}</p></button>;
              })}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-950">Close-the-day checklist</p>
                  <p className="mt-1 text-sm text-slate-500">Click an item to jump into the right workflow.</p>
                </div>
                <Badge className="border-slate-200 bg-slate-50 text-slate-600">{checklistRows.filter((row) => row.count > 0).length} open</Badge>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {checklistRows.map((row) => {
                const Icon = row.icon;
                return <button key={row.label} onClick={() => openChecklistItem(row)} className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-slate-50">
                  <div className="mt-0.5 rounded-2xl bg-slate-50 p-2"><Icon className="h-4 w-4 text-slate-700" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-slate-950">{row.label}</p>
                      <StatusBadge value={row.status} />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{row.detail}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-700"><span>{row.next}</span><ChevronRight className="h-3.5 w-3.5" /></div>
                  </div>
                </button>;
              })}
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-base font-semibold text-slate-950">Financial pulse</p>
            <div className="mt-4 grid gap-3">
              <DetailLine label="Open AR" value={formatMoney(openAr)} />
              <DetailLine label="Expenses" value={formatMoney(expenseTotal)} />
              <DetailLine label="Payroll" value={formatMoney(payrollTotal)} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BasicTable({ rows, columns, openDrawer, type, searchPlaceholder = "Search...", filtersFirst = false, minWidth = "", compact = true }) {
  const [query, setQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState("All");
  const visible = rows.filter((row) => {
    if (!contains(row, query)) return false;
    if (quickFilter === "All") return true;
    const text = JSON.stringify(row).toLowerCase();
    if (quickFilter === "Review") return text.includes("review") || text.includes("missing") || text.includes("needs");
    if (quickFilter === "Ready") return text.includes("ready") || text.includes("approved") || text.includes("paid") || text.includes("invoiced");
    return true;
  });
  const filterButton = (label) => React.createElement("button", {
    key: label,
    onClick: () => setQuickFilter(label),
    className: quickFilter === label ? "rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-950 transition" : "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
  }, label);
  const tableClass = ["hidden w-full table-fixed text-left text-sm md:table", minWidth].filter(Boolean).join(" ");
  const thClass = compact ? "px-3 py-3 font-semibold" : "px-4 py-3.5 font-semibold";
  const tdClass = compact ? "max-w-0 overflow-hidden px-3 py-3 align-middle" : "max-w-0 overflow-hidden px-4 py-4 align-middle";
  const cellContent = (column, row) => column.render ? column.render(row) : row[column.key];

  return React.createElement(Card, { className: "flex min-h-0 flex-1 flex-col overflow-hidden" },
    React.createElement("div", { className: "border-b border-slate-200 bg-white/80 p-4" },
      React.createElement("div", { className: "flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between" },
        React.createElement("div", { className: filtersFirst ? "w-full xl:max-w-xl xl:order-2" : "w-full xl:max-w-xl" }, React.createElement(SearchBox, { value: query, onChange: setQuery, placeholder: searchPlaceholder })),
        React.createElement("div", { className: filtersFirst ? "flex flex-wrap items-center gap-2 xl:order-1" : "flex flex-wrap items-center gap-2" },
          filterButton("All"),
          filterButton("Review"),
          filterButton("Ready"),
          React.createElement("button", { onClick: () => { setQuery(""); setQuickFilter("All"); }, className: "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50" }, "Clear")
        )
      )
    ),
    React.createElement("div", { className: "min-h-0 flex-1 overflow-y-auto overflow-x-hidden" },
      visible.length ? React.createElement(React.Fragment, null,
        React.createElement("div", { className: "grid gap-3 p-3 md:hidden" },
          visible.map((row) => React.createElement("button", { key: row.id || row.ref || row.unit || row.name, className: "rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm", onClick: () => openDrawer(type, row) },
            React.createElement("div", { className: "flex items-start justify-between gap-3" },
              React.createElement("div", { className: "min-w-0" },
                React.createElement("div", { className: "truncate text-sm font-semibold text-slate-950" }, cellContent(columns[0], row)),
                columns[1] ? React.createElement("div", { className: "mt-1 truncate text-xs text-slate-500" }, cellContent(columns[1], row)) : null
              ),
              React.createElement(ChevronRight, { className: "h-4 w-4 shrink-0 text-slate-400" })
            ),
            React.createElement("div", { className: "mt-3 grid gap-2 text-xs text-slate-500" },
              columns.slice(2, 5).map((column) => React.createElement("div", { key: column.key, className: "flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2" },
                React.createElement("span", { className: "shrink-0" }, column.label),
                React.createElement("span", { className: "min-w-0 truncate text-right font-medium text-slate-700" }, cellContent(column, row))
              ))
            )
          ))
        ),
        React.createElement("table", { className: tableClass },
        React.createElement("thead", { className: "sticky top-0 z-10 bg-slate-50/95 text-xs uppercase tracking-wide text-slate-500 backdrop-blur" },
          React.createElement("tr", null, columns.map((column) => React.createElement("th", { key: column.key, className: thClass }, column.label)))
        ),
        React.createElement("tbody", { className: "divide-y divide-slate-100 bg-white" },
          visible.map((row) => React.createElement("tr", { key: row.id || row.ref || row.unit || row.name, className: "cursor-pointer transition hover:bg-slate-50", onClick: () => openDrawer(type, row) },
            columns.map((column) => React.createElement("td", { key: column.key, className: tdClass },
              React.createElement("div", { className: "min-w-0 truncate" }, cellContent(column, row))
            ))
          ))
        )
      )) : React.createElement("div", { className: "p-4" }, React.createElement(EmptyState, null))
    )
  );
}

function ScreenShell({ title, subtitle, actions, children }) {
  return React.createElement("div", { className: "flex h-full min-h-0 flex-col gap-4" },
    React.createElement("div", { className: "flex shrink-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between" },
      React.createElement("div", null,
        React.createElement("h1", { className: "text-2xl font-semibold tracking-tight text-slate-950" }, title),
        React.createElement("p", { className: "mt-1 max-w-3xl text-sm text-slate-500" }, subtitle)
      ),
      actions ? React.createElement("div", { className: "flex shrink-0 flex-wrap items-center gap-2" }, actions) : null
    ),
    children
  );
}

function FleetScreen({ rows, openDrawer, openCreate, markAvailable }) {
  const available = rows.filter((row) => row.status === "Available");
  const activeRows = rows.filter((row) => row.status === "In Transit");
  const reviewRows = rows.filter((row) => row.status !== "Available" && row.status !== "In Transit");
  const assignedRows = rows.filter((row) => row.driver !== "Unassigned" && row.driver !== "—");
  const unassignedRows = rows.filter((row) => row.driver === "Unassigned");
  const columns = [
    { key: "unit", label: "Truck", render: (row) => React.createElement("div", { className: "font-semibold text-slate-950" }, row.unit, React.createElement("div", { className: "text-xs font-normal text-slate-500" }, row.vin)) },
    { key: "driver", label: "Driver" },
    { key: "trailer", label: "Trailer" },
    { key: "status", label: "Status", render: (row) => React.createElement(StatusBadge, { value: row.status }) },
    { key: "next", label: "Next" },
  ];
  return React.createElement(ScreenShell, { title: "Equipment", subtitle: "Fleet workspace: trucks, driver assignment, status and next operating step.", actions: React.createElement("div", { className: "flex flex-wrap gap-2" }, React.createElement(Button, { variant: "outline", onClick: markAvailable }, "Mark available"), React.createElement(Button, { onClick: openCreate }, React.createElement(Plus, { className: "mr-2 h-4 w-4" }), "Add truck")) },
    React.createElement("div", { className: "grid gap-4 md:grid-cols-3" },
      React.createElement(KpiCard, { label: "Active trucks", value: String(activeRows.length), hint: "Currently moving freight", icon: Truck, accent: "bg-slate-50" }),
      React.createElement(KpiCard, { label: "Available", value: String(available.length), hint: "Ready for assignment", icon: CheckCircle2, accent: "bg-emerald-50" }),
      React.createElement(KpiCard, { label: "Needs review", value: String(reviewRows.length), hint: "Maintenance or compliance", icon: AlertTriangle, accent: "bg-amber-50" })
    ),
    React.createElement("div", { className: "grid gap-4 xl:grid-cols-[1fr_360px]" },
      React.createElement(BasicTable, { rows: rows, type: "fleet", openDrawer: openDrawer, searchPlaceholder: "Search truck...", columns: columns }),
      React.createElement("div", { className: "space-y-4" },
        React.createElement(Card, { className: "p-4" },
          React.createElement("p", { className: "text-base font-semibold text-slate-950" }, "Fleet summary"),
          React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Assignment and readiness at a glance."),
          React.createElement("div", { className: "mt-4 grid gap-3" },
            React.createElement(InfoLine, { label: "Active", value: String(activeRows.length), icon: Route }),
            React.createElement(InfoLine, { label: "Available", value: String(available.length), icon: CheckCircle2 })
          )
        ),
        React.createElement(Card, { className: "p-4" },
          React.createElement("p", { className: "text-base font-semibold text-slate-950" }, "Review queue"),
          React.createElement("div", { className: "mt-4 grid gap-3" },
            React.createElement(InfoLine, { label: "Assigned trucks", value: String(assignedRows.length), icon: UserRound }),
            React.createElement(InfoLine, { label: "Unassigned trucks", value: String(unassignedRows.length), icon: Truck }),
            React.createElement(InfoLine, { label: "Review queue", value: String(reviewRows.length), icon: AlertTriangle })
          )
        )
      )
    )
  );
}

function DriversScreen({ rows, openDrawer, openCreate, requestDocuments }) {
  const enabled = rows.filter((row) => row.app === "Enabled");
  const docsReview = rows.filter((row) => row.docs !== "Valid");
  const payrollEnabled = rows.filter((row) => row.payroll === "Enabled");
  const columns = [
    { key: "name", label: "Driver", render: (row) => React.createElement("div", { className: "font-semibold text-slate-950" }, row.name, React.createElement("div", { className: "text-xs font-normal text-slate-500" }, row.email)) },
    { key: "truck", label: "Truck" },
    { key: "type", label: "Type" },
    { key: "docs", label: "Docs", render: (row) => React.createElement(StatusBadge, { value: row.docs }) },
    { key: "app", label: "Mobile", render: (row) => React.createElement(StatusBadge, { value: row.app }) },
  ];
  return React.createElement(ScreenShell, { title: "Drivers", subtitle: "Driver profiles, document readiness, mobile access and truck assignment.", actions: React.createElement("div", { className: "flex flex-wrap gap-2" }, React.createElement(Button, { variant: "outline", onClick: requestDocuments }, "Request documents"), React.createElement(Button, { onClick: openCreate }, React.createElement(Plus, { className: "mr-2 h-4 w-4" }), "Add driver")) },
    React.createElement("div", { className: "grid gap-4 md:grid-cols-4" },
      React.createElement(KpiCard, { label: "Drivers", value: String(rows.length), hint: "Total profiles", icon: UserRound, accent: "bg-slate-50" }),
      React.createElement(KpiCard, { label: "Mobile access", value: String(enabled.length), hint: "Enabled users", icon: ShieldCheck, accent: "bg-emerald-50" }),
      React.createElement(KpiCard, { label: "Docs review", value: String(docsReview.length), hint: "Missing or expiring", icon: FileText, accent: "bg-amber-50" }),
      React.createElement(KpiCard, { label: "Payroll", value: String(payrollEnabled.length), hint: "Ready for settlement", icon: WalletCards, accent: "bg-purple-50" })
    ),
    React.createElement("div", { className: "grid gap-4 xl:grid-cols-[1fr_360px]" },
      React.createElement(BasicTable, { rows: rows, type: "drivers", openDrawer: openDrawer, searchPlaceholder: "Search driver...", columns: columns }),
      React.createElement("div", { className: "space-y-4" },
        React.createElement(Card, { className: "p-4" },
          React.createElement("p", { className: "text-base font-semibold text-slate-950" }, "Driver summary"),
          React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Mobile access, documents and payroll readiness."),
          React.createElement("div", { className: "mt-4 grid gap-3" },
            React.createElement(InfoLine, { label: "Mobile access", value: String(enabled.length), icon: ShieldCheck }),
            React.createElement(InfoLine, { label: "Docs need review", value: String(docsReview.length), icon: AlertTriangle }),
            React.createElement(InfoLine, { label: "Payroll enabled", value: String(payrollEnabled.length), icon: WalletCards })
          )
        ),
        React.createElement(Card, { className: "p-4" },
          React.createElement("p", { className: "text-base font-semibold text-slate-950" }, "Next action"),
          React.createElement("div", { className: "mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-700" }, docsReview.length ? "Request missing or expiring documents." : "All driver documents look good.")
        )
      )
    )
  );
}

function TimelineScreen({ rows, openDrawer, markDelivered, clearNotes }) {
  return (
    <ScreenShell title="Timeline" subtitle="Operational hub for truck schedule, appointments, route status and dispatch exceptions." actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={clearNotes}>Clear notes</Button><Button variant="outline" onClick={markDelivered}>Mark active delivered</Button></div>}>
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Active trips" value={String(rows.filter((row) => row.status === "On Route").length)} hint="Moving now" icon={Route} accent="bg-slate-50" />
        <KpiCard label="Delivered" value={String(rows.filter((row) => row.status === "Delivered").length)} hint="Ready for docs" icon={CheckCircle2} accent="bg-emerald-50" />
        <KpiCard label="Exceptions" value={String(rows.filter((row) => row.note).length)} hint="Needs attention" icon={AlertTriangle} accent="bg-amber-50" />
        <KpiCard label="Timeline rows" value={String(rows.length)} hint="Truck lanes" icon={Clock3} accent="bg-purple-50" />
      </div>
      <Card className="flex min-h-0 flex-1 overflow-hidden">
        <div className="w-[300px] shrink-0 border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-950">Dispatch lanes</p>
            <p className="mt-1 text-xs text-slate-500">Select a truck to review trip details.</p>
          </div>
          {rows.map((row) => (
            <button key={row.id} onClick={() => openDrawer("timeline", row)} className="flex w-full items-start justify-between border-b border-slate-200 p-4 text-left hover:bg-slate-50">
              <div>
                <p className="font-semibold">{row.truck} · {row.driver}</p>
                <p className="text-xs text-slate-500">{row.home}</p>
                <div className="mt-2"><StatusBadge value={row.status} /></div>
              </div>
              <MoreDot />
            </button>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-auto p-4">
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-950">Route board</span>
            <span>Active route · Delivered route · Select bar to review trip</span>
          </div>
          <div className="grid min-w-[900px] grid-cols-5 border-b border-slate-200 pb-3 text-sm font-medium text-slate-500">
            <span>Wed 09/24</span><span>Thu 09/25</span><span>Fri 09/26</span><span>Sat 09/27</span><span>Sun 09/28</span>
          </div>
          <div className="relative min-w-[900px] space-y-5 py-5">
            {rows.map((row) => (
              <div key={row.id} className="relative h-14 rounded-xl bg-slate-50">
                {row.bars.map((bar) => (
                  <button key={bar.id} onClick={() => openDrawer("timeline", { ...row, activeBar: bar })} style={{ left: bar.start + "%", width: bar.width + "%" }} className="absolute top-3 h-8 rounded-xl border border-slate-200 bg-slate-100 px-3 text-xs font-medium text-slate-700 hover:bg-slate-200">
                    <span className="mr-2 text-orange-600">{bar.startLabel}</span>{bar.from} → {bar.to}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </ScreenShell>
  );
}

function LoadsScreen({ rows, openDrawer, markDocsReady }) {
  const docsOpen = rows.filter((row) => row.docs !== "Ready");
  const invoiceReady = rows.filter((row) => row.invoiceStatus === "Invoiced" || row.invoiceStatus === "Ready");
  const payrollBlocked = rows.filter((row) => row.salaryStatus === "Review");
  const delivered = rows.filter((row) => row.status === "Delivered" || row.status === "Docs Missing");

  return (
    <ScreenShell title="Loads" subtitle="The central record that connects timeline, documents, invoices, expenses and payroll." actions={<Button variant="outline" onClick={markDocsReady}>Mark docs ready</Button>}>
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Delivered loads" value={String(delivered.length)} hint="Ready for docs/accounting" icon={Route} accent="bg-slate-50" />
        <KpiCard label="Docs open" value={String(docsOpen.length)} hint="POD / receipt blockers" icon={FileText} accent="bg-amber-50" />
        <KpiCard label="Invoices ready" value={String(invoiceReady.length)} hint="Sent or ready" icon={Send} accent="bg-emerald-50" />
        <KpiCard label="Payroll blocked" value={String(payrollBlocked.length)} hint="Review needed" icon={WalletCards} accent="bg-purple-50" />
      </div>
      <BasicTable rows={rows} type="loads" openDrawer={openDrawer} searchPlaceholder="Search load..." filtersFirst={true} columns={[
        { key: "id", label: "Load", render: (row) => <div className="font-semibold text-slate-950">{row.id}<div className="text-xs font-normal text-slate-500">{row.trip}</div></div> },
        { key: "driver", label: "Driver" },
        { key: "truck", label: "Truck" },
        { key: "docs", label: "Docs", render: (row) => <StatusBadge value={row.docs === "Ready" ? "Ready" : "Needs review"} /> },
        { key: "invoiceStatus", label: "Invoice", render: (row) => <StatusBadge value={row.invoiceStatus} /> },
        { key: "salaryStatus", label: "Payroll", render: (row) => <StatusBadge value={row.salaryStatus === "Review" ? "Needs review" : row.salaryStatus} /> },
        { key: "next", label: "Next" },
      ]} />
    </ScreenShell>
  );
}

function MapScreen({ rows, openDrawer }) {
  const [selectedId, setSelectedId] = useState(rows[0]?.id || null);
  const [query, setQuery] = useState("");
  const [mapFilter, setMapFilter] = useState("All");
  const [zoomed, setZoomed] = useState(false);
  const atlantaPins = [
    { x: 780, y: 445, route: "M780 445 C735 405 720 360 690 318 C660 275 605 270 555 292 C500 317 468 360 420 390" },
    { x: 1070, y: 385, route: "M1070 385 C1015 392 960 410 910 452 C850 502 775 500 710 466 C650 435 598 430 548 452" },
    { x: 585, y: 565, route: "M585 565 C610 520 645 492 688 466 C735 438 762 404 780 360 C798 314 840 292 892 278" },
    { x: 920, y: 245, route: "M920 245 C875 282 840 320 812 365 C780 415 732 448 674 465 C615 482 555 512 505 555" },
  ];
  const mapRows = rows.map((row, index) => ({ ...row, map: atlantaPins[index % atlantaPins.length] }));
  const visibleRows = mapRows.filter((row) => {
    if (!contains(row, query)) return false;
    if (mapFilter === "Issues") return row.signal === "Offline" || row.partial !== "Load ready";
    if (mapFilter === "Online") return row.signal === "Online";
    return true;
  });
  const selected = visibleRows.find((row) => row.id === selectedId) || visibleRows[0] || mapRows[0];
  const online = mapRows.filter((row) => row.signal === "Online").length;
  const issues = mapRows.filter((row) => row.signal === "Offline" || row.partial !== "Load ready").length;
  const selectDriver = (driver) => {
    setSelectedId(driver.id);
    setZoomed(true);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Map</h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">Track active drivers, route status and load context from one operational map.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <Badge className="border-slate-200 bg-white text-slate-700">{mapRows.length} drivers</Badge>
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">{online} online</Badge>
          <Badge className="border-amber-200 bg-amber-50 text-amber-700">{issues} issues</Badge>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[286px_1fr]">
        <Card className="flex min-h-0 flex-col overflow-hidden">
          <div className="border-b border-slate-200 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Fleet drivers</p>
                <p className="mt-1 text-xs text-slate-500">Select driver to zoom route.</p>
              </div>
              <Button variant="ghost" className="px-2 py-1.5 text-xs" onClick={() => setZoomed(false)}>Reset</Button>
            </div>
            <div className="mt-3"><SearchBox value={query} onChange={setQuery} placeholder="Search driver..." /></div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {["All", "Issues", "Online"].map((item) => <button key={item} onClick={() => setMapFilter(item)} className={mapFilter === item ? "rounded-xl bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white" : "rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"}>{item}</button>)}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-2">
            {visibleRows.length ? visibleRows.map((driver) => {
              const active = selected?.id === driver.id;
              const issue = driver.signal === "Offline" || driver.partial !== "Load ready";
              return (
                <button key={driver.id} onClick={() => selectDriver(driver)} className={`mb-1.5 w-full rounded-2xl border p-2.5 text-left transition ${active ? "border-slate-950 bg-slate-50" : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{driver.name}</p>
                      <p className="mt-1 text-xs text-slate-500">Truck {driver.truck} · {driver.load}</p>
                    </div>
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${driver.signal === "Online" ? "bg-emerald-500" : "bg-slate-400"}`} />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span className="truncate">{driver.current}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{driver.destination}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <StatusBadge value={issue ? "Needs review" : "Ready"} />
                    <span className="text-xs font-medium text-slate-500">ETA {driver.eta}</span>
                  </div>
                </button>
              );
            }) : <EmptyState />}
          </div>
        </Card>

        <Card className="relative min-h-[560px] overflow-hidden bg-slate-100">
          <AtlantaFleetMap rows={visibleRows.length ? visibleRows : mapRows} selected={selected} zoomed={zoomed} onSelect={selectDriver} />
          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-2xl border border-white/70 bg-white/95 p-3 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold text-slate-950">{selected?.name}</p>
                  <StatusBadge value={selected?.signal} />
                  <StatusBadge value={selected?.status} />
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">Truck {selected?.truck} · Load {selected?.load} · {selected?.origin} → {selected?.destination}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" onClick={() => setZoomed(false)}>Show fleet</Button>
                <Button onClick={() => openDrawer("loads", { id: selected?.load })}>Open load</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AtlantaFleetMap({ rows, selected, zoomed, onSelect }) {
  const [mapZoom, setMapZoom] = useState(15);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState(null);
  const mapRef = useRef(null);
  const selectedMap = selected?.map || { x: 780, y: 445 };
  const displayZoom = zoomed ? Math.min(mapZoom + 1, 17) : mapZoom;
  const tileSize = 256;
  const center = { lat: 47.56946810084396, lng: -122.31879222822118 };
  const worldPixel = (lat, lng, zoom) => {
    const sin = Math.sin((lat * Math.PI) / 180);
    const scale = tileSize * Math.pow(2, zoom);
    return { x: ((lng + 180) / 360) * scale, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale };
  };
  const centerPixel = worldPixel(center.lat, center.lng, displayZoom);
  const centerTile = { x: Math.floor(centerPixel.x / tileSize), y: Math.floor(centerPixel.y / tileSize) };
  const centerOffset = { x: centerPixel.x - centerTile.x * tileSize, y: centerPixel.y - centerTile.y * tileSize };
  const tileRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
  const tiles = tileRange.flatMap((dx) => tileRange.map((dy) => {
    const x = centerTile.x + dx;
    const y = centerTile.y + dy;
    const subdomain = ["a", "b", "c"][Math.abs(x + y) % 3];
    return { key: displayZoom + "-" + x + "-" + y, x, y, left: dx * tileSize - centerOffset.x, top: dy * tileSize - centerOffset.y, url: "https://" + subdomain + ".basemaps.cartocdn.com/light_all/" + displayZoom + "/" + x + "/" + y + ".png" };
  }));
  const rawPercent = (value, max) => Math.max(12, Math.min(88, (value / max) * 100));
  const rawPoints = rows.map((driver) => {
    const pin = driver.map || { x: 780, y: 445 };
    return { id: driver.id, x: rawPercent(pin.x, 1400), y: rawPercent(pin.y, 820) };
  });
  const bounds = rawPoints.reduce((acc, point) => ({ minX: Math.min(acc.minX, point.x), maxX: Math.max(acc.maxX, point.x), minY: Math.min(acc.minY, point.y), maxY: Math.max(acc.maxY, point.y) }), { minX: 100, maxX: 0, minY: 100, maxY: 0 });
  const clusterCenterX = rows.length ? (bounds.minX + bounds.maxX) / 2 : 50;
  const clusterCenterY = rows.length ? (bounds.minY + bounds.maxY) / 2 : 50;
  const centerOffsetX = 50 - clusterCenterX;
  const centerOffsetY = 50 - clusterCenterY;
  const positionFor = (driver) => {
    const pin = driver.map || { x: 780, y: 445 };
    return { left: Math.max(16, Math.min(84, rawPercent(pin.x, 1400) + centerOffsetX)), top: Math.max(18, Math.min(82, rawPercent(pin.y, 820) + centerOffsetY)) };
  };
  const selectedPosition = selected ? positionFor(selected) : { left: 50, top: 50 };
  useEffect(() => {
    if (!zoomed) { setPan({ x: 0, y: 0 }); return; }
    const box = mapRef.current?.getBoundingClientRect?.();
    const width = box?.width || 1000;
    const height = box?.height || 560;
    setPan({ x: ((50 - selectedPosition.left) / 100) * width, y: ((50 - selectedPosition.top) / 100) * height });
  }, [zoomed, selected?.id, selectedPosition.left, selectedPosition.top]);
  const startPan = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target?.closest?.("[data-map-interactive]")) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragState({ x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y });
  };
  const movePan = (event) => {
    if (!dragState) return;
    setPan({ x: dragState.panX + event.clientX - dragState.x, y: dragState.panY + event.clientY - dragState.y });
  };
  const stopPan = () => setDragState(null);
  return (
    <div ref={mapRef} className={`relative h-full w-full overflow-hidden bg-[#f5f5f5] ${dragState ? "cursor-grabbing" : "cursor-grab"}`} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={stopPan} onPointerLeave={stopPan}>
      <MapTileLayer tiles={tiles} pan={pan} />
      <div data-map-interactive="true" className="absolute right-4 top-4 z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur">
        <button type="button" onClick={() => setMapZoom((value) => Math.min(17, value + 1))} className="block h-9 w-9 border-b border-slate-200 text-lg font-semibold text-slate-700 hover:bg-slate-50">+</button>
        <button type="button" onClick={() => setMapZoom((value) => Math.max(12, value - 1))} className="block h-9 w-9 text-lg font-semibold text-slate-700 hover:bg-slate-50">−</button>
      </div>
      <div className="absolute left-4 top-4 z-30 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">CARTO light map · zoom {displayZoom}</div>
      <div className="absolute bottom-24 left-4 z-30 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[10px] font-medium text-slate-500 shadow-sm backdrop-blur">© CARTO · © OpenStreetMap</div>
      <div className="absolute inset-0 z-20" style={{ transform: "translate(" + pan.x + "px, " + pan.y + "px)" }}>
        {rows.map((driver) => {
          const active = selected?.id === driver.id;
          const issue = driver.signal === "Offline" || driver.partial !== "Load ready";
          const position = positionFor(driver);
          return (
            <button data-map-interactive="true" key={driver.id} onClick={() => onSelect(driver)} className="absolute -translate-x-1/2 -translate-y-full text-left" style={{ left: position.left + "%", top: position.top + "%" }}>
              {active ? <div className="mb-2 w-[142px] rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur"><p className="truncate text-xs font-semibold text-slate-950">{driver.name}</p><p className="mt-0.5 truncate text-[11px] text-slate-500">Truck {driver.truck} · ETA {driver.eta}</p></div> : null}
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: issue ? "#f59e0b" : active ? "#737373" : "#303030" }}><Truck className="h-3.5 w-3.5 text-white" /></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MapTileLayer({ tiles, pan = { x: 0, y: 0 } }) {
  return <><div className="absolute inset-0 bg-[#f5f5f5]" /><div className="absolute inset-0 z-0 overflow-hidden" style={{ transform: "translate(" + pan.x + "px, " + pan.y + "px)" }}>{tiles.map((tile) => { const tileStyle = { left: "50%", top: "50%", transform: "translate(" + tile.left + "px, " + tile.top + "px)", filter: "grayscale(1) saturate(0) contrast(.98) brightness(1.02)", opacity: 1 }; return <img key={tile.key} src={tile.url} alt="" draggable={false} className="absolute h-64 w-64 select-none" style={tileStyle} />; })}</div><div className="absolute inset-0 z-10 bg-white/5 pointer-events-none" /></>;
}

function TimelineMiniMap({ row }) {
  const tileSize = 256;
  const zoom = 15;
  const center = { lat: 47.56946810084396, lng: -122.31879222822118 };
  const worldPixel = (lat, lng, z) => { const sin = Math.sin((lat * Math.PI) / 180); const scale = tileSize * Math.pow(2, z); return { x: ((lng + 180) / 360) * scale, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale }; };
  const centerPixel = worldPixel(center.lat, center.lng, zoom);
  const centerTile = { x: Math.floor(centerPixel.x / tileSize), y: Math.floor(centerPixel.y / tileSize) };
  const centerOffset = { x: centerPixel.x - centerTile.x * tileSize, y: centerPixel.y - centerTile.y * tileSize };
  const tileRange = [-2, -1, 0, 1, 2];
  const tiles = tileRange.flatMap((dx) => tileRange.map((dy) => { const x = centerTile.x + dx; const y = centerTile.y + dy; const subdomain = ["a", "b", "c"][Math.abs(x + y) % 3]; return { key: zoom + "-" + x + "-" + y, left: dx * tileSize - centerOffset.x, top: dy * tileSize - centerOffset.y, url: "https://" + subdomain + ".basemaps.cartocdn.com/light_all/" + zoom + "/" + x + "/" + y + ".png" }; }));
  return <div className="relative h-full overflow-hidden bg-[#f5f5f5]"><MapTileLayer tiles={tiles} /><div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-full text-center"><div className="mb-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-left shadow-lg"><p className="truncate text-xs font-semibold text-slate-950">{row.name}</p><p className="text-[11px] text-slate-500">Truck {row.truck} · {row.current}</p></div><div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-500 shadow-lg"><Truck className="h-3.5 w-3.5 text-white" /></div></div><div className="absolute bottom-3 left-3 z-20 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[10px] font-medium text-slate-500 shadow-sm">© CARTO · © OpenStreetMap</div></div>;
}

function InvoicesScreen({ rows, openDrawer, openGenerate, sendReady, markPaid }) {
  const openRows = rows.filter((row) => row.status !== "Paid");
  const missingDocs = rows.filter((row) => row.issue);
  const paidRows = rows.filter((row) => row.status === "Paid");
  const openTotal = openRows.reduce((sum, row) => sum + moneyNumber(row.amount), 0);
  const columns = [
    { key: "ref", label: "Invoice", render: (row) => React.createElement("div", { className: "font-semibold text-slate-950" }, row.ref, React.createElement("div", { className: "text-xs font-normal text-slate-500" }, row.load)) },
    { key: "customer", label: "Customer" },
    { key: "truck", label: "Truck / Driver" },
    { key: "pickup", label: "Pickup" },
    { key: "delivery", label: "Delivery" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status", render: (row) => React.createElement(StatusBadge, { value: row.status }) },
    { key: "issue", label: "Issue", render: (row) => row.issue || "—" },
  ];
  return React.createElement(ScreenShell, {
    title: "Invoices",
    subtitle: "Expanded billing workspace: documents, invoice status, aging and payment context.",
    actions: React.createElement("div", { className: "flex flex-wrap gap-2" },
      React.createElement(Button, { variant: "outline", onClick: sendReady }, "Send ready"),
      React.createElement(Button, { variant: "outline", onClick: markPaid }, "Mark invoiced paid"),
      React.createElement(Button, { onClick: openGenerate }, React.createElement(Plus, { className: "mr-2 h-4 w-4" }), "Generate invoice")
    )
  },
    React.createElement("div", { className: "grid gap-4 md:grid-cols-4" },
      React.createElement(KpiCard, { label: "Open AR", value: formatMoney(openTotal), hint: openRows.length + " open invoices", icon: FileText, accent: "bg-slate-50" }),
      React.createElement(KpiCard, { label: "Missing docs", value: String(missingDocs.length), hint: "Blocked sends", icon: AlertTriangle, accent: "bg-amber-50" }),
      React.createElement(KpiCard, { label: "Paid", value: String(paidRows.length), hint: "Closed invoices", icon: CheckCircle2, accent: "bg-emerald-50" }),
      React.createElement(KpiCard, { label: "Total", value: String(rows.length), hint: "Invoice records", icon: DollarSign, accent: "bg-purple-50" })
    ),
    React.createElement("div", { className: "grid min-h-0 gap-4 xl:grid-cols-[1fr_360px]" },
      React.createElement(BasicTable, { rows: rows, type: "invoices", openDrawer: openDrawer, searchPlaceholder: "Search invoice, customer, load...", columns: columns }),
      React.createElement("div", { className: "space-y-4" },
        React.createElement(Card, { className: "p-4" },
          React.createElement("p", { className: "text-base font-semibold text-slate-950" }, "Billing summary"),
          React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Open receivables and blocked sends."),
          React.createElement("div", { className: "mt-4 grid gap-3" },
            React.createElement(InfoLine, { label: "Open invoices", value: String(openRows.length), icon: FileText }),
            React.createElement(InfoLine, { label: "Missing documents", value: String(missingDocs.length), icon: AlertTriangle }),
            React.createElement(InfoLine, { label: "Paid invoices", value: String(paidRows.length), icon: CheckCircle2 })
          )
        )
      )
    )
  );
}

function ExpensesScreen({ rows, openDrawer, openCreate, approveReady }) {
  const total = rows.reduce((sum, row) => sum + moneyNumber(row.amount), 0);
  const reviewRows = rows.filter((row) => getExpenseDisplayStatus(row) !== "Approved");
  const approvedRows = rows.filter((row) => getExpenseDisplayStatus(row) === "Approved");
  const receiptIssues = rows.filter((row) => row.receipt === "Missing");
  const assignmentIssues = rows.filter((row) => row.match !== "Assigned" && row.load !== "Overhead");
  const columns = [
    { key: "id", label: "Expense", render: (row) => React.createElement("div", { className: "font-semibold text-slate-950" }, row.id, React.createElement("div", { className: "text-xs font-normal text-slate-500" }, row.type + " · " + row.date)) },
    { key: "amount", label: "Amount" },
    { key: "assigned", label: "Assigned to", render: (row) => React.createElement("div", { className: "text-sm text-slate-700" }, row.truck, React.createElement("div", { className: "text-xs text-slate-500" }, row.driver)) },
    { key: "load", label: "Load" },
    { key: "status", label: "Status", render: (row) => React.createElement(StatusBadge, { value: getExpenseDisplayStatus(row) }) },
    { key: "next", label: "Next step", render: (row) => getExpenseNextStep(row) },
  ];
  return React.createElement(ScreenShell, {
    title: "Expenses",
    subtitle: "Simple accounting view: receipt, assignment, approval and amount.",
    actions: React.createElement("div", { className: "flex flex-wrap gap-2" },
      React.createElement(Button, { variant: "outline", onClick: approveReady }, "Approve ready"),
      React.createElement(Button, { onClick: openCreate }, React.createElement(Plus, { className: "mr-2 h-4 w-4" }), "Add expense")
    )
  },
    React.createElement("div", { className: "grid gap-4 md:grid-cols-4" },
      React.createElement(KpiCard, { label: "Total expenses", value: formatMoney(total), hint: "Current month", icon: Receipt, accent: "bg-slate-50" }),
      React.createElement(KpiCard, { label: "Needs review", value: String(reviewRows.length), hint: "Receipt, assignment or approval", icon: AlertTriangle, accent: "bg-amber-50" }),
      React.createElement(KpiCard, { label: "Approved", value: String(approvedRows.length), hint: "Ready for accounting", icon: CheckCircle2, accent: "bg-emerald-50" }),
      React.createElement(KpiCard, { label: "Open blockers", value: String(receiptIssues.length + assignmentIssues.length), hint: "Receipt or assignment", icon: Route, accent: "bg-purple-50" })
    ),
    React.createElement("div", { className: "grid min-h-0 gap-4 xl:grid-cols-[1fr_360px]" },
      React.createElement(BasicTable, { rows: rows, type: "expenses", openDrawer: openDrawer, searchPlaceholder: "Search expense, truck, driver, load...", columns: columns }),
      React.createElement("div", { className: "space-y-4" },
        React.createElement(Card, { className: "p-4" },
          React.createElement("p", { className: "text-base font-semibold text-slate-950" }, "Expense summary"),
          React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Receipt, assignment and approval queue."),
          React.createElement("div", { className: "mt-4 grid gap-3" },
            React.createElement(InfoLine, { label: "Missing receipts", value: String(receiptIssues.length), icon: Upload }),
            React.createElement(InfoLine, { label: "Assignment needed", value: String(assignmentIssues.length), icon: Route }),
            React.createElement(InfoLine, { label: "Approved", value: String(approvedRows.length), icon: CheckCircle2 })
          )
        )
      )
    )
  );
}

function SalariesScreen({ rows, openDrawer, openGenerate, approveReady }) {
  const openRows = rows.filter((row) => getSalaryDisplayStatus(row) !== "Paid");
  const reviewRows = rows.filter((row) => getSalaryDisplayStatus(row) === "Needs review");
  const readyRows = rows.filter((row) => getSalaryDisplayStatus(row) === "Ready to approve" || getSalaryDisplayStatus(row) === "Ready to pay");
  const paidRows = rows.filter((row) => getSalaryDisplayStatus(row) === "Paid");
  const totalNet = rows.reduce((sum, row) => sum + moneyNumber(row.net), 0);
  const columns = [
    { key: "driver", label: "Driver", render: (row) => React.createElement("div", { className: "font-semibold text-slate-950" }, row.driver, React.createElement("div", { className: "text-xs font-normal text-slate-500" }, row.truck + " · " + row.id)) },
    { key: "period", label: "Period" },
    { key: "loads", label: "Loads" },
    { key: "net", label: "Net pay" },
    { key: "status", label: "Status", render: (row) => React.createElement(StatusBadge, { value: getSalaryDisplayStatus(row) }) },
    { key: "next", label: "Next step", render: (row) => getSalaryNextStep(row) },
  ];
  return React.createElement(ScreenShell, {
    title: "Salaries",
    subtitle: "Simple payroll workspace: create, review, approve and mark paid.",
    actions: React.createElement("div", { className: "flex flex-wrap gap-2" },
      React.createElement(Button, { variant: "outline", onClick: approveReady }, "Approve ready"),
      React.createElement(Button, { onClick: openGenerate }, React.createElement(Plus, { className: "mr-2 h-4 w-4" }), "Create payroll")
    )
  },
    React.createElement("div", { className: "grid gap-4 md:grid-cols-4" },
      React.createElement(KpiCard, { label: "Open payroll", value: String(openRows.length), hint: "Needs action", icon: Clock3, accent: "bg-slate-50" }),
      React.createElement(KpiCard, { label: "Needs review", value: String(reviewRows.length), hint: "Docs or expense blockers", icon: AlertTriangle, accent: "bg-amber-50" }),
      React.createElement(KpiCard, { label: "Ready", value: String(readyRows.length), hint: "Approve or pay", icon: CheckCircle2, accent: "bg-emerald-50" }),
      React.createElement(KpiCard, { label: "Net payroll", value: formatMoney(totalNet), hint: "Current settlements", icon: DollarSign, accent: "bg-purple-50" })
    ),
    React.createElement("div", { className: "grid min-h-0 gap-4 xl:grid-cols-[1fr_360px]" },
      React.createElement(BasicTable, { rows: rows, type: "salaries", openDrawer: openDrawer, searchPlaceholder: "Search driver, truck, settlement...", columns: columns }),
      React.createElement("div", { className: "space-y-4" },
        React.createElement(Card, { className: "p-4" },
          React.createElement("p", { className: "text-base font-semibold text-slate-950" }, "Payroll summary"),
          React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Review blockers, approvals and paid settlements."),
          React.createElement("div", { className: "mt-4 grid gap-3" },
            React.createElement(InfoLine, { label: "Needs review", value: String(reviewRows.length), icon: AlertTriangle }),
            React.createElement(InfoLine, { label: "Ready", value: String(readyRows.length), icon: CheckCircle2 }),
            React.createElement(InfoLine, { label: "Paid", value: String(paidRows.length), icon: DollarSign })
          )
        )
      )
    )
  );
}

function ReportsScreen({ rows, openDrawer, openGenerate }) {
  const generated = rows.filter((row) => row.status === "Generated");
  const drafts = rows.filter((row) => row.status === "Draft");
  return (
    <ScreenShell title="Reports" subtitle="Operational and accounting reports for carrier management." actions={<Button onClick={openGenerate}><Plus className="mr-2 h-4 w-4" />Generate report</Button>}>
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Generated" value={String(generated.length)} hint="Ready to export" icon={CheckCircle2} accent="bg-emerald-50" />
        <KpiCard label="Drafts" value={String(drafts.length)} hint="Need review" icon={Clock3} accent="bg-amber-50" />
        <KpiCard label="Coverage" value="Full" hint="Operations and accounting" icon={Route} accent="bg-slate-50" />
        <KpiCard label="Exports" value="PDF / XLSX" hint="Presentation ready" icon={Download} accent="bg-purple-50" />
      </div>
      
      <BasicTable rows={rows} type="reports" openDrawer={openDrawer} searchPlaceholder="Search report..." filtersFirst={true} columns={[
        { key: "name", label: "Report", render: (row) => <div className="font-semibold text-slate-950">{row.name}<div className="text-xs font-normal text-slate-500">{row.period}</div></div> },
        { key: "period", label: "Period" },
        { key: "metric", label: "Metric" },
        { key: "source", label: "Report scope" },
        { key: "status", label: "Status", render: (row) => <div><StatusBadge value={row.status} /><div className="mt-1 text-xs text-slate-500">{row.status === "Generated" ? "Export ready" : "Needs review"}</div></div> },
      ]} />
    </ScreenShell>
  );
}

function SettingsScreen({ role, setRole, theme, setTheme, save, resetDemoData }) {
  return React.createElement(ScreenShell, {
    title: "Settings",
    subtitle: "Company profile, access, security and interface controls for daily operations.",
    actions: React.createElement("div", { className: "flex flex-wrap gap-2" },
      React.createElement(Button, { variant: "outline", onClick: () => save("Test notification sent.") }, "Test notification"),
      React.createElement(Button, { variant: "outline", onClick: resetDemoData }, "Reset demo data"),
      React.createElement(Button, { onClick: () => save("Settings saved.") }, "Save settings")
    )
  },
    React.createElement("div", { className: "grid gap-4 xl:grid-cols-[1fr_380px]" },
      React.createElement("div", { className: "space-y-4" },
        React.createElement(Card, { className: "p-5" },
          React.createElement("div", { className: "flex items-center justify-between gap-3" },
            React.createElement("div", null,
              React.createElement("p", { className: "font-semibold text-slate-950" }, "Profile"),
              React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Main workspace identity shown across the carrier side.")
            ),
            React.createElement(StatusBadge, { value: "Ready" })
          ),
          React.createElement("div", { className: "mt-4 grid gap-3 md:grid-cols-2" },
            React.createElement(InfoLine, { label: "Name", value: "Dino", icon: UserRound }),
            React.createElement(InfoLine, { label: "Email", value: "dino@hunt.tms", icon: FileText }),
            React.createElement(InfoLine, { label: "Company", value: "Hunt Carrier", icon: Building2 }),
            React.createElement(InfoLine, { label: "Workspace", value: "Carrier operations", icon: Truck })
          ),
        ),
        React.createElement(Card, { className: "p-5" },
          React.createElement("p", { className: "font-semibold text-slate-950" }, "Company setup"),
          React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Carrier-facing information used in documents and accounting screens."),
          React.createElement("div", { className: "mt-4 grid gap-3 md:grid-cols-3" },
            React.createElement(InfoLine, { label: "Legal name", value: "Hunt Carrier LLC", icon: Building2 }),
            React.createElement(InfoLine, { label: "MC / DOT", value: "MC-1048291", icon: ShieldCheck }),
            React.createElement(InfoLine, { label: "Invoice email", value: "billing@hunt.tms", icon: Send })
          )
        ),
        React.createElement(Card, { className: "p-5" },
          React.createElement("p", { className: "font-semibold text-slate-950" }, "Security"),
          React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Access controls for team roles and daily operations."),
          React.createElement("div", { className: "mt-4 grid gap-3 md:grid-cols-3" },
            React.createElement(InfoLine, { label: "Session", value: "Active", icon: ShieldCheck }),
            React.createElement(InfoLine, { label: "Role", value: role, icon: UserRound }),
            React.createElement(InfoLine, { label: "Activity visibility", value: "Enabled", icon: Activity })
          )
        )
      ),
      React.createElement("div", { className: "space-y-4" },
        React.createElement(Card, { className: "p-5" },
          React.createElement("p", { className: "font-semibold text-slate-950" }, "Access and interface"),
          React.createElement("div", { className: "mt-4 space-y-3" },
            React.createElement("label", { className: "block text-sm" },
              React.createElement("span", { className: "text-slate-500" }, "Role"),
              React.createElement("select", { value: role, onChange: (event) => setRole(event.target.value), className: "mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm leading-5" },
                React.createElement("option", null, "Admin"),
                React.createElement("option", null, "Manager"),
                React.createElement("option", null, "Accounting"),
                React.createElement("option", null, "Dispatcher"),
                React.createElement("option", null, "Read-only")
              )
            ),
            React.createElement("button", { onClick: () => setTheme(theme === "dark" ? "light" : "dark"), className: "flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50" },
              React.createElement("span", null,
                React.createElement("span", { className: "block font-medium text-slate-950" }, "Dark theme"),
                React.createElement("span", { className: "text-sm text-slate-500" }, "Switch the platform theme.")
              ),
              React.createElement(StatusBadge, { value: theme === "dark" ? "Enabled" : "Disabled" })
            )
          )
        ),
        React.createElement(Card, { className: "p-5" },
          React.createElement("p", { className: "font-semibold text-slate-950" }, "Notifications"),
          React.createElement("div", { className: "mt-4 grid gap-3" },
            React.createElement(InfoLine, { label: "Driver document alerts", value: "Enabled", icon: Bell }),
            React.createElement(InfoLine, { label: "Invoice aging alerts", value: "Enabled", icon: Clock3 }),
            React.createElement(InfoLine, { label: "Payroll blockers", value: "Enabled", icon: AlertTriangle })
          )
        ),
        React.createElement(Card, { className: "p-5" },
          React.createElement("p", { className: "font-semibold text-slate-950" }, "Workspace modules"),
          React.createElement("div", { className: "mt-4 grid gap-2" },
            React.createElement("div", { className: "rounded-xl bg-slate-50 p-3 text-sm" }, "Fleet, Drivers, Timeline, Loads, Map"),
            React.createElement("div", { className: "rounded-xl bg-slate-50 p-3 text-sm" }, "Invoices, Expenses, Salaries, Reports"),
            React.createElement("div", { className: "rounded-xl bg-slate-50 p-3 text-sm" }, "Fuel Cards, Analytics and Insights are planned for the next phase")
          )
        )
      )
    )
  );
}

function SoonScreen({ title }) {
  return (
    <ScreenShell title={title} subtitle="This area is reserved for a future workspace module.">
      <Card className="flex min-h-[360px] items-center justify-center p-8 text-center">
        <div><Clock3 className="mx-auto h-8 w-8 text-slate-400" /><p className="mt-4 text-lg font-semibold">Planned module</p><p className="mt-1 text-sm text-slate-500">Additional carrier tools will be added here in the next phase.</p></div>
      </Card>
    </ScreenShell>
  );
}

function EntityDrawer({ drawer, closeDrawer, role, truckRecords, loadRecords, updateLoad, updateInvoice, updateExpense, updateSalary, updateReport, updateDriver, updateTruck, updateTimeline, save, confirm }) {
  const { type } = drawer;
  const canEditRecord = canRole(role, "edit");
  const [drawerItem, setDrawerItem] = useState(drawer.item);
  const item = drawerItem;
  const [editMode, setEditMode] = useState(() => drawer.mode === "edit" && canEditRecord);
  const [invoiceDocsResolved, setInvoiceDocsResolved] = useState(!item?.issue);
  const [expenseItem, setExpenseItem] = useState(item);
  const [salaryItem, setSalaryItem] = useState(item);
  const [reviewedLoads, setReviewedLoads] = useState({});
  useEffect(() => {
    setDrawerItem(drawer.item);
    setExpenseItem(drawer.item);
    setSalaryItem(drawer.item);
    setEditMode(drawer.mode === "edit" && canEditRecord);
  }, [drawer.item, drawer.mode, canEditRecord]);
  const title = item?.name || item?.unit || item?.id || item?.ref || item?.driver || "Record";
  const subtitle = type === "salaries" ? "Load pay, adjustments, approval and payment." : type === "expenses" ? "Receipt, assignment and approval." : type === "invoices" ? "Invoice documents, status and payment." : "Operational record overview.";
  return (
    <div className="lh-overlay fixed inset-0 z-[70] flex justify-end bg-slate-950/20" onClick={closeDrawer}>
      <div className="lh-drawer flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 p-6">
          <div><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>
          <div className="flex shrink-0 gap-2">
            {canEditRecord && <Button variant={editMode ? "secondary" : "outline"} onClick={() => setEditMode((value) => !value)}>{editMode ? "Done" : "Edit"}</Button>}
            <Button variant="ghost" onClick={closeDrawer}><X className="h-5 w-5" /></Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="space-y-5">
            {canEditRecord && editMode && <InlineEditPanel type={type} item={item} onCancel={() => setEditMode(false)} onSave={(patch) => {
              const nextItem = { ...item, ...patch };
              setDrawerItem(nextItem);
              if (type === "fleet") updateTruck?.(item.unit || item.id, patch);
              if (type === "drivers") updateDriver?.(item.id || item.name, patch);
              if (type === "loads") updateLoad?.(item.id, patch);
              if (type === "map") updateLoad?.(item.load || item.id, patch);
              if (type === "invoices") updateInvoice?.(item.ref, patch);
              if (type === "expenses") { setExpenseItem(nextItem); updateExpense?.(item.id, patch); }
              if (type === "salaries") { setSalaryItem(nextItem); updateSalary?.(item.id, patch); }
              if (type === "reports") updateReport?.(item.id, patch);
              setEditMode(false);
              save?.("Record updated.");
            }} />}
            {type === "fleet" && <FleetDrawer item={item} updateTruck={updateTruck} save={save} />}
            {type === "drivers" && <DriverDrawer item={item} truckRecords={truckRecords} updateDriver={updateDriver} updateTruck={updateTruck} save={save} />}
            {type === "timeline" && <TimelineDrawer item={item} loads={loadRecords} updateTimeline={updateTimeline} updateLoad={updateLoad} role={role} save={save} />}
            {type === "loads" && <LoadDrawer item={findConnectedLoad(item, loadRecords) || item} loads={loadRecords} updateLoad={updateLoad} updateInvoice={updateInvoice} role={role} save={save} />}
            {type === "map" && <LoadDrawer item={findConnectedLoad(item, loadRecords) || item} loads={loadRecords} updateLoad={updateLoad} updateInvoice={updateInvoice} role={role} save={save} />}
            {type === "invoices" && <InvoiceDrawer item={item} docsResolved={invoiceDocsResolved} setDocsResolved={setInvoiceDocsResolved} updateInvoice={updateInvoice} updateLoad={updateLoad} role={role} save={save} loads={loadRecords} confirm={confirm} />}
            {type === "expenses" && <ExpenseDrawer item={expenseItem} setItem={setExpenseItem} updateExpense={updateExpense} role={role} save={save} loads={loadRecords} confirm={confirm} />}
            {type === "salaries" && <SalaryDrawer item={salaryItem} setItem={setSalaryItem} reviewedLoads={reviewedLoads} setReviewedLoads={setReviewedLoads} updateSalary={updateSalary} updateLoad={updateLoad} role={role} save={save} loads={loadRecords} confirm={confirm} />}
            {type === "reports" && <ReportDrawer item={item} role={role} updateReport={updateReport} save={save} />}
          </div>
        </div>
        <DrawerFooter closeDrawer={closeDrawer} />
      </div>
    </div>
  );
}

function DrawerFooter({ closeDrawer }) {
  return <div className="flex shrink-0 justify-end gap-2 border-t border-slate-200 p-4"><Button variant="outline" onClick={closeDrawer}>Close</Button></div>;
}

function ConfirmDialog({ dialog, onCancel, onConfirm }) {
  const danger = dialog?.tone === "danger";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 rounded-2xl p-2 ${danger ? "bg-red-50" : "bg-amber-50"}`}><AlertTriangle className={`h-5 w-5 ${danger ? "text-red-600" : "text-amber-700"}`} /></div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-slate-950">{dialog?.title || "Confirm action"}</p>
            <p className="mt-1 text-sm text-slate-500">{dialog?.text || "This action needs confirmation."}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>{dialog?.confirmText || "Confirm"}</Button>
        </div>
      </div>
    </div>
  );
}

function InlineEditPanel({ type, item, onSave, onCancel }) {
  const editableFieldsByType = {
    fleet: ["driver", "trailer", "fleet", "status", "next", "vin", "tag", "fixed", "variable"],
    drivers: ["name", "email", "phone", "fleet", "truck", "type", "status", "docs", "safety", "cdl", "medical", "states"],
    loads: ["customer", "origin", "destination", "driver", "truck", "status", "docs", "invoiceStatus", "expenseStatus", "salaryStatus", "rate", "miles", "next"],
    map: ["customer", "origin", "destination", "driver", "truck", "status", "docs", "rate", "miles", "next"],
    invoices: ["customer", "status", "amount", "age", "issue", "pickup", "delivery"],
    expenses: ["type", "amount", "date", "fleet", "truck", "driver", "load", "receipt", "match", "approval", "status", "impact"],
    salaries: ["driver", "truck", "period", "loads", "gross", "deductions", "reimbursements", "net", "status", "warning"],
    reports: ["name", "metric", "period", "status", "source"],
  };
  const fields = editableFieldsByType[type] || [];
  const [form, setForm] = useState(() => fields.reduce((acc, key) => ({ ...acc, [key]: item?.[key] ?? "" }), {}));
  useEffect(() => {
    setForm(fields.reduce((acc, key) => ({ ...acc, [key]: item?.[key] ?? "" }), {}));
  }, [item, type]);
  if (!fields.length) return null;
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="font-semibold text-slate-950">Edit record</p><p className="mt-1 text-sm text-slate-500">Quick MVP edit panel for safe non-primary fields.</p></div>
        <div className="flex gap-2"><Button variant="outline" onClick={onCancel}>Cancel</Button><Button onClick={() => onSave(form)}>Save changes</Button></div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map((field) => <label key={field} className="text-sm"><span className="capitalize text-slate-500">{field.replace(/([A-Z])/g, " $1")}</span><Input value={form[field] ?? ""} onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))} /></label>)}
      </div>
    </Card>
  );
}

function FleetDrawer({ item, updateTruck, save }) {
  const [localItem, setLocalItem] = useState(item);
  useEffect(() => setLocalItem(item), [item]);
  const assigned = localItem.driver && localItem.driver !== "Unassigned" && localItem.driver !== "—";
  const needsReview = localItem.status !== "Available" && localItem.status !== "In Transit";

  const patchTruck = (patch, message) => {
    setLocalItem((prev) => ({ ...prev, ...patch }));
    updateTruck?.(localItem.unit, patch);
    save?.(message);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold tracking-tight text-slate-950">{localItem.unit}</p>
              <StatusBadge value={localItem.status} />
            </div>
            <p className="mt-1 truncate text-sm text-slate-500">{localItem.fleet} · {localItem.trailer}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-500">Cost profile</p>
            <p className="text-lg font-semibold text-slate-950">{localItem.fixed || localItem.cost || "—"}</p>
          </div>
        </div>
        <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-4">
            <p className="text-xs font-medium text-slate-500">Driver</p>
            <p className="mt-2 text-sm font-semibold text-slate-950">{localItem.driver || "Unassigned"}</p>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-slate-500">Assignment</p>
            <div className="mt-2"><StatusBadge value={assigned ? "Active" : "Pending"} /></div>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-slate-500">Next step</p>
            <p className="mt-2 text-sm font-semibold text-slate-950">{localItem.next || "—"}</p>
          </div>
        </div>
      </Card>

      {needsReview ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><AlertTriangle className="mr-2 inline h-4 w-4" />This truck needs review before assignment.</div> : null}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <p className="font-semibold text-slate-950">Truck actions</p>
          <p className="mt-1 text-sm text-slate-500">Keep equipment availability clear for dispatch.</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <LoadActionTile title="Availability" description={localItem.status === "Available" ? "Truck is ready for assignment." : "Move truck back to available when review is complete."} status={localItem.status === "Available" ? "Ready" : localItem.status} action="Mark available" disabled={localItem.status === "Available"} onClick={() => patchTruck({ status: "Available", next: "Ready for assignment" }, "Truck marked available.")} />
          <LoadActionTile title="Maintenance" description="Temporarily remove truck from dispatch rotation." status={localItem.status === "Out of Service" ? "Out of Service" : "Ready"} action="Out of service" disabled={localItem.status === "Out of Service"} onClick={() => patchTruck({ status: "Out of Service", next: "Maintenance review" }, "Truck moved to out of service.")} />
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-slate-950">Truck details</p>
        <div className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <DetailLine label="VIN" value={localItem.vin || "—"} />
          <DetailLine label="TAG" value={localItem.tag || "—"} />
          <DetailLine label="Fleet" value={localItem.fleet || "—"} />
          <DetailLine label="Trailer" value={localItem.trailer || "—"} />
          <DetailLine label="Fixed cost" value={localItem.fixed || "—"} />
          <DetailLine label="Variable cost" value={localItem.variable || "—"} />
        </div>
      </Card>
    </>
  );
}

function DriverDrawer({ item, truckRecords, updateDriver, updateTruck, save }) {
  const available = truckRecords.filter((truck) => truck.driver === "Unassigned" || truck.unit === item.truck);
  const [truck, setTruck] = useState(item.truck || available[0]?.unit || "Unassigned");
  const [driverDocState, setDriverDocState] = useState({ docs: item.docs, cdl: item.cdl, medical: item.medical, safety: item.safety, app: item.app, payroll: item.payroll });
  useEffect(() => {
    setTruck(item.truck || "Unassigned");
    setDriverDocState({ docs: item.docs, cdl: item.cdl, medical: item.medical, safety: item.safety, app: item.app, payroll: item.payroll });
  }, [item]);
  const assigned = truck && truck !== "Unassigned";
  const docsReady = driverDocState.docs === "Valid";

  const saveAssignment = () => {
    const patch = { truck, app: assigned ? "Enabled" : driverDocState.app, payroll: assigned ? "Enabled" : driverDocState.payroll };
    setDriverDocState((prev) => ({ ...prev, app: patch.app, payroll: patch.payroll }));
    updateDriver(item.id, patch);
    if (assigned) updateTruck(truck, { driver: item.name, status: "In Transit", next: "Assigned to active driver" });
    save(item.name + " assigned to " + truck + ".");
  };

  const uploadCdl = () => {
    const patch = { cdl: "Uploaded", docs: driverDocState.medical === "Missing" ? "Missing" : "Valid", safety: "Clear" };
    setDriverDocState((prev) => ({ ...prev, ...patch }));
    updateDriver(item.id, patch);
    save("CDL uploaded.");
  };

  const uploadMedical = () => {
    const patch = { medical: "Uploaded", docs: driverDocState.cdl === "Missing" ? "Missing" : "Valid", safety: "Clear" };
    setDriverDocState((prev) => ({ ...prev, ...patch }));
    updateDriver(item.id, patch);
    save("Medical card uploaded.");
  };

  const requestDocs = () => {
    const patch = { docs: "Pending", safety: "Waiting" };
    setDriverDocState((prev) => ({ ...prev, ...patch }));
    updateDriver(item.id, patch);
    save("Document request sent.");
  };

  const docRows = [
    { label: "CDL", value: driverDocState.cdl, action: uploadCdl, actionLabel: "Upload CDL", blocked: driverDocState.cdl === "Missing" },
    { label: "Medical card", value: driverDocState.medical, action: uploadMedical, actionLabel: "Upload medical", blocked: driverDocState.medical === "Missing" },
    { label: "Safety", value: driverDocState.safety, action: requestDocs, actionLabel: "Request docs", blocked: driverDocState.safety !== "Clear" },
  ];

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold tracking-tight text-slate-950">{item.name}</p>
              <StatusBadge value={item.status} />
            </div>
            <p className="mt-1 truncate text-sm text-slate-500">{item.type} · {item.fleet}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-500">Truck</p>
            <p className="text-lg font-semibold text-slate-950">{truck}</p>
          </div>
        </div>
        <div className="grid divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <div className="p-4"><p className="text-xs font-medium text-slate-500">Documents</p><div className="mt-2"><StatusBadge value={docsReady ? "Valid" : "Needs review"} /></div></div>
          <div className="p-4"><p className="text-xs font-medium text-slate-500">Mobile</p><div className="mt-2"><StatusBadge value={driverDocState.app} /></div></div>
          <div className="p-4"><p className="text-xs font-medium text-slate-500">Payroll</p><div className="mt-2"><StatusBadge value={driverDocState.payroll} /></div></div>
          <div className="p-4"><p className="text-xs font-medium text-slate-500">Safety</p><p className="mt-2 text-sm font-semibold text-slate-950">{driverDocState.safety}</p></div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-950">Truck assignment</p>
            <p className="mt-1 text-sm text-slate-500">Connect this driver to the truck used by routes, documents and payroll.</p>
          </div>
          <StatusBadge value={assigned ? "Active" : "Pending"} />
        </div>
        <div className="mt-4 flex gap-2">
          <select value={truck} onChange={(event) => setTruck(event.target.value)} className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 text-sm leading-5">
            <option>Unassigned</option>
            {available.map((row) => <option key={row.unit}>{row.unit}</option>)}
          </select>
          <Button onClick={saveAssignment}>Save</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <p className="font-semibold text-slate-950">Driver documents</p>
            <p className="mt-1 text-sm text-slate-500">Keep compliance files ready for dispatch and payroll.</p>
          </div>
          <Button variant="outline" onClick={requestDocs}>Request documents</Button>
        </div>
        <div className="divide-y divide-slate-100">
          {docRows.map((doc) => <div key={doc.label} className="flex items-center justify-between gap-3 px-4 py-3 text-sm"><div className="min-w-0"><p className="font-medium text-slate-950">{doc.label}</p><p className="mt-1 text-xs text-slate-500">{doc.value}</p></div><div className="flex shrink-0 items-center gap-2"><StatusBadge value={doc.blocked ? "Needs review" : "Uploaded"} />{doc.blocked ? <Button variant="outline" className="py-1.5" onClick={doc.action}>{doc.actionLabel}</Button> : null}</div></div>)}
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-slate-950">Driver details</p>
        <div className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <DetailLine label="Driver ID" value={item.id || "—"} />
          <DetailLine label="Email" value={item.email || "—"} />
          <DetailLine label="Phone" value={item.phone || "—"} />
          <DetailLine label="Blacklisted states" value={item.states || "None"} />
        </div>
      </Card>
    </>
  );
}

function TimelineDrawer({ item, loads, updateTimeline, updateLoad, role, save }) {
  const connected = findConnectedLoad(item, loads);
  const activeBar = item.activeBar || item.bars?.[0];
  const driverMapRow = connected ? buildMapRows([connected])[0] : null;
  const markDelivered = () => {
    updateTimeline(item.id, { status: "Delivered", note: "Delivered. POD expected." });
    if (connected) updateLoad(connected.id, { status: "Delivered", next: "Upload POD before invoice send", invoiceStatus: "In Review" });
    save("Trip marked delivered.");
  };
  const rescheduleTrip = () => {
    updateTimeline(item.id, { note: "Rescheduled. Dispatcher review." });
    if (connected) updateLoad(connected.id, { next: "Appointment rescheduled / confirm with broker" });
    save("Trip rescheduled.");
  };
  const addTripNote = () => {
    updateTimeline(item.id, { note: "Dispatcher note added." });
    save("Timeline note added.");
  };
  return (
    <>
      <ConnectedLoadCard item={item} rows={loads} />
      <div className="grid gap-3 sm:grid-cols-4">
        <InfoLine label="Truck" value={item.truck} icon={Truck} />
        <InfoLine label="Driver" value={item.driver} icon={UserRound} />
        <InfoLine label="Status" value={item.status} icon={Activity} />
        <InfoLine label="Note" value={item.note || "—"} icon={FileText} />
      </div>
      {driverMapRow ? <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <p className="font-semibold text-slate-950">Driver location</p>
            <p className="mt-1 text-sm text-slate-500">Current position for this timeline trip.</p>
          </div>
          <StatusBadge value={driverMapRow.signal} />
        </div>
        <div className="h-[220px]"><TimelineMiniMap row={driverMapRow} /></div>
      </Card> : null}
      {activeBar ? (
        <Card className="p-4">
          <p className="font-semibold text-slate-950">Trip window</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <InfoLine label="Origin" value={activeBar.from} icon={MapPin} />
            <InfoLine label="Destination" value={activeBar.to} icon={Navigation} />
            <InfoLine label="Appointment" value={`${activeBar.startLabel} → ${activeBar.endLabel}`} icon={Clock3} />
          </div>
        </Card>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={!canRole(role, "edit")} onClick={rescheduleTrip}>Reschedule</Button>
        <Button variant="outline" disabled={!canRole(role, "edit")} onClick={addTripNote}>Add note</Button>
        <Button disabled={!canRole(role, "edit")} onClick={markDelivered}>Mark delivered</Button>
      </div>
    </>
  );
}

function LoadDrawer({ item, loads, updateLoad, updateInvoice, role, save }) {
  const initialLoad = findConnectedLoad(item, loads) || item;
  const [localLoad, setLocalLoad] = useState(initialLoad);
  useEffect(() => setLocalLoad(initialLoad), [item, loads]);
  const load = localLoad;
  const docRows = load.documents || [];
  const hasPod = load.docs === "Ready" || docRows.some((doc) => String(doc).toLowerCase() === "pod");
  const needsDocs = load.docs !== "Ready";
  const needsExpenseMatch = load.expenseStatus === "Needs assignment" || load.expenseStatus === "Needs receipt";
  const canSendInvoice = load.invoiceStatus === "Ready" || load.invoiceStatus === "Draft";
  const canMarkPaid = load.invoiceStatus === "Invoiced";
  const blocked = needsDocs || needsExpenseMatch || load.salaryStatus === "Review";

  const patchLoad = (patch, message) => {
    const next = { ...load, ...patch };
    setLocalLoad(next);
    updateLoad?.(load.id, patch);
    if (message) save?.(message);
  };

  const normalizedDocs = (extra = []) => {
    const base = docRows.filter((doc) => !String(doc).toLowerCase().includes("pod missing") && !String(doc).toLowerCase().includes("invoice pdf draft"));
    return Array.from(new Set([...base, ...extra]));
  };

  const uploadPod = () => {
    const docs = normalizedDocs(["POD", "Invoice PDF"]);
    const nextInvoiceStatus = load.invoiceStatus === "Invoiced" || load.invoiceStatus === "Paid" ? load.invoiceStatus : "Ready";
    patchLoad({ docs: "Ready", documents: docs, invoiceStatus: nextInvoiceStatus, status: "Delivered", next: "Documents ready / invoice can be sent" }, "POD uploaded. Load documents are ready.");
    if (load.invoice) updateInvoice?.(load.invoice, { issue: null, status: nextInvoiceStatus });
  };

  const markDocsReady = () => {
    const docs = normalizedDocs(["Rate Confirmation", "BOL", "POD", "Invoice PDF"]);
    const nextInvoiceStatus = load.invoiceStatus === "Invoiced" || load.invoiceStatus === "Paid" ? load.invoiceStatus : "Ready";
    patchLoad({ docs: "Ready", documents: docs, invoiceStatus: nextInvoiceStatus, status: "Delivered", next: needsExpenseMatch ? "Resolve expense" : "Invoice ready to send" }, "Load documents marked ready.");
    if (load.invoice) updateInvoice?.(load.invoice, { issue: null, status: nextInvoiceStatus });
  };

  const requestDocs = () => patchLoad({ next: "Document request sent to driver" }, "Document request sent to driver.");
  const confirmExpenseMatch = () => patchLoad({ expenseStatus: "Ready", salaryStatus: load.salaryStatus, next: "Expense ready to approve" }, "Expense assigned. Approval is still required.");

  const prepareInvoice = () => {
    if (load.docs !== "Ready") {
      save?.("Upload POD before preparing invoice.");
      return;
    }
    patchLoad({ invoiceStatus: "Ready", next: "Invoice ready to send" }, "Invoice prepared.");
    if (load.invoice) updateInvoice?.(load.invoice, { issue: null, status: "Ready" });
  };

  const sendInvoice = () => {
    patchLoad({ invoiceStatus: "Invoiced", next: "Invoice sent / waiting for payment" }, "Invoice sent.");
    if (load.invoice) updateInvoice?.(load.invoice, { issue: null, status: "Invoiced" });
  };

  const markInvoicePaid = () => {
    patchLoad({ invoiceStatus: "Paid", next: "Invoice paid / ready for reports" }, "Invoice marked paid.");
    if (load.invoice) updateInvoice?.(load.invoice, { status: "Paid", age: "Paid", issue: null });
  };

  const markPayrollReady = () => {
    if (load.docs !== "Ready" || needsExpenseMatch || (load.expense && load.expense !== "—" && load.expenseStatus !== "Approved")) {
      save?.("Resolve documents and approve expenses before payroll.");
      return;
    }
    patchLoad({ salaryStatus: "Ready", next: "Payroll ready to approve" }, "Payroll marked ready for this load.");
  };

  const statusItems = [
    { label: "Documents", value: load.docs === "Ready" ? "Ready" : "Needs review", action: load.docs === "Ready" ? "Done" : "Upload POD" },
    { label: "Expenses", value: needsExpenseMatch ? "Needs review" : load.expenseStatus, action: needsExpenseMatch ? "Resolve" : "Done" },
    { label: "Invoice", value: load.invoiceStatus, action: load.invoiceStatus === "Ready" ? "Send" : load.invoiceStatus === "Invoiced" ? "Mark paid" : "Prepare" },
    { label: "Payroll", value: load.salaryStatus === "Review" ? "Needs review" : load.salaryStatus, action: load.salaryStatus === "Ready" ? "Ready" : "Review" },
  ];

  return (
    <>
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold tracking-tight text-slate-950">{load.id}</p>
                <StatusBadge value={blocked ? "Needs review" : "Ready"} />
              </div>
              <p className="mt-1 truncate text-sm text-slate-500">{load.origin} → {load.destination}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-slate-500">Rate</p>
              <p className="text-lg font-semibold text-slate-950">{load.rate}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-0 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {statusItems.map((row) => <div key={row.label} className="p-4"><p className="text-xs font-medium text-slate-500">{row.label}</p><div className="mt-2"><StatusBadge value={row.value} /></div><p className="mt-2 text-xs text-slate-500">{row.action}</p></div>)}
        </div>
      </Card>

      {blocked ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><AlertTriangle className="mr-2 inline h-4 w-4" />{load.next || "Resolve open blockers before closing this load."}</div> : null}

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <p className="font-semibold text-slate-950">Documents</p>
            <p className="mt-1 text-sm text-slate-500">Files required for invoice and payroll.</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" disabled={hasPod || !canRole(role, "upload")} onClick={uploadPod}><Upload className="mr-2 h-4 w-4" />Upload POD</Button>
            <Button variant="outline" disabled={!canRole(role, "upload")} onClick={markDocsReady}>Mark ready</Button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {docRows.length ? docRows.map((doc) => {
            const missing = String(doc).toLowerCase().includes("missing");
            return <div key={doc} className="flex items-center justify-between gap-3 px-4 py-3 text-sm"><span className="flex min-w-0 items-center gap-2 truncate text-slate-700"><FileText className="h-4 w-4 shrink-0 text-slate-400" />{doc}</span><StatusBadge value={missing ? "Needs review" : "Uploaded"} /></div>;
          }) : <div className="px-4 py-5 text-sm text-slate-500">No documents attached yet.</div>}
        </div>
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3"><Button variant="ghost" disabled={!canRole(role, "edit")} onClick={requestDocs}>Request documents from driver</Button></div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <p className="font-semibold text-slate-950">Resolve load</p>
          <p className="mt-1 text-sm text-slate-500">Main actions without leaving this drawer.</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <LoadActionTile title="Expense" description={needsExpenseMatch ? "Receipt or assignment needs review." : "Expense is resolved."} status={needsExpenseMatch ? "Needs review" : "Ready"} action="Resolve expense" disabled={!needsExpenseMatch || !canRole(role, "edit")} onClick={confirmExpenseMatch} />
          <LoadActionTile title="Invoice" description={load.invoice + " · " + load.invoiceStatus} status={load.invoiceStatus} action={canSendInvoice ? "Send invoice" : canMarkPaid ? "Mark paid" : "Prepare invoice"} disabled={!(canSendInvoice || canMarkPaid || load.docs === "Ready") || !(canRole(role, "send") || canRole(role, "pay"))} onClick={canSendInvoice ? sendInvoice : canMarkPaid ? markInvoicePaid : prepareInvoice} />
          <LoadActionTile title="Payroll" description={load.salary + " · " + load.salaryStatus} status={load.salaryStatus === "Review" ? "Needs review" : load.salaryStatus} action="Mark ready" disabled={!canRole(role, "approve")} onClick={markPayrollReady} />
          <LoadActionTile title="Route details" description={load.pickup + " → " + load.delivery} status={load.status === "Docs Missing" ? "Needs review" : load.status} action="View only" disabled={true} onClick={() => {}} />
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-slate-950">Load details</p>
        <div className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <DetailLine label="Driver" value={load.driver} />
          <DetailLine label="Truck" value={load.truck} />
          <DetailLine label="Customer" value={load.customer} />
          <DetailLine label="Miles" value={load.miles} />
          <DetailLine label="Pickup" value={load.pickup} />
          <DetailLine label="Delivery" value={load.delivery} />
        </div>
      </Card>
    </>
  );
}

function LoadActionTile({ title, description, status, action, disabled, onClick }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-semibold text-slate-950">{title}</p><p className="mt-1 line-clamp-2 text-sm text-slate-500">{description}</p></div><StatusBadge value={status} /></div><Button variant="outline" disabled={disabled} onClick={onClick} className="mt-4 w-full">{action}</Button></div>;
}

function DetailLine({ label, value }) {
  return <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2"><span className="text-slate-500">{label}</span><span className="truncate font-medium text-slate-950">{value}</span></div>;
}

function InvoiceDrawer({ item, docsResolved, setDocsResolved, updateInvoice, updateLoad, role, save, loads, confirm }) {
  const [status, setStatus] = useState(item.status);
  const [issue, setIssue] = useState(item.issue || null);
  useEffect(() => {
    setStatus(item.status);
    setIssue(item.issue || null);
    setDocsResolved?.(!item?.issue);
  }, [item]);
  const loadIds = Array.isArray(item.loadIds) && item.loadIds.length ? item.loadIds : item.load ? [item.load] : [];
  const linkedLoads = loads.filter((row) => loadIds.includes(row.id));
  const loadCount = linkedLoads.length || 1;
  const singleLoad = linkedLoads[0] || findConnectedLoad(item, loads);
  const missingDocCount = linkedLoads.length ? linkedLoads.filter((row) => row.docs !== "Ready").length : docsResolved ? 0 : 1;
  const docs = docsResolved
    ? (loadCount > 1 ? ["Rate Confirmation package", "BOL package", "POD package", "Invoice PDF"] : ["Rate Confirmation", "BOL", "POD", "Invoice PDF"])
    : loadCount > 1
      ? ["Rate Confirmation package", "BOL package", `${missingDocCount || "Some"} POD missing`, "Invoice PDF draft"]
      : (singleLoad?.documents || ["Rate Confirmation", "BOL", "POD missing", "Invoice PDF draft"]);
  const missingDocs = docs.some((doc) => String(doc).toLowerCase().includes("missing") || String(doc).toLowerCase().includes("draft"));
  const paid = status === "Paid";
  const blocked = !docsResolved || Boolean(issue);
  const canSend = docsResolved && canRole(role, "send") && !paid;
  const canPay = status === "Invoiced" && canRole(role, "pay");

  const updateLinkedLoads = (patchFactory) => {
    if (linkedLoads.length) {
      linkedLoads.forEach((row) => updateLoad(row.id, typeof patchFactory === "function" ? patchFactory(row) : patchFactory));
      return;
    }
    if (item.load) updateLoad(item.load, typeof patchFactory === "function" ? patchFactory(singleLoad || {}) : patchFactory);
  };

  const uploadPod = () => {
    setDocsResolved(true);
    setIssue(null);
    const nextStatus = "Ready";
    setStatus(nextStatus);
    updateInvoice(item.ref, { issue: null, status: nextStatus });
    updateLinkedLoads({ docs: "Ready", invoiceStatus: nextStatus, next: "Invoice ready to send", documents: ["Rate Confirmation", "BOL", "POD", "Invoice PDF"] });
    save("POD package uploaded. Invoice is ready to send for " + loadCount + " load" + (loadCount === 1 ? "" : "s") + ".");
  };

  const sendInvoice = () => {
    setStatus("Invoiced");
    setIssue(null);
    updateInvoice(item.ref, { status: "Invoiced", issue: null });
    updateLinkedLoads({ invoiceStatus: "Invoiced", next: "Invoice sent / waiting for payment" });
    save("Invoice sent for " + loadCount + " load" + (loadCount === 1 ? "" : "s") + ".");
  };

  const markPaid = () => {
    const run = () => {
      setStatus("Paid");
      setIssue(null);
      updateInvoice(item.ref, { status: "Paid", age: "Paid", issue: null });
      updateLinkedLoads({ invoiceStatus: "Paid", next: "Invoice paid / ready for reports" });
      save("Invoice marked paid for " + loadCount + " load" + (loadCount === 1 ? "" : "s") + ".");
    };
    confirm ? confirm({ title: "Mark invoice paid?", text: item.ref + " will be closed as Paid.", confirmText: "Mark paid", tone: "danger", onConfirm: run }) : run();
  };

  const statusItems = [
    { label: "Documents", value: docsResolved ? "Ready" : "Needs review", hint: docsResolved ? "Ready to bill" : loadCount > 1 ? missingDocCount + " load" + (missingDocCount === 1 ? "" : "s") + " need POD" : "POD required" },
    { label: "Invoice", value: status, hint: status === "Ready" ? "Can be sent" : status === "Invoiced" ? "Waiting payment" : paid ? "Closed" : "In progress" },
    { label: "Payment", value: paid ? "Paid" : status === "Invoiced" ? "Ready to pay" : "Pending", hint: paid ? "Closed" : item.age || "—" },
  ];

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold tracking-tight text-slate-950">{item.ref}</p>
              <StatusBadge value={blocked ? "Needs review" : status} />
            </div>
            <p className="mt-1 truncate text-sm text-slate-500">{item.customer} · {loadCount > 1 ? loadCount + " linked loads" : "Load " + item.load}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-500">Amount</p>
            <p className="text-lg font-semibold text-slate-950">{item.amount}</p>
          </div>
        </div>
        <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {statusItems.map((row) => <div key={row.label} className="p-4"><p className="text-xs font-medium text-slate-500">{row.label}</p><div className="mt-2"><StatusBadge value={row.value} /></div><p className="mt-2 text-xs text-slate-500">{row.hint}</p></div>)}
        </div>
      </Card>

      {blocked ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><AlertTriangle className="mr-2 inline h-4 w-4" />POD is required before this invoice can be sent.</div> : null}
      {!blocked && !paid ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Documents are ready. Invoice can be sent or tracked for payment.</div> : null}

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <p className="font-semibold text-slate-950">Documents</p>
            <p className="mt-1 text-sm text-slate-500">Required files for billing across selected loads.</p>
          </div>
          <Button variant="outline" disabled={docsResolved || !canRole(role, "upload")} onClick={uploadPod}><Upload className="mr-2 h-4 w-4" />Upload POD</Button>
        </div>
        <div className="divide-y divide-slate-100">
          {docs.map((doc) => {
            const missing = String(doc).toLowerCase().includes("missing") || String(doc).toLowerCase().includes("draft");
            return <div key={doc} className="flex items-center justify-between gap-3 px-4 py-3 text-sm"><span className="flex min-w-0 items-center gap-2 truncate text-slate-700"><FileText className="h-4 w-4 shrink-0 text-slate-400" />{doc}</span><StatusBadge value={missing ? "Needs review" : "Uploaded"} /></div>;
          })}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <p className="font-semibold text-slate-950">Invoice actions</p>
          <p className="mt-1 text-sm text-slate-500">Send invoice and close payment without leaving the drawer.</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <LoadActionTile title="Send invoice" description={blocked ? "Resolve missing POD before sending." : "Ready to email invoice packet."} status={blocked ? "Needs review" : status} action="Send invoice" disabled={!canSend} onClick={sendInvoice} />
          <LoadActionTile title="Payment" description={status === "Invoiced" ? "Invoice was sent and can be marked paid." : paid ? "Payment closed." : "Waiting until invoice is sent."} status={paid ? "Paid" : status === "Invoiced" ? "Ready to pay" : "Pending"} action="Mark paid" disabled={!canPay} onClick={markPaid} />
        </div>
      </Card>

      <ConnectedLoadCard item={item} rows={loads} />
    </>
  );
}

function ExpenseDrawer({ item, setItem, updateExpense, role, save, loads, confirm }) {
  const [localItem, setLocalItem] = useState(item);
  useEffect(() => setLocalItem(item), [item]);
  const expense = localItem;
  const linkedLoad = findConnectedLoad(expense, loads);
  const displayStatus = getExpenseDisplayStatus(expense);
  const needsReceipt = displayStatus === "Needs receipt";
  const needsAssignment = displayStatus === "Needs assignment";
  const readyToApprove = displayStatus === "Ready to approve";
  const approved = displayStatus === "Approved";

  const patchExpense = (patch, message) => {
    const next = { ...expense, ...patch };
    setLocalItem(next);
    setItem?.(next);
    updateExpense?.(expense.id, patch);
    if (message) save?.(message);
  };

  const uploadReceipt = () => patchExpense({ receipt: "Uploaded", status: expense.match === "Assigned" ? "Ready" : "Review", impact: expense.match === "Assigned" ? "Pending approval" : "Pending assignment" }, "Receipt uploaded.");
  const assignToLoad = () => {
    const targetLoad = linkedLoad?.id || loads[0]?.id || "#9157553";
    patchExpense({ load: targetLoad, match: "Assigned", status: expense.receipt === "Uploaded" ? "Ready" : "Review", impact: expense.receipt === "Uploaded" ? "Pending approval" : "Pending receipt" }, "Expense assigned to load " + targetLoad + ".");
  };
  const approveExpense = () => {
    if (needsReceipt || needsAssignment) {
      save?.("Receipt and assignment are required before approval.");
      return;
    }
    patchExpense({ approval: "Approved", status: "Approved", impact: expense.load === "Overhead" ? "Approved overhead" : "Included in accounting" }, "Expense approved.");
  };
  const excludeExpense = () => {
    const run = () => patchExpense({ approval: "Excluded", status: "Excluded", impact: "Excluded from reports" }, "Expense excluded from accounting.");
    confirm ? confirm({ title: "Exclude expense?", text: expense.id + " will be excluded from accounting reports.", confirmText: "Exclude", tone: "danger", onConfirm: run }) : run();
  };

  const statusItems = [
    { label: "Receipt", value: expense.receipt === "Uploaded" ? "Uploaded" : "Needs receipt", hint: expense.receipt === "Uploaded" ? "Ready" : "Required" },
    { label: "Assignment", value: expense.match === "Assigned" ? "Assigned" : "Needs assignment", hint: expense.load || "Unassigned" },
    { label: "Approval", value: displayStatus, hint: getExpenseNextStep(expense) },
  ];

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold tracking-tight text-slate-950">{expense.id}</p>
              <StatusBadge value={displayStatus} />
            </div>
            <p className="mt-1 truncate text-sm text-slate-500">{expense.type} · {expense.date}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-500">Amount</p>
            <p className="text-lg font-semibold text-slate-950">{expense.amount}</p>
          </div>
        </div>
        <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {statusItems.map((row) => <div key={row.label} className="p-4"><p className="text-xs font-medium text-slate-500">{row.label}</p><div className="mt-2"><StatusBadge value={row.value} /></div><p className="mt-2 text-xs text-slate-500">{row.hint}</p></div>)}
        </div>
      </Card>

      {!approved && (needsReceipt || needsAssignment) ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><AlertTriangle className="mr-2 inline h-4 w-4" />Resolve receipt and assignment before approving this expense.</div> : null}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <p className="font-semibold text-slate-950">Expense actions</p>
          <p className="mt-1 text-sm text-slate-500">Move this expense through receipt, assignment and approval.</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          <LoadActionTile title="Receipt" description={expense.receipt === "Uploaded" ? "Receipt is attached." : "Upload or attach a receipt."} status={expense.receipt === "Uploaded" ? "Uploaded" : "Needs receipt"} action="Upload receipt" disabled={!needsReceipt || !canRole(role, "upload")} onClick={uploadReceipt} />
          <LoadActionTile title="Assignment" description={expense.load === "Overhead" ? "Expense is fleet overhead." : expense.load || "Assign to load, truck or driver."} status={expense.match === "Assigned" || expense.load === "Overhead" ? "Assigned" : "Needs assignment"} action="Assign expense" disabled={!needsAssignment || !canRole(role, "edit")} onClick={assignToLoad} />
          <LoadActionTile title="Approval" description={readyToApprove ? "Expense is ready for accounting." : approved ? "Expense has been approved." : "Complete blockers first."} status={displayStatus} action="Approve" disabled={!readyToApprove || !canRole(role, "approve")} onClick={approveExpense} />
          <LoadActionTile title="Accounting impact" description={expense.impact || "Pending"} status={approved ? "Approved" : "Pending"} action="Exclude" disabled={approved || !canRole(role, "approve")} onClick={excludeExpense} />
        </div>
      </Card>

      <ConnectedLoadCard item={expense} rows={loads} />

      <Card className="p-4">
        <p className="font-semibold text-slate-950">Expense details</p>
        <div className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <DetailLine label="Fleet" value={expense.fleet || "—"} />
          <DetailLine label="Truck" value={expense.truck || "—"} />
          <DetailLine label="Driver" value={expense.driver || "—"} />
          <DetailLine label="Load" value={expense.load || "—"} />
        </div>
      </Card>
    </>
  );
}

function SalaryDrawer({ item, setItem, reviewedLoads, setReviewedLoads, updateSalary, updateLoad, role, save, loads, confirm }) {
  const [localItem, setLocalItem] = useState(item);
  useEffect(() => setLocalItem(item), [item]);
  const salary = localItem;
  const linkedLoads = loads.filter((load) => load.salary === salary.id || load.driver === salary.driver);
  const displayStatus = getSalaryDisplayStatus(salary);
  const needsReview = displayStatus === "Needs review";
  const readyToApprove = displayStatus === "Ready to approve";
  const readyToPay = displayStatus === "Ready to pay";
  const paid = displayStatus === "Paid";
  const blockers = linkedLoads.filter((load) => load.docs !== "Ready" || load.expenseStatus === "Needs assignment" || load.expenseStatus === "Needs receipt" || (load.expense && load.expense !== "—" && load.expenseStatus !== "Approved"));

  const patchSalary = (patch, message) => {
    const next = { ...salary, ...patch };
    setLocalItem(next);
    setItem?.(next);
    updateSalary?.(salary.id, patch);
    if (message) save?.(message);
  };

  const markLoadReviewed = (load) => {
    setReviewedLoads((prev) => ({ ...prev, [load.id]: true }));
    if (load.docs !== "Ready") updateLoad?.(load.id, { docs: "Ready", invoiceStatus: load.invoiceStatus === "In Review" ? "Ready" : load.invoiceStatus, next: "Documents ready" });
    save?.("Load " + load.id + " reviewed for payroll.");
  };

  const approveSettlement = () => {
    if (needsReview || blockers.length) {
      save?.("Resolve load blockers before payroll approval.");
      return;
    }
    patchSalary({ status: "Approved", warning: "Approved" }, "Payroll approved.");
    linkedLoads.forEach((load) => updateLoad?.(load.id, { salaryStatus: "Approved", next: "Payroll approved / ready to pay" }));
  };

  const markPaid = () => {
    if (!readyToPay) {
      save?.("Settlement must be approved before payment.");
      return;
    }
    const run = () => {
      patchSalary({ status: "Paid", warning: "Paid today" }, "Payroll marked paid.");
      linkedLoads.forEach((load) => updateLoad?.(load.id, { salaryStatus: "Paid", next: "Payroll paid" }));
    };
    confirm ? confirm({ title: "Mark payroll paid?", text: salary.id + " for " + salary.driver + " will be closed as Paid.", confirmText: "Mark paid", tone: "danger", onConfirm: run }) : run();
  };

  const reopenSettlement = () => {
    const run = () => patchSalary({ status: "Review", warning: "Reopened for correction" }, "Payroll reopened for review.");
    confirm ? confirm({ title: "Reopen paid payroll?", text: salary.id + " will be moved back to Review for correction.", confirmText: "Reopen", tone: "danger", onConfirm: run }) : run();
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold tracking-tight text-slate-950">{salary.id}</p>
              <StatusBadge value={displayStatus} />
            </div>
            <p className="mt-1 truncate text-sm text-slate-500">{salary.driver} · {salary.period}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-500">Net pay</p>
            <p className="text-lg font-semibold text-slate-950">{salary.net}</p>
          </div>
        </div>
        <div className="grid divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <div className="p-4"><p className="text-xs font-medium text-slate-500">Gross</p><p className="mt-2 text-sm font-semibold text-slate-950">{salary.gross}</p></div>
          <div className="p-4"><p className="text-xs font-medium text-slate-500">Deductions</p><p className="mt-2 text-sm font-semibold text-slate-950">{salary.deductions}</p></div>
          <div className="p-4"><p className="text-xs font-medium text-slate-500">Reimbursements</p><p className="mt-2 text-sm font-semibold text-slate-950">{salary.reimbursements}</p></div>
          <div className="p-4"><p className="text-xs font-medium text-slate-500">Status</p><div className="mt-2"><StatusBadge value={displayStatus} /></div></div>
        </div>
      </Card>

      {needsReview || blockers.length ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><AlertTriangle className="mr-2 inline h-4 w-4" />{salary.warning || "Resolve linked load blockers before approval."}</div> : null}

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <p className="font-semibold text-slate-950">Load review</p>
          <p className="mt-1 text-sm text-slate-500">Payroll can be approved only after documents and expenses are resolved.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {(linkedLoads.length ? linkedLoads : [findConnectedLoad(salary, loads)].filter(Boolean)).map((load) => {
            const blocked = load.docs !== "Ready" || load.expenseStatus === "Needs assignment" || load.expenseStatus === "Needs receipt" || (load.expense && load.expense !== "—" && load.expenseStatus !== "Approved");
            const reviewed = reviewedLoads[load.id] || !blocked;
            return <div key={load.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm"><div className="min-w-0"><p className="font-medium text-slate-950">{load.id} · {load.trip}</p><p className="mt-1 text-xs text-slate-500">Docs: {load.docs} · Expense: {load.expenseStatus}</p></div><div className="flex shrink-0 items-center gap-2"><StatusBadge value={reviewed ? "Ready" : "Needs review"} />{!reviewed ? <Button variant="outline" className="py-1.5" disabled={!canRole(role, "approve")} onClick={() => markLoadReviewed(load)}>Review</Button> : null}</div></div>;
          })}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <p className="font-semibold text-slate-950">Payroll actions</p>
          <p className="mt-1 text-sm text-slate-500">Approve, pay or reopen this settlement.</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <LoadActionTile title="Approval" description={readyToApprove ? "Ready for approval." : needsReview ? "Resolve blockers first." : "Already approved or paid."} status={displayStatus} action="Approve" disabled={!readyToApprove || !canRole(role, "approve")} onClick={approveSettlement} />
          <LoadActionTile title="Payment" description={readyToPay ? "Settlement can be paid." : paid ? "Payment closed." : "Approval required."} status={readyToPay ? "Ready to pay" : paid ? "Paid" : "Pending"} action="Mark paid" disabled={!readyToPay || !canRole(role, "pay")} onClick={markPaid} />
          <LoadActionTile title="Correction" description="Reopen only when accounting needs correction." status={paid ? "Paid" : displayStatus} action="Reopen" disabled={!paid || !canRole(role, "pay")} onClick={reopenSettlement} />
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-slate-950">Payroll details</p>
        <div className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <DetailLine label="Driver" value={salary.driver} />
          <DetailLine label="Truck" value={salary.truck} />
          <DetailLine label="Loads" value={String(salary.loads)} />
          <DetailLine label="Warning" value={salary.warning || "—"} />
        </div>
      </Card>
    </>
  );
}

function ReportDrawer({ item, role, updateReport, save }) {
  const [status, setStatus] = useState(item.status);
  useEffect(() => setStatus(item.status), [item]);
  const generated = status === "Generated";
  const markReady = () => {
    setStatus("Generated");
    updateReport?.(item.id, { status: "Generated" });
    save?.("Report marked generated and ready to export.");
  };
  const exportReport = (format) => {
    if (!generated) {
      save?.("Generate report before export.");
      return;
    }
    save?.(item.name + " exported as " + format + ".");
  };
  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold tracking-tight text-slate-950">{item.name}</p>
              <StatusBadge value={status} />
            </div>
            <p className="mt-1 truncate text-sm text-slate-500">{item.period} · {item.source}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-500">Metric</p>
            <p className="text-lg font-semibold text-slate-950">{item.metric}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <p className="font-semibold text-slate-950">Report sections</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <InfoLine label="Summary" value="Included" icon={BarChart3} />
          <InfoLine label="Details" value="Included" icon={FileText} />
          <InfoLine label="Export" value="PDF / XLSX" icon={Download} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4">
          <p className="font-semibold text-slate-950">Report actions</p>
          <p className="mt-1 text-sm text-slate-500">Draft reports must be marked generated before export.</p>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <LoadActionTile title="Status" description={generated ? "Ready for export." : "Draft report needs review."} status={status} action="Mark ready" disabled={generated || !canRole(role, "create")} onClick={markReady} />
          <LoadActionTile title="PDF" description="Presentation-ready export." status={generated ? "Ready" : "Draft"} action="Export PDF" disabled={!generated || !canRole(role, "export")} onClick={() => exportReport("PDF")} />
          <LoadActionTile title="XLSX" description="Spreadsheet export for accounting." status={generated ? "Ready" : "Draft"} action="Export XLSX" disabled={!generated || !canRole(role, "export")} onClick={() => exportReport("XLSX")} />
        </div>
      </Card>
    </>
  );
}

function TruckCreateModal({ onClose, save, driverRecords }) {
  const [unit, setUnit] = useState("#2103");
  const [truckType, setTruckType] = useState("Semi Truck");
  const [vin, setVin] = useState("1HTNEW2103DEMO");
  const [tag, setTag] = useState("Pending");
  const [fleet, setFleet] = useState("Zigzag Carrier LLC");
  const [registrationExpiration, setRegistrationExpiration] = useState("2026-11-30");
  const [dotInspectionExpiration, setDotInspectionExpiration] = useState("2026-12-31");
  const [labels, setLabels] = useState("Main fleet");
  const [notes, setNotes] = useState("");
  const [trailer, setTrailer] = useState("Unassigned");
  const [driver1, setDriver1] = useState("Unassigned");
  const [driver2, setDriver2] = useState("Unassigned");
  const [investor1, setInvestor1] = useState("Unassigned");
  const [investor2, setInvestor2] = useState("Unassigned");
  const [dispatchFeePercent, setDispatchFeePercent] = useState("7");
  const [costItems, setCostItems] = useState([
    { name: "Truck payment", amount: "3120", frequency: "1 month" },
    { name: "Maintenance reserve", amount: "0.18", frequency: "per mile" },
  ]);
  const [error, setError] = useState("");
  const monthlyTotal = costItems.filter((row) => row.frequency === "1 month").reduce((sum, row) => sum + moneyNumber(row.amount), 0);
  const mileTotal = costItems.filter((row) => row.frequency === "per mile").reduce((sum, row) => sum + moneyNumber(row.amount), 0);
  const ready = unit.trim() && vin.trim() && tag.trim();
  const driverOptions = ["Unassigned", ...driverRecords.map((row) => row.name)];
  const costUpdate = (index, patch) => setCostItems((prev) => prev.map((row, i) => i === index ? { ...row, ...patch } : row));
  const addCostRow = () => setCostItems((prev) => [...prev, { name: "New cost", amount: "0", frequency: "1 month" }]);
  const removeCostRow = (index) => setCostItems((prev) => prev.filter((_, i) => i !== index));
  const submit = () => {
    if (!ready) {
      setError("Unit, VIN and TAG are required.");
      return;
    }
    save({ unit, truckType, vin, tag, registrationExpiration, dotInspectionExpiration, labels, notes, trailer, driver1, driver2, investor1, investor2, dispatchFeePercent, costItems, fleet });
  };
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/30 p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <div><p className="text-lg font-semibold text-slate-950">Create truck</p><p className="text-sm text-slate-500">Equipment, costs, trailer, driver and investor assignment.</p></div>
          <Button variant="ghost" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <Card className="p-4">
                <p className="font-semibold text-slate-950">Truck</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <label className="text-sm"><span className="text-slate-500">Unit number</span><Input value={unit} onChange={(e) => setUnit(e.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Truck type</span><select value={truckType} onChange={(e) => setTruckType(e.target.value)} className="mt-1 w-full"><option>Semi Truck</option><option>Box Truck</option><option>Sprinter Van</option></select></label>
                  <label className="text-sm"><span className="text-slate-500">Fleet</span><Input value={fleet} onChange={(e) => setFleet(e.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">VIN</span><Input value={vin} onChange={(e) => setVin(e.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">TAG</span><Input value={tag} onChange={(e) => setTag(e.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Labels</span><Input value={labels} onChange={(e) => setLabels(e.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Registration expiration</span><Input type="date" value={registrationExpiration} onChange={(e) => setRegistrationExpiration(e.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">DOT inspection expiration</span><Input type="date" value={dotInspectionExpiration} onChange={(e) => setDotInspectionExpiration(e.target.value)} /></label>
                  <label className="text-sm md:col-span-3"><span className="text-slate-500">Notes</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 min-h-[84px] w-full" placeholder="Optional truck note..." /></label>
                </div>
              </Card>

              <Card className="overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
                  <div><p className="font-semibold text-slate-950">Expenses and payments</p><p className="mt-1 text-sm text-slate-500">Monthly and per-mile cost projections.</p></div>
                  <Button variant="outline" onClick={addCostRow}><Plus className="mr-2 h-4 w-4" />Add row</Button>
                </div>
                <div className="divide-y divide-slate-100">
                  {costItems.map((row, index) => <div key={index} className="grid gap-3 p-4 md:grid-cols-[1fr_130px_150px_44px]">
                    <Input value={row.name} onChange={(e) => costUpdate(index, { name: e.target.value })} />
                    <Input value={row.amount} onChange={(e) => costUpdate(index, { amount: e.target.value })} />
                    <select value={row.frequency} onChange={(e) => costUpdate(index, { frequency: e.target.value })} className="w-full"><option>1 month</option><option>per mile</option></select>
                    <Button variant="ghost" className="px-2" onClick={() => removeCostRow(index)}><X className="h-4 w-4" /></Button>
                  </div>)}
                </div>
              </Card>

              <Card className="p-4">
                <p className="font-semibold text-slate-950">Relations</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="text-sm"><span className="text-slate-500">Trailer</span><Input value={trailer} onChange={(e) => setTrailer(e.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Driver 1</span><select value={driver1} onChange={(e) => setDriver1(e.target.value)} className="mt-1 w-full">{driverOptions.map((row) => <option key={row}>{row}</option>)}</select></label>
                  <label className="text-sm"><span className="text-slate-500">Driver 2</span><select value={driver2} onChange={(e) => setDriver2(e.target.value)} className="mt-1 w-full">{driverOptions.map((row) => <option key={row}>{row}</option>)}</select></label>
                  <label className="text-sm"><span className="text-slate-500">Investor 1</span><Input value={investor1} onChange={(e) => setInvestor1(e.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Investor 2</span><Input value={investor2} onChange={(e) => setInvestor2(e.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Dispatch fee %</span><Input value={dispatchFeePercent} onChange={(e) => setDispatchFeePercent(e.target.value)} /></label>
                </div>
              </Card>
            </div>

            <div className="space-y-4 lg:sticky lg:top-0 lg:self-start">
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 p-4"><p className="font-semibold text-slate-950">Cost projection</p><p className="mt-1 text-sm text-slate-500">Calculated from entered cost rows.</p></div>
                <div className="p-4">
                  <div className="rounded-2xl bg-slate-50 p-4 text-center">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Monthly fixed</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{formatMoney(monthlyTotal)}</p>
                    <p className="mt-2 text-sm text-slate-500">Variable cost: ${Number(mileTotal || 0).toFixed(2)} / mi</p>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <DetailLine label="Unit" value={unit || "—"} />
                    <DetailLine label="Truck type" value={truckType} />
                    <DetailLine label="Driver 1" value={driver1} />
                    <DetailLine label="Trailer" value={trailer} />
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <p className="font-semibold text-slate-950">Readiness</p>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Required fields</span><StatusBadge value={ready ? "Ready" : "Needs review"} /></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Cost rows</span><StatusBadge value={costItems.length ? "Ready" : "Needs review"} /></div>
                </div>
              </Card>
              {error ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><AlertTriangle className="mr-2 inline h-4 w-4" />{error}</div> : null}
            </div>
          </div>
        </div>
        <div className="flex h-16 shrink-0 items-center justify-between border-t border-slate-200 px-6">
          <StatusBadge value={ready ? "Ready" : "Needs review"} />
          <div className="flex gap-2"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={submit}>Save truck</Button></div>
        </div>
      </div>
    </div>
  );
}

function InvoiceGenerateModal({ onClose, save, loads }) {
  const [selectedIds, setSelectedIds] = useState([loads[0]?.id].filter(Boolean));
  const selectedLoads = loads.filter((load) => selectedIds.includes(load.id));
  const total = selectedLoads.reduce((sum, load) => sum + moneyNumber(load.rate), 0);
  const missing = selectedLoads.filter((load) => load.docs !== "Ready").length;
  const toggle = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  const submit = () => save({ loadIds: selectedIds });
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/30 p-4">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <div><p className="text-lg font-semibold text-slate-950">Generate invoice</p><p className="text-sm text-slate-500">Create a single or grouped invoice from delivered loads.</p></div>
          <Button variant="ghost" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 p-4"><p className="font-semibold text-slate-950">Select loads</p><p className="mt-1 text-sm text-slate-500">Grouped invoices can include multiple delivered loads.</p></div>
              <div className="divide-y divide-slate-100">
                {loads.map((load) => <label key={load.id} className="flex cursor-pointer items-start gap-3 p-4 hover:bg-slate-50">
                  <input type="checkbox" checked={selectedIds.includes(load.id)} onChange={() => toggle(load.id)} className="mt-1" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-slate-950">{load.id}</p><StatusBadge value={load.docs === "Ready" ? "Ready" : "Needs review"} /></div>
                    <p className="mt-1 text-sm text-slate-500">{load.trip} · {load.customer}</p>
                  </div>
                  <p className="shrink-0 font-semibold text-slate-950">{load.rate}</p>
                </label>)}
              </div>
            </Card>
            <div className="space-y-4">
              <Card className="p-4">
                <p className="font-semibold text-slate-950">Invoice summary</p>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center"><p className="text-xs uppercase tracking-wide text-slate-400">Total</p><p className="mt-1 text-3xl font-semibold text-slate-950">{formatMoney(total)}</p><p className="mt-2 text-sm text-slate-500">{selectedLoads.length} selected loads</p></div>
                <div className="mt-4 grid gap-3"><DetailLine label="Missing docs" value={String(missing)} /><DetailLine label="Invoice type" value={selectedLoads.length > 1 ? "Grouped" : "Single load"} /></div>
              </Card>
              {missing ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><AlertTriangle className="mr-2 inline h-4 w-4" />Invoice can be drafted, but POD is required before sending.</div> : null}
            </div>
          </div>
        </div>
        <div className="flex h-16 shrink-0 items-center justify-between border-t border-slate-200 px-6"><StatusBadge value={missing ? "Needs review" : "Ready"} /><div className="flex gap-2"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={submit}>Generate invoice</Button></div></div>
      </div>
    </div>
  );
}

function ExpenseCreateModal({ onClose, save, trucks, drivers, loads }) {
  const [type, setType] = useState("Fuel");
  const [amount, setAmount] = useState("450");
  const [date, setDate] = useState("2026-05-22");
  const [fleet, setFleet] = useState("Zigzag Carrier LLC");
  const [truck, setTruck] = useState(trucks[0]?.unit || "#1974");
  const [driver, setDriver] = useState(drivers[0]?.name || "Gudelio Ramos");
  const [load, setLoad] = useState(loads[0]?.id || "Unassigned");
  const [receiptUploaded, setReceiptUploaded] = useState(true);
  const [note, setNote] = useState("");
  const isOverhead = load === "Overhead";
  const ready = amount && Number(amount) > 0 && (receiptUploaded || isOverhead);
  const submit = () => save({ type, amount, date, fleet, truck, driver, load, receiptUploaded, note });
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/30 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6"><div><p className="text-lg font-semibold text-slate-950">Add expense</p><p className="text-sm text-slate-500">Attach amount, receipt and assignment.</p></div><Button variant="ghost" onClick={onClose}><X className="h-5 w-5" /></Button></div>
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              <Card className="p-4"><p className="font-semibold text-slate-950">Expense details</p><div className="mt-4 grid gap-3 md:grid-cols-2"><label className="text-sm"><span className="text-slate-500">Type</span><select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full"><option>Fuel</option><option>Toll</option><option>Maintenance</option><option>Insurance</option><option>Other</option></select></label><label className="text-sm"><span className="text-slate-500">Amount</span><Input value={amount} onChange={(e) => setAmount(e.target.value)} /></label><label className="text-sm"><span className="text-slate-500">Date</span><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label><label className="text-sm"><span className="text-slate-500">Fleet</span><Input value={fleet} onChange={(e) => setFleet(e.target.value)} /></label></div></Card>
              <Card className="p-4"><p className="font-semibold text-slate-950">Assignment</p><div className="mt-4 grid gap-3 md:grid-cols-3"><label className="text-sm"><span className="text-slate-500">Truck</span><select value={truck} onChange={(e) => setTruck(e.target.value)} className="mt-1 w-full">{trucks.map((row) => <option key={row.unit}>{row.unit}</option>)}</select></label><label className="text-sm"><span className="text-slate-500">Driver</span><select value={driver} onChange={(e) => setDriver(e.target.value)} className="mt-1 w-full">{drivers.map((row) => <option key={row.name}>{row.name}</option>)}</select></label><label className="text-sm"><span className="text-slate-500">Load</span><select value={load} onChange={(e) => setLoad(e.target.value)} className="mt-1 w-full"><option>Unassigned</option><option>Overhead</option>{loads.map((row) => <option key={row.id}>{row.id}</option>)}</select></label></div></Card>
              <Card className="p-4"><p className="font-semibold text-slate-950">Receipt and note</p><label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 p-4"><input type="checkbox" checked={receiptUploaded} onChange={(e) => setReceiptUploaded(e.target.checked)} /><span className="text-sm font-medium text-slate-950">Receipt uploaded</span></label><textarea value={note} onChange={(e) => setNote(e.target.value)} className="mt-3 min-h-[84px] w-full" placeholder="Optional accounting note..." /></Card>
            </div>
            <div className="space-y-4 lg:sticky lg:top-0 lg:self-start"><Card className="p-4"><p className="font-semibold text-slate-950">Summary</p><div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center"><p className="text-xs uppercase tracking-wide text-slate-400">Amount</p><p className="mt-1 text-3xl font-semibold text-slate-950">{formatMoney(moneyNumber(amount))}</p><div className="mt-3"><StatusBadge value={ready ? "Ready" : "Needs review"} /></div></div><div className="mt-4 grid gap-3"><DetailLine label="Load" value={load} /><DetailLine label="Truck" value={truck} /><DetailLine label="Receipt" value={receiptUploaded ? "Uploaded" : "Missing"} /></div></Card></div>
          </div>
        </div>
        <div className="flex h-16 shrink-0 items-center justify-between border-t border-slate-200 px-6"><StatusBadge value={ready ? "Ready" : "Needs review"} /><div className="flex gap-2"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={submit}>Save expense</Button></div></div>
      </div>
    </div>
  );
}

function PayrollGenerateModal({ onClose, save, loads, drivers, salaries }) {
  const [period, setPeriod] = useState("May 13 - May 20");
  const payrollRows = drivers.map((driver) => {
    const driverLoads = loads.filter((load) => load.driver === driver.name);
    const blockedLoad = driverLoads.find((load) => load.docs !== "Ready" || load.expenseStatus === "Needs assignment" || load.expenseStatus === "Needs receipt");
    const gross = driverLoads.reduce((sum, load) => sum + moneyNumber(load.rate) * 0.22, 0) || 680;
    const deductions = driver.type === "Owner Operator" ? 96 : 245;
    const reimbursements = driver.name === "Andrew Stone" ? 140 : 60;
    const net = gross - deductions + reimbursements;
    const exists = salaries.some((salary) => salary.driver === driver.name && salary.period === period && salary.truck === driver.truck);
    return { driver: driver.name, truck: driver.truck, loads: Math.max(1, driverLoads.length), gross, deductions, reimbursements, net, blocked: Boolean(blockedLoad), blocker: blockedLoad ? "Resolve " + blockedLoad.id + " before approval" : "Ready", exists };
  });
  const selectedRows = payrollRows.filter((row) => !row.exists);
  const submit = () => save({ period, rows: selectedRows });
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/30 p-4">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6"><div><p className="text-lg font-semibold text-slate-950">Create payroll</p><p className="text-sm text-slate-500">Generate driver settlements from delivered loads.</p></div><Button variant="ghost" onClick={onClose}><X className="h-5 w-5" /></Button></div>
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <Card className="overflow-hidden"><div className="border-b border-slate-200 p-4"><p className="font-semibold text-slate-950">Drivers</p><p className="mt-1 text-sm text-slate-500">Existing settlements are skipped.</p></div><div className="divide-y divide-slate-100">{payrollRows.map((row) => <div key={row.driver} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="font-semibold text-slate-950">{row.driver}</p><p className="mt-1 text-sm text-slate-500">{row.truck} · {row.loads} load(s)</p></div><div className="flex items-center gap-3"><StatusBadge value={row.exists ? "Excluded" : row.blocked ? "Needs review" : "Ready"} /><p className="w-24 text-right font-semibold text-slate-950">{formatMoney(row.net)}</p></div></div>)}</div></Card>
            <div className="space-y-4"><Card className="p-4"><p className="font-semibold text-slate-950">Payroll setup</p><label className="mt-4 block text-sm"><span className="text-slate-500">Period</span><Input value={period} onChange={(e) => setPeriod(e.target.value)} /></label><div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center"><p className="text-xs uppercase tracking-wide text-slate-400">Will generate</p><p className="mt-1 text-3xl font-semibold text-slate-950">{selectedRows.length}</p><p className="mt-2 text-sm text-slate-500">new settlements</p></div></Card></div>
          </div>
        </div>
        <div className="flex h-16 shrink-0 items-center justify-between border-t border-slate-200 px-6"><StatusBadge value={selectedRows.length ? "Ready" : "Excluded"} /><div className="flex gap-2"><Button variant="outline" onClick={onClose}>Close</Button><Button onClick={submit}>Create payroll</Button></div></div>
      </div>
    </div>
  );
}

function ReportGenerateModal({ onClose, save, notify, loads, drivers, trucks, invoices, expenses, salaries }) {
  const [reportType, setReportType] = useState("Carrier Performance");
  const [period, setPeriod] = useState("May 2026");
  const [grouping, setGrouping] = useState("By load");
  const [driver, setDriver] = useState("All drivers");
  const [fleet, setFleet] = useState("All fleets");
  const [truck, setTruck] = useState("All trucks");
  const [format, setFormat] = useState("PDF");
  const [includeArchived, setIncludeArchived] = useState(false);
  const [step, setStep] = useState(1);
  const driverFilteredLoads = driver === "All drivers" ? loads : loads.filter((load) => load.driver === driver);
  const truckFilteredLoads = truck === "All trucks" ? driverFilteredLoads : driverFilteredLoads.filter((load) => load.truck === truck);
  const filteredLoads = truckFilteredLoads;
  const gross = filteredLoads.reduce((sum, load) => sum + moneyNumber(load.rate), 0);
  const totalMiles = filteredLoads.reduce((sum, load) => sum + moneyNumber(load.miles), 0);
  const expenseTotal = expenses.reduce((sum, row) => sum + moneyNumber(row.amount), 0);
  const payrollTotal = salaries.reduce((sum, row) => sum + moneyNumber(row.net), 0);
  const openInvoiceTotal = invoices.filter((row) => row.status !== "Paid").reduce((sum, row) => sum + moneyNumber(row.amount), 0);
  const avgRpm = totalMiles ? (gross / totalMiles).toFixed(2) : "0.00";
  const generatedMetric = reportType === "Invoice Aging" ? formatMoney(openInvoiceTotal) + " open" : reportType === "Expense Breakdown" ? formatMoney(expenseTotal) + " expenses" : reportType === "Driver Payroll" ? formatMoney(payrollTotal) + " payroll" : filteredLoads.length + " loads · $" + avgRpm + " RPM";
  const exportNow = (type) => notify?.(reportType + " preview exported as " + type + ".");
  const submit = () => save(reportType);
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/30 p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6"><div><p className="text-lg font-semibold text-slate-950">Generate report</p><p className="text-sm text-slate-500">Build a carrier-side report with setup and preview.</p></div><Button variant="ghost" onClick={onClose}><X className="h-5 w-5" /></Button></div>
        <div className="min-h-0 flex-1 overflow-auto p-6">
          {step === 1 ? <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              <Card className="p-4"><p className="font-semibold text-slate-950">Set up carrier report</p><div className="mt-4 grid gap-3 md:grid-cols-2"><label className="text-sm"><span className="text-slate-500">Report type</span><select value={reportType} onChange={(e) => setReportType(e.target.value)} className="mt-1 w-full"><option>Carrier Performance</option><option>Driver Performance</option><option>Profit by Load</option><option>Invoice Aging</option><option>Expense Breakdown</option><option>Driver Payroll</option></select></label><label className="text-sm"><span className="text-slate-500">Report period</span><Input value={period} onChange={(e) => setPeriod(e.target.value)} /></label><label className="text-sm"><span className="text-slate-500">Loads grouping</span><select value={grouping} onChange={(e) => setGrouping(e.target.value)} className="mt-1 w-full"><option>By load</option><option>By driver</option><option>By truck</option><option>By customer</option></select></label><label className="text-sm"><span className="text-slate-500">Export format</span><select value={format} onChange={(e) => setFormat(e.target.value)} className="mt-1 w-full"><option>PDF</option><option>XLSX</option></select></label></div></Card>
              <Card className="p-4"><p className="font-semibold text-slate-950">Filters</p><div className="mt-4 grid gap-3 md:grid-cols-3"><label className="text-sm"><span className="text-slate-500">Driver</span><select value={driver} onChange={(e) => setDriver(e.target.value)} className="mt-1 w-full"><option>All drivers</option>{drivers.map((row) => <option key={row.name}>{row.name}</option>)}</select></label><label className="text-sm"><span className="text-slate-500">Fleet</span><select value={fleet} onChange={(e) => setFleet(e.target.value)} className="mt-1 w-full"><option>All fleets</option><option>Zigzag Carrier LLC</option><option>Hunt Logistics</option></select></label><label className="text-sm"><span className="text-slate-500">Truck</span><select value={truck} onChange={(e) => setTruck(e.target.value)} className="mt-1 w-full"><option>All trucks</option>{trucks.map((row) => <option key={row.unit}>{row.unit}</option>)}</select></label></div><label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 p-4"><input type="checkbox" checked={includeArchived} onChange={(e) => setIncludeArchived(e.target.checked)} /><span className="text-sm font-medium text-slate-950">Include archived records</span></label></Card>
            </div>
            <div className="space-y-4"><Card className="p-4"><p className="font-semibold text-slate-950">Preview summary</p><div className="mt-4 rounded-2xl bg-slate-50 p-4 text-center"><p className="text-xs uppercase tracking-wide text-slate-400">Metric</p><p className="mt-1 text-2xl font-semibold text-slate-950">{generatedMetric}</p><p className="mt-2 text-sm text-slate-500">{filteredLoads.length} matching loads</p></div><div className="mt-4 grid gap-3"><DetailLine label="Period" value={period} /><DetailLine label="Grouping" value={grouping} /><DetailLine label="Format" value={format} /></div></Card></div>
          </div> : <div className="grid gap-4 lg:grid-cols-[1fr_340px]"><Card className="overflow-hidden"><div className="border-b border-slate-200 p-4"><p className="font-semibold text-slate-950">Preview report</p><p className="mt-1 text-sm text-slate-500">{reportType} · {period}</p></div><div className="grid gap-3 p-4 md:grid-cols-4"><InfoLine label="Loads" value={String(filteredLoads.length)} icon={Route} /><InfoLine label="Gross" value={formatMoney(gross)} icon={DollarSign} /><InfoLine label="Miles" value={String(totalMiles || 0)} icon={Navigation} /><InfoLine label="Avg RPM" value={"$" + avgRpm} icon={BarChart3} /></div><div className="overflow-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Load</th><th className="px-4 py-3">Driver</th><th className="px-4 py-3">Truck</th><th className="px-4 py-3">Route</th><th className="px-4 py-3">Rate</th><th className="px-4 py-3">RPM</th></tr></thead><tbody className="divide-y divide-slate-100 bg-white">{filteredLoads.map((load) => <tr key={load.id}><td className="px-4 py-3 font-semibold text-slate-950">{load.id}</td><td className="px-4 py-3">{load.driver}</td><td className="px-4 py-3">{load.truck}</td><td className="px-4 py-3">{load.origin} → {load.destination}</td><td className="px-4 py-3">{load.rate}</td><td className="px-4 py-3">${(moneyNumber(load.rate) / Math.max(1, moneyNumber(load.miles))).toFixed(2)}</td></tr>)}</tbody></table></div></Card><div className="space-y-4"><Card className="p-4"><p className="font-semibold text-slate-950">Export preview</p><div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-semibold text-slate-950">{reportType}</p><p className="mt-2">Total gross: {formatMoney(gross)}</p><p>Total miles: {totalMiles || 0}</p><p>Average RPM: ${avgRpm}</p></div><div className="mt-4 grid gap-2"><Button variant="outline" onClick={() => exportNow("PDF")}>Export PDF</Button><Button variant="outline" onClick={() => exportNow("XLSX")}>Export XLSX</Button></div></Card></div></div>}
        </div>
        <div className="flex h-16 shrink-0 items-center justify-between border-t border-slate-200 px-6"><StatusBadge value="Ready" /><div className="flex gap-2"><Button variant="outline" onClick={onClose}>Close</Button>{step === 2 ? <Button variant="outline" onClick={() => setStep(1)}>Back</Button> : null}{step === 1 ? <Button onClick={() => setStep(2)}>Preview report</Button> : <Button onClick={submit}>Save report</Button>}</div></div>
      </div>
    </div>
  );
}

function DriverCreateModal({ onClose, save, truckRecords }) {
  const [firstName, setFirstName] = useState("Anthony");
  const [lastName, setLastName] = useState("Jackson");
  const [profileType, setProfileType] = useState("Driver");
  const [email, setEmail] = useState("anthony@huntlogistics.com");
  const [phone, setPhone] = useState("+1 469 555 0177");
  const [language, setLanguage] = useState("English");
  const [labels, setLabels] = useState("");
  const [payrollEnabled, setPayrollEnabled] = useState(false);
  const [mobileAppEnabled, setMobileAppEnabled] = useState(false);
  const [platformAccessEnabled, setPlatformAccessEnabled] = useState(false);
  const [fleet, setFleet] = useState("Zigzag Carrier LLC");
  const [driverType, setDriverType] = useState("Company Driver");
  const [assignedTruck, setAssignedTruck] = useState("Unassigned");
  const [licenseNumber, setLicenseNumber] = useState("D74219388");
  const [medical, setMedical] = useState("2026-10-01");
  const [cdl, setCdl] = useState("2027-03-10");
  const [blacklistedStates, setBlacklistedStates] = useState("None");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const fullName = (firstName + " " + lastName).trim() || "New Driver";
  const profileReady = firstName.trim() && lastName.trim() && email.trim();
  const docsReady = licenseNumber.trim() && medical && cdl;
  const assigned = assignedTruck !== "Unassigned";
  const accessCount = [payrollEnabled, mobileAppEnabled, platformAccessEnabled].filter(Boolean).length;
  const readyStatus = profileReady && docsReady ? "Ready" : "Needs review";
  const truckOptions = ["Unassigned", ...truckRecords.map((row) => row.unit)];
  const submit = () => {
    if (!profileReady) {
      setError("First name, last name and email are required.");
      return;
    }
    save({ firstName, lastName, profileType, email, phone, language, labels, payrollEnabled, mobileAppEnabled, platformAccessEnabled, fleet, driverType, assignedTruck, licenseNumber, medical, cdl, blacklistedStates, notes });
  };
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/30 p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <div><p className="text-lg font-semibold text-slate-950">New driver</p><p className="text-sm text-slate-500">Profile, access, fleet and driver details.</p></div>
          <Button variant="ghost" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <Card className="p-4">
                <p className="font-semibold text-slate-950">Profile</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="text-sm"><span className="text-slate-500">First name</span><Input value={firstName} onChange={(event) => setFirstName(event.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Last name</span><Input value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Profile type</span><select value={profileType} onChange={(event) => setProfileType(event.target.value)} className="mt-1 w-full"><option>Driver</option><option>Dispatcher</option><option>Manager</option></select></label>
                  <label className="text-sm"><span className="text-slate-500">Email</span><Input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Phone</span><Input value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Language</span><select value={language} onChange={(event) => setLanguage(event.target.value)} className="mt-1 w-full"><option>English</option><option>Spanish</option><option>Russian</option><option>Romanian</option></select></label>
                  <label className="text-sm md:col-span-2"><span className="text-slate-500">Labels</span><Input value={labels} onChange={(event) => setLabels(event.target.value)} placeholder="Optional labels" /></label>
                </div>
              </Card>

              <Card className="p-4">
                <p className="font-semibold text-slate-950">Access</p>
                <div className="mt-4 grid gap-3">
                  <ToggleRow title="Payroll" text="Allow this driver to appear in settlement generation." enabled={payrollEnabled} setEnabled={setPayrollEnabled} />
                  <ToggleRow title="Mobile App Access" text="Allow access to Driver App features." enabled={mobileAppEnabled} setEnabled={setMobileAppEnabled} />
                  <ToggleRow title="Platform Access" text="Allow platform login for web workspace." enabled={platformAccessEnabled} setEnabled={setPlatformAccessEnabled} />
                </div>
              </Card>

              <Card className="p-4">
                <p className="font-semibold text-slate-950">Driver fleet</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="text-sm"><span className="text-slate-500">Fleet</span><Input value={fleet} onChange={(event) => setFleet(event.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Assigned truck</span><select value={assignedTruck} onChange={(event) => setAssignedTruck(event.target.value)} className="mt-1 w-full">{truckOptions.map((row) => <option key={row}>{row}</option>)}</select></label>
                </div>
              </Card>

              <Card className="p-4">
                <p className="font-semibold text-slate-950">Driver details</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="text-sm"><span className="text-slate-500">Type</span><select value={driverType} onChange={(event) => setDriverType(event.target.value)} className="mt-1 w-full"><option>Company Driver</option><option>Owner Operator</option><option>Team Driver</option></select></label>
                  <label className="text-sm"><span className="text-slate-500">License number</span><Input value={licenseNumber} onChange={(event) => setLicenseNumber(event.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">Medical card expiration</span><Input type="date" value={medical} onChange={(event) => setMedical(event.target.value)} /></label>
                  <label className="text-sm"><span className="text-slate-500">CDL expiration</span><Input type="date" value={cdl} onChange={(event) => setCdl(event.target.value)} /></label>
                  <label className="text-sm md:col-span-2"><span className="text-slate-500">Blacklisted states</span><Input value={blacklistedStates} onChange={(event) => setBlacklistedStates(event.target.value)} /></label>
                </div>
              </Card>

              <Card className="p-4">
                <p className="font-semibold text-slate-950">Notes</p>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-3 min-h-[92px] w-full" placeholder="Optional internal note..." />
              </Card>
            </div>

            <div className="space-y-4 lg:sticky lg:top-0 lg:self-start">
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 p-4">
                  <p className="font-semibold text-slate-950">Driver summary</p>
                  <p className="mt-1 text-sm text-slate-500">Review before saving.</p>
                </div>
                <div className="p-4">
                  <div className="rounded-2xl bg-slate-50 p-4 text-center">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Driver</p>
                    <p className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-950">{fullName}</p>
                    <div className="mt-3"><StatusBadge value={readyStatus} /></div>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <DetailLine label="Profile" value={profileType} />
                    <DetailLine label="Fleet" value={fleet} />
                    <DetailLine label="Type" value={driverType} />
                    <DetailLine label="Truck" value={assignedTruck} />
                    <DetailLine label="Access" value={String(accessCount) + " enabled"} />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <p className="font-semibold text-slate-950">Readiness</p>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Required fields</span><StatusBadge value={profileReady ? "Ready" : "Needs review"} /></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Documents</span><StatusBadge value={docsReady ? "Ready" : "Needs review"} /></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span>Assignment</span><StatusBadge value={assigned ? "Active" : "Pending"} /></div>
                </div>
              </Card>

              {error ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><AlertTriangle className="mr-2 inline h-4 w-4" />{error}</div> : null}
            </div>
          </div>
        </div>

        <div className="flex h-16 shrink-0 items-center justify-between border-t border-slate-200 px-6">
          <StatusBadge value={readyStatus} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={submit}>Save driver</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ title, text, enabled, setEnabled }) {
  return <button onClick={() => setEnabled(!enabled)} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left hover:bg-slate-50"><span><span className="block font-medium text-slate-950">{title}</span><span className="text-sm text-slate-500">{text}</span></span><StatusBadge value={enabled ? "Enabled" : "Disabled"} /></button>;
}

function MoreDot() {
  return <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />;
}
