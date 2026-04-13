const PERU_TIME_ZONE = "America/Lima";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const getPeruCalendarDate = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: PERU_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    const values = parts.reduce<Record<string, string>>((accumulator, part) => {
        if (part.type !== "literal") {
            accumulator[part.type] = part.value;
        }

        return accumulator;
    }, {});

    return `${values.year}-${values.month}-${values.day}`;
};

export const parseDateInPeru = (value: string) => {
    if (!value) {
        return null;
    }

    if (DATE_ONLY_PATTERN.test(value)) {
        const [year, month, day] = value.split("-").map(Number);
        if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
            return null;
        }

        return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDateInPeru = (value: string, options: Intl.DateTimeFormatOptions) => {
    const parsed = parseDateInPeru(value);
    if (!parsed) {
        return value;
    }

    return parsed.toLocaleDateString("es-PE", {
        timeZone: PERU_TIME_ZONE,
        ...options,
    });
};
