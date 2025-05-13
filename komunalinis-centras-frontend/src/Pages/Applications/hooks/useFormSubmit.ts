import { useState } from "react";

export function useFormSubmit<T extends Record<string, any>>(formType: string) {
  const [formData, setFormData] = useState<T>({} as T);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("No user ID found. Please login again.");
      return;
    }

    // Ensure numeric conversion with fallback to undefined
    const parseIfNumeric = (value: any) => {
      if (value === "" || value === undefined) return undefined;
      const num = parseFloat(value);
      return isNaN(num) ? undefined : num;
    };

    const parsedData = {
      ...formData,
      area: parseIfNumeric(formData.area),
      initialWaterReading: parseIfNumeric(formData.initialWaterReading),
      initialElectricityReading: parseIfNumeric(formData.initialElectricityReading),
      paymentAmount: parseIfNumeric(formData.paymentAmount),
      containerVolumeLiters: parseIfNumeric(formData.containerVolumeLiters),
      emptyingFrequencyPerYear: parseIfNumeric(formData.emptyingFrequencyPerYear),
      frequencyPerMonth : parseIfNumeric(formData.frequencyPerMonth ),
      currentCapacityLiters : parseIfNumeric(formData.currentCapacityLiters),
      newCapacityLiters : parseIfNumeric(formData.newCapacityLiters ),
      registeredArea : parseIfNumeric(formData.registeredArea ), 
      entries: (formData.entries || []).map((entry: any) => ({
        ...entry,
        registeredArea: parseIfNumeric(entry.registeredArea),
        actualArea: parseIfNumeric(entry.actualArea),
      })),
      submittedByUserId: userId,
    };


    const payload = {
      formType,
      data: parsedData,
    };

    console.log(payload);

    try {
      const response = await fetch("http://localhost:5190/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server rejected submission:", errorText);
        alert("Form submission failed. Check your data.");
        return;
      }

      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Unexpected error during submission.");
    }
  };



  return { formData, setFormData, handleChange, handleSubmit };
}
