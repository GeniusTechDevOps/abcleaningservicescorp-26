export type PropertyType = "residential" | "commercial";
export type CleaningLevel = "standard" | "deep" | "move" | "construction" | "carpet";
export type Frequency = "once" | "weekly" | "biweekly" | "monthly";

export type SpaceDefinition = {
    id: string;
    label: string;
    hint: string;
    price: number;
};

export type AddOnDefinition = {
    id: string;
    label: string;
    hint: string;
    price: number;
    unit?: string;
};

export type CleaningPricing = {
    currency: string;
    minimums: Record<PropertyType, number>;
    levels: Record<
        CleaningLevel,
        {
            label: string;
            description: string;
            multiplier: number;
        }
    >;
    frequencies: Record<
        Frequency,
        {
            label: string;
            description: string;
            multiplier: number;
            visitsPerMonth: number;
        }
    >;
    residentialSpaces: SpaceDefinition[];
    commercialSpaces: SpaceDefinition[];
    commercialSquareFootRate: number;
    addOns: Record<PropertyType, AddOnDefinition[]>;
    estimateVariance: number;
};

/**
 * Sample US-market pricing.
 * Replace these values with your company's actual rates before publishing.
 */
export const defaultCleaningPricing: CleaningPricing = {
    currency: "USD",
    minimums: {
        residential: 95,
        commercial: 150,
    },
    levels: {
        standard: {
            label: "Standard cleaning",
            description: "Routine cleaning for a regularly maintained property.",
            multiplier: 1,
        },
        deep: {
            label: "Deep cleaning",
            description: "Extra detail for buildup, edges, fixtures, and hard-to-reach areas.",
            multiplier: 1.45,
        },
        move: {
            label: "Move-in / move-out",
            description: "Detailed cleaning for an empty or transitioning property.",
            multiplier: 1.65,
        },
        construction: {
            label: "Post-construction",
            description: "Fine dust and debris cleanup after renovation or construction.",
            multiplier: 1.9,
        },
        carpet: {
            label: "Carpet cleaning",
            description: "Deep cleaning for carpets and rugs.",
            multiplier: 1.3,
        },
    },
    frequencies: {
        once: {
            label: "One-time",
            description: "A single cleaning visit",
            multiplier: 1,
            visitsPerMonth: 1,
        },
        weekly: {
            label: "Weekly",
            description: "Save 18% per visit",
            multiplier: 0.82,
            visitsPerMonth: 4.33,
        },
        biweekly: {
            label: "Every 2 weeks",
            description: "Save 10% per visit",
            multiplier: 0.9,
            visitsPerMonth: 2.17,
        },
        monthly: {
            label: "Monthly",
            description: "Save 5% per visit",
            multiplier: 0.95,
            visitsPerMonth: 1,
        },
    },
    residentialSpaces: [
        { id: "bedroom", label: "Bedroom", hint: "Beds, surfaces, floor", price: 22 },
        { id: "bathroom", label: "Bathroom", hint: "Shower, toilet, sink, floor", price: 38 },
        { id: "kitchen", label: "Kitchen", hint: "Counters, exterior appliances, floor", price: 55 },
        { id: "living", label: "Living room", hint: "Surfaces, furniture area, floor", price: 35 },
        { id: "dining", label: "Dining room", hint: "Table area, surfaces, floor", price: 25 },
        { id: "office", label: "Home office", hint: "Desk area, surfaces, floor", price: 24 },
        { id: "laundry", label: "Laundry room", hint: "Surfaces and floor", price: 22 },
        { id: "basement", label: "Finished basement", hint: "Open finished area", price: 65 },
    ],
    commercialSpaces: [
        { id: "restroom", label: "Restroom", hint: "Fixtures, partitions, floor", price: 30 },
        { id: "breakroom", label: "Break room", hint: "Counters, sink, tables", price: 38 },
        { id: "conference", label: "Conference room", hint: "Table, surfaces, floor", price: 25 },
        { id: "reception", label: "Reception area", hint: "Desk area, seating, floor", price: 28 },
    ],
    commercialSquareFootRate: 0.12,
    addOns: {
        residential: [
            { id: "oven", label: "Inside oven", hint: "Degreasing and interior detail", price: 35 },
            { id: "fridge", label: "Inside refrigerator", hint: "Shelves, drawers, and walls", price: 50 },
            { id: "carpet", label: "Carpet cleaning", hint: "Per area", price: 30, unit: "area" },
            { id: "cabinets", label: "Inside cabinets", hint: "Empty cabinets only", price: 55 },
            { id: "windows", label: "Interior windows", hint: "Per standard window", price: 8, unit: "window" },
            { id: "laundryLoad", label: "Wash & fold", hint: "Per standard load", price: 18, unit: "load" },
            { id: "pet", label: "Pet hair treatment", hint: "Extra vacuuming and hair removal", price: 28 },
        ],
        commercial: [
            { id: "windows", label: "Interior windows", hint: "Per standard window", price: 9, unit: "window" },
            { id: "carpet", label: "Carpet spot treatment", hint: "Light spot treatment per area", price: 30, unit: "area" },
            { id: "appliances", label: "Break-room appliances", hint: "Interior microwave and refrigerator", price: 45 },
            { id: "disinfect", label: "High-touch disinfection", hint: "Handles, switches, and shared surfaces", price: 40 },
        ],
    },
    estimateVariance: 0.08,
};
