import { useState, useEffect, useRef, useMemo } from "react";
import { icons } from "./constants";
import { useFormState } from "./hooks/useFormState";
import CaseCard from "./components/CaseCard";
import CaseModal from "./components/CaseModal";
import CaseForm from "./components/CaseForm";
import { getCases, saveCases, exportBackup } from "./utils/storage";

const numericId = (id) => parseInt(String(id || "").includes("-") ? id.split("-")[1] : id, 10) || 0;

function App() {
  const fileRef = useRef(null);
  const loadedRef = useRef(null);
  const [cases, setCases] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [message, setMessage] = useState(null);
  const [view, setView] = useState("home");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterId, setFilterId] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const { form, setForm, isEditing, setIsEditing, selectedCase, setSelectedCase, handleChange, resetForm } = useFormState();
  const notify = (text, type = "success") => setMessage({ text, type });

  useEffect(() => {
    Object.values(icons).forEach((src) => { new Image().src = src; });
    getCases()
      .then((data) => { loadedRef.current = data; setCases(data); setLoaded(true); })
      .catch(() => setLoadError(true));
  }, []);

  // Autosave only after a successful load, so an empty list can never overwrite saved data.
  useEffect(() => {
    if (!loaded || cases === loadedRef.current) return;
    const t = setTimeout(() => {
      saveCases(cases).catch(() => setMessage({ text: "❌ Could not save to disk", type: "error" }));
    }, 300);
    return () => clearTimeout(t);
  }, [cases, loaded]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 220);
    return () => clearTimeout(t);
  }, [search]);

  const generateId = () => {
    const year = new Date().getFullYear();
    const nums = cases.map((c) => c.id).filter((id) => /^\d{4}-\d+$/.test(id)).map((id) => parseInt(id.split("-")[1], 10));
    return `${year}-${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(4, "0")}`;
  };

  const handleSave = () => {
    if (!form.customerName.trim() || !form.phone.trim()) return notify("❌ Name & phone are required", "error");
    const editingSame = (c) => isEditing && selectedCase && c.id === selectedCase.id;
    if (form.id && cases.some((c) => c.id === form.id && !editingSame(c))) return notify("❌ ID already exists", "error");

    const newData = {
      id: form.id || generateId(),
      isManualId: isEditing && selectedCase && form.id === selectedCase.id ? !!selectedCase.isManualId : !!form.id,
      customer: { name: form.customerName.trim(), phone: form.phone.trim() },
      animal: { name: form.animalName, type: form.type, breed: form.breed, age: `${form.ageYears || 0}y ${form.ageMonths || 0}m ${form.ageDays || 0}d` },
      visitDate: form.visitDate,
      medical: { disease: form.disease, symptoms: form.symptoms, treatment: form.treatment, notes: form.notes },
    };

    if (isEditing && selectedCase) {
      setCases((prev) => prev.map((c) => (c.id === selectedCase.id ? newData : c)));
      notify("✅ Case updated");
    } else {
      setCases((prev) => [...prev, newData]);
      notify("✅ Case added");
    }
    resetForm(); setIsEditing(false); setSelectedCase(null); setView("cases");
  };

  const openModal = (c) => { setSelectedCase(c); setIsEditing(false); };
  const closeModal = () => { setSelectedCase(null); setIsEditing(false); resetForm(); };

  const handleEdit = () => {
    if (!selectedCase) return;
    const c = selectedCase;
    const [y = "", m = "", d = ""] = (c.animal.age || "").split(" ").map((p) => p.replace(/[ymd]/, ""));
    setForm({
      id: c.id, customerName: c.customer.name, phone: c.customer.phone,
      animalName: c.animal.name, type: c.animal.type, breed: c.animal.breed,
      ageYears: y, ageMonths: m, ageDays: d, visitDate: c.visitDate,
      disease: c.medical.disease, symptoms: c.medical.symptoms, treatment: c.medical.treatment, notes: c.medical.notes,
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => { setCases((prev) => prev.filter((c) => c.id !== id)); closeModal(); notify("🗑️ Case deleted"); };

  const handleExport = async () => {
    try { if (await exportBackup(cases)) notify("✅ Backup saved"); }
    catch { notify("❌ Backup failed", "error"); }
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) return notify("❌ File format must be a list of cases", "error");
        if (!imported.every((c) => c.id && c.customer?.name && c.customer?.phone)) return notify("❌ Invalid case structure", "error");
        const have = new Set(cases.map((c) => c.id));
        const fresh = imported.filter((c) => !have.has(c.id));
        setCases((prev) => [...prev, ...fresh]);
        notify(`✅ Imported ${fresh.length} case(s), skipped ${imported.length - fresh.length} duplicate(s)`);
      } catch { notify("❌ Corrupted or invalid JSON file", "error"); }
    };
    reader.onerror = () => notify("❌ Failed to read file", "error");
    reader.readAsText(file);
  };

  const handleRemoveDuplicates = () => {
    setCases(Array.from(new Map(cases.map((c) => [c.id, c])).values()));
    notify("✅ Duplicates removed");
  };

  const filteredCases = useMemo(() => {
    const s = debouncedSearch.toLowerCase(), id = filterId.toLowerCase(), ph = filterPhone.toLowerCase();
    return cases
      .filter((c) => {
        const text = `${c.customer?.name || ""} ${c.animal?.name || ""} ${c.id || ""}`.toLowerCase();
        return text.includes(s) && c.id.toLowerCase().includes(id) &&
          (c.customer.phone || "").toLowerCase().includes(ph) && (filterDate === "" || c.visitDate === filterDate);
      })
      .sort((a, b) => numericId(b.id) - numericId(a.id));
  }, [cases, debouncedSearch, filterId, filterPhone, filterDate]);

  return (
    <div className="relative min-h-screen">
      {message && (
        <div className={`fixed top-5 right-5 px-4 py-2 rounded shadow z-50 text-white ${message.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {message.text}
        </div>
      )}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-teal-50 via-white to-amber-50" />

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {loadError && (
            <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl mb-4">
              Saved data could not be read, so saving is turned off to protect your file. Close the app and contact support. Nothing was changed on disk.
            </div>
          )}
          <div className="bg-white p-5 rounded-2xl shadow mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Highness Vet Clinic</h1>
            <div className="flex gap-2">
              <button onClick={() => setView("home")} className="btn">New Case</button>
              <button onClick={() => setView("cases")} className="btn">Cases ({cases.length})</button>
            </div>
          </div>

          {view === "home" && <CaseForm form={form} handleChange={handleChange} handleSave={handleSave} />}

          {view === "cases" && (
            <>
              <div className="flex gap-3 mb-4">
                <button onClick={handleExport} className="bg-green-500 text-white px-4 py-2 rounded-xl">Backup</button>
                <button onClick={() => fileRef.current?.click()} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Import</button>
                <input type="file" hidden ref={fileRef} accept=".json,application/json"
                  onChange={(e) => { if (e.target.files?.[0]) handleImport(e.target.files[0]); e.target.value = ""; }} />
                <button onClick={handleRemoveDuplicates} className="bg-yellow-400 px-4 py-2 rounded-xl">Clean</button>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <input className="inputSoft" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <input className="inputSoft" placeholder="ID" value={filterId} onChange={(e) => setFilterId(e.target.value)} />
                <input className="inputSoft" placeholder="Phone" value={filterPhone} onChange={(e) => setFilterPhone(e.target.value)} />
                <input className="inputSoft" type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>
              {filteredCases.length === 0 && <p className="text-gray-500 py-10 text-center">No cases yet.</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredCases.map((c) => (
                  <CaseCard key={c.id} c={c} openModal={openModal} icon={icons[c.animal.type] || icons.Other} />
                ))}
              </div>
            </>
          )}

          {selectedCase && (
            <CaseModal selectedCase={selectedCase} isEditing={isEditing} form={form} handleChange={handleChange}
              handleSave={handleSave} handleEdit={handleEdit} handleDelete={handleDelete} closeModal={closeModal} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
