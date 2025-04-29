// src/hooks/useFormSubmit.ts
import { useState } from "react";

export function useFormSubmit<T extends Record<string, any>>(formType: string) {
  const [formData, setFormData] = useState<T>({} as T);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const payload = {
      formType,
      dataJson: JSON.stringify(formData),
      submittedByUserId: userId,
    };

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
