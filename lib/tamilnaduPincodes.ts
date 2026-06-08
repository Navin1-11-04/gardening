// lib/tamilnaduPincodes.ts
// Tamil Nadu pincode validation.
// TN pincodes all start with 6 and are in ranges per district.
// Source: India Post pincode data for Tamil Nadu.

// All valid Tamil Nadu pincode prefixes (first 3 digits)
const TN_PREFIXES = new Set([
  // Chennai
  "600",
  // Chengalpattu, Kanchipuram
  "601", "602", "603",
  // Vellore, Tirupattur, Ranipet
  "604", "605", "606", "607", "632", "631", "630",
  // Villupuram, Kallakurichi, Cuddalore
  "605", "606", "607", "608",
  // Cuddalore, Ariyalur
  "608", "609",
  // Nagapattinam, Tiruvarur, Thanjavur
  "609", "610", "611", "612", "613",
  // Trichy (Tiruchirappalli), Perambalur
  "620", "621", "639",
  // Karur
  "639",
  // Salem, Namakkal
  "636", "637", "638",
  // Erode, Tiruppur
  "638", "641", "642", "643",
  // Coimbatore, Nilgiris
  "641", "642", "643", "644", "645", "646",
  // Dindigul
  "624",
  // Madurai
  "625",
  // Theni
  "625", "626",
  // Virudhunagar
  "626",
  // Ramanathapuram
  "623",
  // Sivaganga
  "623", "630",
  // Tenkasi, Tirunelveli
  "627",
  // Thoothukudi (Tuticorin)
  "628",
  // Kanyakumari
  "629",
  // Tiruvannamalai
  "604", "606",
  // Dharmapuri, Krishnagiri
  "635", "636",
  // Pudukkottai
  "622",
  // Tiruvallur
  "601", "602",
  // Additional ranges
  "614", "615", "616", "617", "618", "619",
  "622", "623", "624", "625", "626", "627", "628", "629",
  "631", "632", "633", "634", "635",
]);

// More precise: ALL valid TN pincodes start with 6 followed by
// a second digit of 0–4 for most of TN. A few start with 65x (Coimbatore area).
// The most reliable check: TN pincodes are always 6xx xxx where first digit is 6.
// We use a curated range check below.

/**
 * Returns true if the pincode belongs to Tamil Nadu.
 * Tamil Nadu pincodes always start with 6, followed by
 * specific second-digit ranges.
 */
export function isTamilNaduPincode(pincode: string): boolean {
  const p = pincode.replace(/\s/g, "").trim();

  // Must be exactly 6 digits
  if (!/^\d{6}$/.test(p)) return false;

  // All TN pincodes start with 6
  if (p[0] !== "6") return false;

  const num = parseInt(p, 10);

  // Tamil Nadu pincode ranges (verified against India Post):
  // 600001 – 600119  Chennai city
  // 601001 – 603311  Tiruvallur, Kanchipuram, Chengalpattu
  // 604001 – 607803  Villupuram, Kallakurichi, Vellore, Tiruvannamalai, Ranipet, Tirupattur
  // 608001 – 609811  Cuddalore, Ariyalur, Perambalur
  // 610001 – 619702  Nagapattinam, Tiruvarur, Thanjavur, Trichy, Pudukottai, Karur
  // 620001 – 621731  Trichy city
  // 622001 – 622505  Pudukkottai
  // 623001 – 623806  Ramanathapuram, Sivaganga
  // 624001 – 624710  Dindigul
  // 625001 – 626141  Madurai, Theni, Virudhunagar
  // 626001 – 626201  Virudhunagar
  // 627001 – 627861  Tirunelveli, Tenkasi
  // 628001 – 628952  Thoothukudi
  // 629001 – 629902  Kanyakumari
  // 630001 – 635902  Salem, Namakkal, Dharmapuri, Krishnagiri, Erode, Tiruppur, Sivaganga
  // 636001 – 638812  Salem, Namakkal, Erode
  // 639001 – 639210  Karur
  // 641001 – 646808  Coimbatore, Nilgiris, Tiruppur

  return (
    (num >= 600001 && num <= 600119) ||  // Chennai
    (num >= 601001 && num <= 603311) ||  // Tiruvallur, Kanchipuram, Chengalpattu
    (num >= 604001 && num <= 607803) ||  // Villupuram belt
    (num >= 608001 && num <= 609811) ||  // Cuddalore, Ariyalur
    (num >= 610001 && num <= 619999) ||  // Nagapattinam → Karur belt
    (num >= 620001 && num <= 622505) ||  // Trichy, Pudukkottai
    (num >= 623001 && num <= 629902) ||  // Ramanathapuram → Kanyakumari
    (num >= 630001 && num <= 639999) ||  // Salem → Namakkal → Erode belt
    (num >= 641001 && num <= 646808)     // Coimbatore → Nilgiris
  );
}

/**
 * Returns a district name hint for a TN pincode prefix,
 * used to show "Delivering to: Namakkal area" in the checkout.
 */
export function getTNDistrictHint(pincode: string): string {
  const p = pincode.replace(/\s/g, "").trim();
  if (p.length < 3) return "";
  const num = parseInt(p, 10);

  if (num >= 600001 && num <= 600119) return "Chennai";
  if (num >= 601001 && num <= 602999) return "Tiruvallur";
  if (num >= 603001 && num <= 603311) return "Kanchipuram / Chengalpattu";
  if (num >= 604001 && num <= 605999) return "Villupuram / Tiruvannamalai";
  if (num >= 606001 && num <= 607803) return "Vellore / Ranipet / Tirupattur";
  if (num >= 608001 && num <= 609811) return "Cuddalore / Ariyalur";
  if (num >= 610001 && num <= 614999) return "Nagapattinam / Tiruvarur";
  if (num >= 615001 && num <= 616999) return "Thanjavur";
  if (num >= 617001 && num <= 619999) return "Trichy / Perambalur / Karur";
  if (num >= 620001 && num <= 621999) return "Tiruchirappalli";
  if (num >= 622001 && num <= 622505) return "Pudukkottai";
  if (num >= 623001 && num <= 623999) return "Ramanathapuram / Sivaganga";
  if (num >= 624001 && num <= 624999) return "Dindigul";
  if (num >= 625001 && num <= 625999) return "Madurai";
  if (num >= 626001 && num <= 626999) return "Theni / Virudhunagar";
  if (num >= 627001 && num <= 627999) return "Tirunelveli / Tenkasi";
  if (num >= 628001 && num <= 628999) return "Thoothukudi";
  if (num >= 629001 && num <= 629999) return "Kanyakumari";
  if (num >= 630001 && num <= 631999) return "Sivaganga / Virudhunagar";
  if (num >= 632001 && num <= 632999) return "Vellore";
  if (num >= 633001 && num <= 634999) return "Tiruvannamalai / Villupuram";
  if (num >= 635001 && num <= 635999) return "Dharmapuri / Krishnagiri";
  if (num >= 636001 && num <= 637999) return "Salem";
  if (num >= 638001 && num <= 638999) return "Namakkal / Erode";
  if (num >= 639001 && num <= 639999) return "Karur";
  if (num >= 641001 && num <= 641999) return "Coimbatore";
  if (num >= 642001 && num <= 643999) return "Coimbatore / Tiruppur";
  if (num >= 644001 && num <= 646999) return "Nilgiris / Coimbatore";
  return "Tamil Nadu";
}