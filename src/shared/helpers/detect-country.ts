export const detectCountry = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.startsWith("998")) return "Uzbekistan";
  if (cleanPhone.startsWith("992")) return "Tajikistan";
  if (cleanPhone.startsWith("996")) return "Kyrgyzstan";
  if (cleanPhone.startsWith("90")) return "Turkey";
  if (cleanPhone.startsWith("93") && cleanPhone.length > 10) return "Afghanistan"; // Пример

  if (cleanPhone.startsWith("7")) {
    if (["76", "77", "70"].some(code => cleanPhone.startsWith(code))) {
      return "Kazakhstan";
    }
    return "Russia";
  }

  return "Other";
};