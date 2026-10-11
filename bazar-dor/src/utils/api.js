export function extractArray(response, keys = []) {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(response[key])) {
      return response[key];
    }
  }

  if (response.data && typeof response.data === "object") {
    for (const key of keys) {
      if (Array.isArray(response.data[key])) {
        return response.data[key];
      }
    }
  }

  return [];
}

export function toEnglishDigits(value) {
  const bengaliDigits = "০১২৩৪৫৬৭৮৯";

  return String(value ?? "").replace(/[০-৯]/g, (digit) =>
    String(bengaliDigits.indexOf(digit))
  );
}

export function toNumber(value) {
  const normalized = toEnglishDigits(value)
    .replace(/[,،\s]/g, "")
    .replace(/[^0-9.-]/g, "");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}