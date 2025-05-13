export const getFormTitle = (formType: string): string => {
  const titles: Record<string, string> = {
    wastefeeexemption: "Prašymas – Atleidimas nuo vietinės rinkliavos (fiziniams asmenims)",
    wastefeeexemptionbusiness: "Prašymas – Atleidimas nuo vietinės rinkliavos (juridiniams asmenims)",
    emailinvoicerequest: "Prašymas – Sąskaitų gavimas el. paštu",
    propertyunsuitability: "Prašymas – Pripažinti NT netinkamu naudoti",
    propertyusagedeclaration: "Deklaracija – NT faktinio naudojimo deklaravimas",
    residentcountdeclaration: "Deklaracija – Gyventojų skaičiaus deklaravimas",
    containerrequest: "Prašymas – Konteinerio suteikimas",
    containerfrequencychange: "Prašymas – Konteinerio ištuštinimo dažnumo keitimas",
    containersizechangerequest: "Prašymas – Konteinerio dydžio keitimas",
    refundrequest: "Prašymas – Permokėtos vietinės rinkliavos grąžinimas",
    payerdatachangerequest: "Prašymas – Vietinės rinkliavos mokėtojo duomenų keitimas"
  };

  return titles[formType.toLowerCase()] || `Nežinoma forma (${formType})`;
};
