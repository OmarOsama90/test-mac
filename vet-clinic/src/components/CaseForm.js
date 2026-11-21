// src/components/CaseForm.js
import React from "react";

export default function CaseForm({
  form,
  handleChange,
  handleSave
}) {
  return (
    <div className="space-y-4">
      {/* Customer */}
      <div className="bg-white p-4 rounded-xl shadow border">
        <h3 className="font-semibold mb-2">Customer Info</h3>
        <div className="grid grid-cols-2 gap-3">
          <input name="id" placeholder="ID (optional)" value={form.id} onChange={handleChange} className="inputSoft col-span-2" />
          <input name="customerName" placeholder="Name" value={form.customerName} onChange={handleChange} className="inputSoft" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="inputSoft" />
        </div>
      </div>
      {/* Animal */}
      <div className="bg-white p-4 rounded-xl shadow border">
        <h3 className="font-semibold mb-2">Animal Info</h3>
        <div className="grid grid-cols-2 gap-3">
          <input name="animalName" placeholder="Animal Name" value={form.animalName} onChange={handleChange} className="inputSoft" />
          <select name="type" value={form.type} onChange={handleChange} className="inputSoft">
            <option>Dog</option>
            <option>Cat</option>
            <option>Bird</option>
            <option>Fish</option>
            <option>Other</option>
          </select>
          <input name="breed" placeholder="Breed (optional)" value={form.breed} onChange={handleChange} className="inputSoft col-span-2" />
          <input name="ageYears" placeholder="Years" value={form.ageYears} onChange={handleChange} className="inputSoft" />
          <input name="ageMonths" placeholder="Months" value={form.ageMonths} onChange={handleChange} className="inputSoft" />
          <input name="ageDays" placeholder="Days" value={form.ageDays} onChange={handleChange} className="inputSoft" />
          <input type="date" name="visitDate" value={form.visitDate} onChange={handleChange} className="inputSoft col-span-2" />
        </div>
      </div>
      {/* Medical */}
      <div className="bg-white p-4 rounded-xl shadow border">
        <h3 className="font-semibold mb-2">Medical Info</h3>
        <div className="grid gap-3">
          <input name="disease" placeholder="Diagnosis" value={form.disease} onChange={handleChange} className="inputSoft" />
          <input name="symptoms" placeholder="Symptoms" value={form.symptoms} onChange={handleChange} className="inputSoft" />
          <input name="treatment" placeholder="Treatment" value={form.treatment} onChange={handleChange} className="inputSoft" />
          <textarea name="notes" placeholder="Doctor Notes" value={form.notes} onChange={handleChange} className="inputSoft" />
        </div>
      </div>
      <button onClick={handleSave} className="bg-blue-500 text-white px-6 py-2 rounded-xl shadow">Save Case</button>
    </div>
  );
}
