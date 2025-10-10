function parseToFloat(v) {
  if (v === null || v === undefined) 
    return null;
  
  const s = String(v).trim().replace(",", ".");
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function parseToInteger(v) {
  if (v === null || v === undefined)
    return null;

  const n = Number.parseInt(String(v).trim(), 10);
  return Number.isFinite(n) ? n : null;
}

function parseToBoolean(v) {
  if (v === null || v === undefined) 
    return null;
  
  const s = String(v).trim().toLowerCase();

  if (s === "true" || s === "1") 
    return true;

  if (s === "false" || s === "0") 
    return false;

  return null;
}

export { parseToFloat, parseToInteger, parseToBoolean }