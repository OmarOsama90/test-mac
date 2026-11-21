// src/components/CaseModal.js
import React from "react";

function CaseModal({
  selectedCase,
  isEditing,
  form,
  handleChange,
  handleSave,
  closeModal,
  handleEdit,
  handleDelete
}) {
  const [confirming, setConfirming] = React.useState(false);
  if (!selectedCase) return null;

  return (
    <div
className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 transition-opacity duration-150"
      onClick={closeModal}
    >
      <div
        className="bg-white w-[520px] p-6 rounded-xl shadow-md border space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {!isEditing ? (
          <>
            <h2 className="text-xl font-bold border-b pb-2">
              {selectedCase?.customer?.name}
            </h2>

            <div className="space-y-1 text-sm">
              <p><b>Phone:</b> {selectedCase?.customer?.phone}</p>
              <p><b>ID:</b> {selectedCase?.id}</p>
              <p><b>Date:</b> {selectedCase?.visitDate}</p>
            </div>

            <hr />

            <div className="space-y-1 text-sm">
              <p>
                <b>Animal:</b> {selectedCase?.animal?.name} ({selectedCase?.animal?.type} - {selectedCase?.animal?.breed || ""})
              </p>
              <p><b>Age:</b> {selectedCase?.animal?.age}</p>
            </div>

            <hr />

            <div className="space-y-1 text-sm">
              <p><b>Diagnosis:</b> {selectedCase?.medical?.disease}</p>
              <p><b>Symptoms:</b> {selectedCase?.medical?.symptoms}</p>
              <p><b>Treatment:</b> {selectedCase?.medical?.treatment}</p>
              <p>
                <b>Notes:</b>{" "}
                <span
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                  className="break-words"
                >
                  {selectedCase?.medical?.notes || "No notes"}
                </span>
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={handleEdit} className="bg-yellow-400 px-3 py-1 rounded">
                Edit
              </button>

              <button onClick={() => (confirming ? handleDelete(selectedCase.id) : setConfirming(true))} className="bg-red-500 text-white px-3 py-1 rounded">{confirming ? "Click again to confirm" : "Delete"}</button>

              <button onClick={closeModal} className="bg-gray-300 px-3 py-1 rounded">
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold border-b pb-2">Edit Case</h2>

            <input name="id" value={form.id} onChange={handleChange} className="inputSoft w-full mb-2" />
            <input name="customerName" value={form.customerName} onChange={handleChange} className="inputSoft w-full mb-2" />
            <input name="phone" value={form.phone} onChange={handleChange} className="inputSoft w-full mb-2" />
            <input name="animalName" value={form.animalName} onChange={handleChange} className="inputSoft w-full mb-2" />

            <select name="type" value={form.type} onChange={handleChange} className="inputSoft w-full mb-2">
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Fish</option>
              <option>Other</option>
            </select>

            <input name="breed" value={form.breed} onChange={handleChange} className="inputSoft w-full mb-2" />

            <div className="flex gap-2 mb-2">
              <input name="ageYears" value={form.ageYears} onChange={handleChange} className="inputSoft w-1/3" />
              <input name="ageMonths" value={form.ageMonths} onChange={handleChange} className="inputSoft w-1/3" />
              <input name="ageDays" value={form.ageDays} onChange={handleChange} className="inputSoft w-1/3" />
            </div>

            <input name="disease" value={form.disease} onChange={handleChange} className="inputSoft w-full mb-2" />
            <input name="symptoms" value={form.symptoms} onChange={handleChange} className="inputSoft w-full mb-2" />
            <input name="treatment" value={form.treatment} onChange={handleChange} className="inputSoft w-full mb-2" />

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              className="inputSoft w-full mb-2"
            />

            <div className="flex gap-2 mt-2">
              <button onClick={handleSave} className="bg-blue-500 text-white px-3 py-1 rounded">
                Save
              </button>

              <button onClick={closeModal} className="bg-gray-300 px-3 py-1 rounded">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(CaseModal);
