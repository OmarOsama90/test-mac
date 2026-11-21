import React from "react";

function CaseCard({ c, openModal, icon }) {
  return (
    <div
      onClick={() => openModal(c)}
      className="bg-white p-4 rounded-xl shadow border cursor-pointer flex items-center gap-3"
    >
      <img
        src={icon}
        alt="animal"
        className="w-10 h-10 object-contain"
      />

      <div>
        <h4>{c.customer.name}</h4>
        <p>{c.customer.phone}</p>
        <p className="font-bold text-blue-600">{c.id}</p>
      </div>
    </div>
  );
}

export default React.memo(CaseCard);