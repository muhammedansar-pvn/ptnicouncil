export const EVENT_DETAILS = {
  name: "SSF PUTHANATHANI SECTOR STUDENT COUNCIL",
  shortName: "SSF Student Council",
  malayalamName: "സ്റ്റുഡന്റ് കൗൺസിൽ",
  organizer: "SSF Puthanathani Sector",
  malayalamOrganizer: "എസ്.എസ്.എഫ് പുത്തനത്താണി സെക്ടർ",
  date: "Friday, November 13, 2026",
  malayalamDate: "2026 നവംബർ 13, വെള്ളി",
  time: "7:00 PM",
  venue: "Irfaa Campus, Vettichira",
  malayalamVenue: "ഇർഫാഅ് ക്യാമ്പസ്, വെട്ടിച്ചിറ",
  tagline: "Be Part of the Council",
  malayalamTagline: "കൗൺസിലിന്റെ ഭാഗമാവുക",
  primaryColor: "#0756A0",
  secondaryColor: "#FFFFFF",
  bgColor: "#F7F9FC",
  textColor: "#172033",
  secondaryTextColor: "#64748B",
  borderColor: "#E5EAF1",
  targetDateISO: "2026-11-13T19:00:00+05:30",
};

export const UNITS = [
  "Cheloor",
  "Karippol",
  "Rabbarkkad",
  "Puthanathani",
  "Vettichira East",
  "Punnathala",
  "Vettichira",
  "Thazkiya Nagar",
  "Keezhmui",
  "Poolamangalam",
  "Mukkilapeedika",
  "Chelakkode",
] as const;

export type UnitType = (typeof UNITS)[number];
