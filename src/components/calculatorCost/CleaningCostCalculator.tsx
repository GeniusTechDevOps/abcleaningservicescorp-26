import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  defaultCleaningPricing,
  type AddOnDefinition,
  type CleaningLevel,
  type CleaningPricing,
  type Frequency,
  type PropertyType,
  type SpaceDefinition,
} from "./cleaningPricing";

type QuantityMap = Record<string, number>;

export type CleaningEstimate = {
  propertyType: PropertyType;
  cleaningLevel: CleaningLevel;
  frequency: Frequency;
  spaces: QuantityMap;
  squareFeet: number;
  addOns: QuantityMap;
  subtotal: number;
  levelAdjustment: number;
  recurringDiscount: number;
  extrasTotal: number;
  estimatedPrice: number;
  estimateLow: number;
  estimateHigh: number;
  estimatedMonthly: number | null;
};

export type CleaningCostCalculatorProps = {
  pricing?: CleaningPricing;
  businessName?: string;
  phoneNumber?: string;
  recipientEmails?: string[];
  logo?: string;
  quoteButtonLabel?: string;
  onQuoteRequest?: (estimate: CleaningEstimate) => void;
};

const EMAIL_API_URL =
  "https://email-server-r-8fb46242f2ca.herokuapp.com/email/custom/gtd";
const EMAIL_API_KEY = "dev_74621dd2-387e-4012-b973-f98c246b72df";

const initialResidentialSpaces: QuantityMap = {};

const initialCommercialSpaces: QuantityMap = {};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

function Stepper({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-300">
      <div className="min-w-0">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{hint}</p>
      </div>
      <div
        className="flex shrink-0 items-center gap-2"
        aria-label={`${label} quantity`}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-xl text-slate-700 transition hover:border-teal-500 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-35"
          aria-label={`Remove one ${label}`}
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-bold tabular-nums text-slate-900">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(20, value + 1))}
          className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xl text-white transition hover:bg-teal-700"
          aria-label={`Add one ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="m4 10 4 4 8-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionTitle({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
        {number}
      </span>
      <h2 className="text-lg font-bold tracking-tight text-slate-950">
        {children}
      </h2>
    </div>
  );
}

export default function CleaningCostCalculator({
  pricing = defaultCleaningPricing,
  businessName = "Your Cleaning Company",
  phoneNumber,
  recipientEmails = [],
  logo = "",
  quoteButtonLabel = "Request my exact quote",
  onQuoteRequest,
}: CleaningCostCalculatorProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [cleaningLevel, setCleaningLevel] = useState<CleaningLevel | "">("");
  const [frequency, setFrequency] = useState<Frequency | "">("");
  const [residentialSpaces, setResidentialSpaces] = useState<QuantityMap>(
    initialResidentialSpaces,
  );
  const [commercialSpaces, setCommercialSpaces] = useState<QuantityMap>(
    initialCommercialSpaces,
  );
  const [squareFeet, setSquareFeet] = useState<number | "">("");
  const [addOns, setAddOns] = useState<QuantityMap>({});
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"success" | "error" | null>(
    null,
  );
  const [sendMessage, setSendMessage] = useState("");

  const spaces =
    propertyType === "commercial" ? commercialSpaces : residentialSpaces;
  const spaceDefinitions =
    propertyType === "residential"
      ? pricing.residentialSpaces
      : propertyType === "commercial"
        ? pricing.commercialSpaces
        : [];
  const availableAddOns = propertyType ? pricing.addOns[propertyType] : [];
  const hasRequiredSelections = Boolean(
    propertyType && cleaningLevel && frequency,
  );
  const hasSpaceDetails =
    propertyType === "commercial"
      ? Number(squareFeet) > 0
      : Object.values(spaces).some((quantity) => quantity > 0);
  const hasValidContact =
    customerName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()) &&
    customerPhone.replace(/\D/g, "").length === 10 &&
    customerAddress.trim().length >= 5;
  const canRequestQuote =
    hasValidContact && hasRequiredSelections && hasSpaceDetails;

  const updateSpace = (id: string, value: number) => {
    const setter =
      propertyType === "residential"
        ? setResidentialSpaces
        : setCommercialSpaces;
    setter((current) => ({ ...current, [id]: value }));
  };

  const updateAddOn = (item: AddOnDefinition) => {
    setAddOns((current) => {
      const currentValue = current[item.id] ?? 0;
      return { ...current, [item.id]: currentValue > 0 ? 0 : 1 };
    });
  };

  const estimate = useMemo<CleaningEstimate>(() => {
    const roomTotal = spaceDefinitions.reduce(
      (total, item) => total + (spaces[item.id] ?? 0) * item.price,
      0,
    );
    const squareFootTotal =
      propertyType === "commercial"
        ? Math.max(0, Number(squareFeet)) * pricing.commercialSquareFootRate
        : 0;
    const rawBase = roomTotal + squareFootTotal;
    const minimum = propertyType ? pricing.minimums[propertyType] : 0;
    const subtotal = Math.max(minimum, rawBase);
    const levelMultiplier = cleaningLevel
      ? pricing.levels[cleaningLevel].multiplier
      : 0;
    const frequencyMultiplier = frequency
      ? pricing.frequencies[frequency].multiplier
      : 0;
    const afterLevel = subtotal * levelMultiplier;
    const afterFrequency = afterLevel * frequencyMultiplier;
    const extrasTotal = availableAddOns.reduce(
      (total, item) => total + (addOns[item.id] ?? 0) * item.price,
      0,
    );
    const estimatedPrice = Math.round(afterFrequency + extrasTotal);
    const variance = pricing.estimateVariance;
    const estimateLow = Math.max(
      minimum,
      Math.round(estimatedPrice * (1 - variance)),
    );
    const estimateHigh = Math.round(estimatedPrice * (1 + variance));
    const visitsPerMonth = frequency
      ? pricing.frequencies[frequency].visitsPerMonth
      : 0;

    return {
      propertyType: propertyType as PropertyType,
      cleaningLevel: cleaningLevel as CleaningLevel,
      frequency: frequency as Frequency,
      spaces,
      squareFeet: Number(squareFeet),
      addOns,
      subtotal,
      levelAdjustment: afterLevel - subtotal,
      recurringDiscount: afterLevel - afterFrequency,
      extrasTotal,
      estimatedPrice,
      estimateLow,
      estimateHigh,
      estimatedMonthly:
        !frequency || frequency === "once"
          ? null
          : Math.round(estimatedPrice * visitsPerMonth),
    };
  }, [
    addOns,
    availableAddOns,
    cleaningLevel,
    frequency,
    pricing,
    propertyType,
    spaces,
    spaceDefinitions,
    squareFeet,
  ]);

  const handleQuoteRequest = async () => {
    if (isSending || !canRequestQuote) return;
    if (onQuoteRequest) {
      onQuoteRequest(estimate);
      return;
    }
    const to = recipientEmails[0];
    if (!to) {
      setSendStatus("error");
      setSendMessage(
        "We could not send your request. Please call us for assistance.",
      );
      return;
    }

    setIsSending(true);
    setSendStatus(null);
    setSendMessage("");
    const safe = (value: string | number) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    const company = businessName || "Cleaning Company";
    const detailRow = (label: string, quantity: number, amount: number) =>
      `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#334155">${safe(label)} × ${quantity}</td><td align="right" style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:700">${safe(money(amount, pricing.currency))}</td></tr>`;
    const spaceRows = spaceDefinitions
      .filter((item) => (spaces[item.id] ?? 0) > 0)
      .map((item) =>
        detailRow(
          item.label,
          spaces[item.id] ?? 0,
          (spaces[item.id] ?? 0) * item.price,
        ),
      )
      .join("");
    const extrasRows =
      availableAddOns
        .filter((item) => (addOns[item.id] ?? 0) > 0)
        .map((item) =>
          detailRow(
            item.label,
            addOns[item.id] ?? 0,
            (addOns[item.id] ?? 0) * item.price,
          ),
        )
        .join("") ||
      '<tr><td colspan="2" style="padding:10px 0;color:#64748b">No extras selected</td></tr>';
    const logoUrl = logo ? new URL(logo, window.location.origin).href : "";
    const body = `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a"><table role="presentation" width="100%" style="padding:28px 12px"><tr><td align="center"><table role="presentation" width="640" style="width:100%;max-width:640px;background:#fff;border:1px solid #dbe4ea;border-radius:18px;overflow:hidden">
        <tr><td style="padding:28px 30px;background:#0f766e;color:#fff">${logoUrl ? `<img src="${safe(logoUrl)}" alt="${safe(company)}" width="64" style="max-height:64px;margin-bottom:16px;border-radius:12px;background:#fff;padding:5px">` : ""}<div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#99f6e4">New website lead</div><h1 style="margin:7px 0 5px;font-size:25px">Exact Cleaning Quote Request</h1><p style="margin:0;color:#ccfbf1">A customer completed the online cost calculator.</p></td></tr>
        <tr><td style="padding:28px 30px"><h2 style="margin-top:0;font-size:17px">Customer information</h2><table role="presentation" width="100%" style="margin-bottom:24px;font-size:14px"><tr><td style="padding:7px 0;color:#64748b">Name</td><td align="right"><strong>${safe(customerName.trim())}</strong></td></tr><tr><td style="padding:7px 0;color:#64748b">Email</td><td align="right"><a href="mailto:${safe(customerEmail.trim())}" style="color:#0f766e;font-weight:700">${safe(customerEmail.trim())}</a></td></tr><tr><td style="padding:7px 0;color:#64748b">Phone</td><td align="right"><a href="tel:${safe(customerPhone.replace(/\D/g, ""))}" style="color:#0f766e;font-weight:700">${safe(customerPhone)}</a></td></tr><tr><td style="padding:7px 0;color:#64748b">Address</td><td align="right"><strong>${safe(customerAddress.trim())}</strong></td></tr></table><div style="padding:20px;margin-bottom:24px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:14px"><div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#0f766e">Estimated price per visit</div><div style="margin-top:6px;font-size:29px;font-weight:800;color:#134e4a">${safe(money(estimate.estimateLow, pricing.currency))} – ${safe(money(estimate.estimateHigh, pricing.currency))}</div>${estimate.estimatedMonthly !== null ? `<div style="margin-top:7px;color:#475569">Estimated monthly: <strong>${safe(money(estimate.estimatedMonthly, pricing.currency))}</strong></div>` : ""}</div>
        <h2 style="font-size:17px">Service overview</h2><table role="presentation" width="100%" style="margin-bottom:24px;font-size:14px"><tr><td style="padding:7px 0;color:#64748b">Property</td><td align="right" style="font-weight:700;text-transform:capitalize">${safe(propertyType)}</td></tr><tr><td style="padding:7px 0;color:#64748b">Cleaning type</td><td align="right"><strong>${safe(pricing.levels[cleaningLevel as CleaningLevel].label)}</strong></td></tr><tr><td style="padding:7px 0;color:#64748b">Frequency</td><td align="right"><strong>${safe(pricing.frequencies[frequency as Frequency].label)}</strong></td></tr>${propertyType === "commercial" ? `<tr><td style="padding:7px 0;color:#64748b">Approximate area</td><td align="right"><strong>${safe(Number(squareFeet).toLocaleString("en-US"))} sq ft</strong></td></tr>` : ""}</table>
        <h2 style="font-size:17px">Spaces</h2><table role="presentation" width="100%" style="margin-bottom:24px;font-size:14px">${spaceRows}</table><h2 style="font-size:17px">Selected extras</h2><table role="presentation" width="100%" style="margin-bottom:24px;font-size:14px">${extrasRows}</table>
        <h2 style="font-size:17px">Price breakdown</h2><table role="presentation" width="100%" style="font-size:14px"><tr><td style="padding:7px 0;color:#64748b">Base service</td><td align="right"><strong>${safe(money(estimate.subtotal, pricing.currency))}</strong></td></tr><tr><td style="padding:7px 0;color:#64748b">Cleaning-level adjustment</td><td align="right"><strong>${safe(money(estimate.levelAdjustment, pricing.currency))}</strong></td></tr><tr><td style="padding:7px 0;color:#64748b">Recurring discount</td><td align="right" style="color:#047857"><strong>−${safe(money(estimate.recurringDiscount, pricing.currency))}</strong></td></tr><tr><td style="padding:7px 0;color:#64748b">Extras</td><td align="right"><strong>${safe(money(estimate.extrasTotal, pricing.currency))}</strong></td></tr><tr><td style="padding-top:14px;border-top:2px solid #cbd5e1;font-size:16px;font-weight:800">Calculated estimate</td><td align="right" style="padding-top:14px;border-top:2px solid #cbd5e1;font-size:18px;font-weight:800;color:#0f766e">${safe(money(estimate.estimatedPrice, pricing.currency))}</td></tr></table><p style="margin:26px 0 0;padding:14px;background:#f8fafc;border-radius:10px;color:#64748b;font-size:12px;line-height:1.5">This online estimate should be confirmed after reviewing property condition, access, location, and special requests.</p></td></tr><tr><td style="padding:17px;background:#0f172a;color:#94a3b8;font-size:12px;text-align:center">Quote generated from the ${safe(company)} website.</td></tr></table></td></tr></table></body></html>`;

    try {
      const response = await fetch(EMAIL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": EMAIL_API_KEY,
        },
        body: JSON.stringify({
          to,
          cc: recipientEmails.length > 1 ? recipientEmails.slice(1) : undefined,
          subject: `New exact cleaning quote request — ${company}`,
          body,
          companyName: company,
          logo: logoUrl || undefined,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          result?.msg || "Unable to send the quote request right now.",
        );
      window.dispatchEvent(
        new CustomEvent("cleaning-quote-request", { detail: estimate }),
      );

      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setCustomerAddress("");
      setPropertyType("");
      setCleaningLevel("");
      setFrequency("");
      setResidentialSpaces({});
      setCommercialSpaces({});
      setSquareFeet("");
      setAddOns({});
      setSendStatus(null);
      setSendMessage("");

      await Swal.fire({
        icon: "success",
        title: "Quote request sent!",
        html: `Thank you for choosing <strong>${safe(company)}</strong>.<br>We received your cleaning details and will contact you shortly with your exact quote.`,
        confirmButtonText: "Done",
        confirmButtonColor: "#0f766e",
        background: "#ffffff",
        color: "#0f172a",
        customClass: {
          popup: "rounded-3xl",
          confirmButton: "rounded-xl px-6 py-3 font-bold",
        },
      });
    } catch (error) {
      setSendStatus("error");
      setSendMessage(
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };
  const switchPropertyType = (type: PropertyType) => {
    setPropertyType(type);
    setAddOns({});
  };

  return (
    <section className="bg-slate-50 px-4 py-12 font-sans text-slate-700 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 max-w-2xl">
          <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-800">
            Free instant estimate
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            How much will your cleaning cost?
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Tell us about your space and get a quick estimated price in less
            than a minute.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <SectionTitle number={1}>Your contact information</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Full name
                  </span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Email address
                  </span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    autoComplete="email"
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Phone number
                  </span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(event) =>
                      setCustomerPhone(formatPhone(event.target.value))
                    }
                    onKeyDown={(event) => {
                      if (
                        event.ctrlKey ||
                        event.metaKey ||
                        [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                          "Home",
                          "End",
                        ].includes(event.key)
                      )
                        return;
                      if (!/^\d$/.test(event.key)) event.preventDefault();
                    }}
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={12}
                    placeholder="000-000-0000"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Service address
                  </span>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(event) => setCustomerAddress(event.target.value)}
                    autoComplete="street-address"
                    placeholder="Enter the complete address"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                  />
                </label>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <SectionTitle number={2}>
                What type of property is it?
              </SectionTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["residential", "commercial"] as PropertyType[]).map(
                  (type) => {
                    const active = propertyType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => switchPropertyType(type)}
                        aria-pressed={active}
                        className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-teal-600 bg-teal-50 ring-2 ring-teal-600/10"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span>
                          <span className="block font-bold capitalize text-slate-950">
                            {type}
                          </span>
                          <span className="mt-1 block text-xs text-slate-500">
                            {type === "residential"
                              ? "House, apartment, or condo"
                              : "Office, retail, or business space"}
                          </span>
                        </span>
                        <span
                          className={`grid h-6 w-6 place-items-center rounded-full ${
                            active
                              ? "bg-teal-600 text-white"
                              : "border border-slate-300 text-transparent"
                          }`}
                        >
                          <CheckIcon />
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <SectionTitle number={3}>Choose your cleaning plan</SectionTitle>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Cleaning type
                  </span>
                  <select
                    value={cleaningLevel}
                    onChange={(event) =>
                      setCleaningLevel(event.target.value as CleaningLevel)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                  >
                    <option value="" disabled>
                      Select a cleaning type
                    </option>
                    {Object.entries(pricing.levels).map(([id, item]) => (
                      <option key={id} value={id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <span className="mt-2 block text-xs leading-5 text-slate-500">
                    {cleaningLevel
                      ? pricing.levels[cleaningLevel].description
                      : "Please select the type of cleaning you need."}
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Frequency
                  </span>
                  <select
                    value={frequency}
                    onChange={(event) =>
                      setFrequency(event.target.value as Frequency)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                  >
                    <option value="" disabled>
                      Select a frequency
                    </option>
                    {Object.entries(pricing.frequencies).map(([id, item]) => (
                      <option key={id} value={id}>
                        {item.label} — {item.description}
                      </option>
                    ))}
                  </select>
                  <span className="mt-2 block text-xs leading-5 text-slate-500">
                    Recurring discounts apply to each scheduled visit.
                  </span>
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <SectionTitle number={4}>
                {propertyType === "residential"
                  ? "Tell us about the rooms"
                  : "Tell us about the business"}
              </SectionTitle>

              {propertyType === "commercial" && (
                <label className="mb-5 block rounded-2xl bg-slate-50 p-4">
                  <span className="mb-2 block text-sm font-semibold text-slate-800">
                    Approximate square feet
                  </span>
                  <div className="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-600/10">
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={squareFeet}
                      onChange={(event) =>
                        setSquareFeet(
                          event.target.value === ""
                            ? ""
                            : Math.max(0, Number(event.target.value)),
                        )
                      }
                      placeholder="Enter square feet"
                      className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-base font-bold text-slate-900 outline-none"
                    />
                    <span className="pr-4 text-sm font-semibold text-slate-500">
                      sq ft
                    </span>
                  </div>
                </label>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                {spaceDefinitions.map((item: SpaceDefinition) => (
                  <Stepper
                    key={item.id}
                    label={item.label}
                    hint={item.hint}
                    value={spaces[item.id] ?? 0}
                    onChange={(value) => updateSpace(item.id, value)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <SectionTitle number={5}>Would you like any extras?</SectionTitle>
              <div className="grid gap-3 md:grid-cols-2">
                {availableAddOns.map((item) => {
                  const selected = (addOns[item.id] ?? 0) > 0;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-4 transition ${
                        selected
                          ? "border-teal-600 bg-teal-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => updateAddOn(item)}
                        className="flex w-full items-start justify-between gap-3 text-left"
                        aria-pressed={selected}
                      >
                        <span>
                          <span className="block font-semibold text-slate-900">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                            {item.hint}
                          </span>
                          <span className="mt-2 block text-sm font-bold text-teal-800">
                            +{money(item.price, pricing.currency)}
                            {item.unit ? ` / ${item.unit}` : ""}
                          </span>
                        </span>
                        <span
                          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                            selected
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          <CheckIcon />
                        </span>
                      </button>

                      {selected && item.unit && (
                        <div className="mt-3 border-t border-teal-200 pt-3">
                          <Stepper
                            label={`Number of ${item.unit}s`}
                            hint={`${money(item.price, pricing.currency)} each`}
                            value={addOns[item.id] ?? 1}
                            onChange={(value) =>
                              setAddOns((current) => ({
                                ...current,
                                [item.id]: value,
                              }))
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10 lg:sticky lg:top-6">
            <p className="text-sm font-semibold text-teal-300">
              Your estimated price
            </p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-4xl font-extrabold tracking-tight">
                {money(estimate.estimateLow, pricing.currency)}–
                {money(estimate.estimateHigh, pricing.currency)}
              </p>
            </div>
            <p className="mt-1 text-sm text-slate-400">per visit</p>

            {estimate.estimatedMonthly !== null && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">
                  Estimated monthly
                </p>
                <p className="mt-1 text-xl font-bold">
                  {money(estimate.estimatedMonthly, pricing.currency)}
                </p>
              </div>
            )}

            <div className="my-6 h-px bg-white/10" />

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Base service</dt>
                <dd className="font-semibold">
                  {money(estimate.subtotal, pricing.currency)}
                </dd>
              </div>
              {cleaningLevel && estimate.levelAdjustment > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">
                    {pricing.levels[cleaningLevel as CleaningLevel].label}
                  </dt>
                  <dd className="font-semibold">
                    +{money(estimate.levelAdjustment, pricing.currency)}
                  </dd>
                </div>
              )}
              {estimate.recurringDiscount > 0 && (
                <div className="flex justify-between gap-4 text-teal-300">
                  <dt>Recurring discount</dt>
                  <dd className="font-semibold">
                    −{money(estimate.recurringDiscount, pricing.currency)}
                  </dd>
                </div>
              )}
              {estimate.extrasTotal > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Selected extras</dt>
                  <dd className="font-semibold">
                    +{money(estimate.extrasTotal, pricing.currency)}
                  </dd>
                </div>
              )}
            </dl>

            <button
              type="button"
              onClick={handleQuoteRequest}
              disabled={isSending || !canRequestQuote}
              className="mt-7 w-full rounded-xl bg-teal-400 px-5 py-3.5 text-sm font-extrabold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-300/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Sending your request..." : quoteButtonLabel}
            </button>

            {!canRequestQuote && (
              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                Complete your contact information, then select the property,
                cleaning type, frequency, and space details.
              </p>
            )}

            {sendStatus && (
              <div
                role="status"
                className={`mt-3 rounded-xl border px-4 py-3 text-sm leading-5 ${sendStatus === "success" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-rose-400/30 bg-rose-400/10 text-rose-200"}`}
              >
                {sendMessage}
              </div>
            )}

            {phoneNumber && (
              <a
                href={`tel:+1${phoneNumber.replace(/[^\d+]/g, "")}`}
                className="mt-3 block text-center text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                Or call {phoneNumber}
              </a>
            )}

            <p className="mt-5 text-xs leading-5 text-slate-500">
              This is an estimate, not a final quote. Final pricing may vary
              based on property condition, access, location, and special
              requests. {businessName} will confirm the price before service.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
