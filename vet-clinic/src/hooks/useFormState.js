// src/hooks/useFormState.js
import { useState } from "react";
import { emptyForm } from "../constants";

export function useFormState(initialCases) {
  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (!/^\+?[0-9]{0,15}$/.test(value)) return;
    }
    if (name === "notes") {
      const lines = value.split("\n");
      if (lines.length > 4) return;
    }
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => setForm(emptyForm);

  return {
    form,
    setForm,
    isEditing,
    setIsEditing,
    selectedCase,
    setSelectedCase,
    handleChange,
    resetForm
  };
}
