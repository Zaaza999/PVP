export function formatApplicationGroupName(groupName: string): string {
  const translations: Record<string, string> = {
    "Billing and finance": "Atsiskaitymai ir finansai",
    "Property and residency": "Nuosavybė ir gyvenamoji vieta",
    "Container management": "Konteinerių valdymas",
    "Personal Data / Account Updates": "Asmens duomenys / Paskyros atnaujinimai",
    "Unknown": "Nežinoma"
  };

  return translations[groupName] || groupName;
}
