"use client";

import React, { useState } from 'react';

const tables = [
    { id: 1, seats: 4, available: true, x: 20, y: 20 },
    { id: 2, seats: 2, available: false, x: 120, y: 20 },
    { id: 3, seats: 6, available: true, x: 220, y: 20 },
    { id: 4, seats: 4, available: true, x: 20, y: 120 },
    { id: 5, seats: 8, available: false, x: 120, y: 120 },
    { id: 6, seats: 4, available: true, x: 220, y: 120 }
  ];

  const handleTableSelect = (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (table && table.available) {
      setFormData(prev => ({
        ...prev,
        selectedTable: tableId
      }));
    }
  };

export default function PlanSalle() {
    <div className="bg-[#2a2a2a] rounded-xl p-8 shadow-2xl">
    <h2 className="text-2xl font-semibold mb-6">Plan de Salle</h2>
    <div className="relative w-full h-[400px] border-2 border-[#3a3a3a] rounded-lg p-4">
      {tables.map((table) => (
        <div
          key={table.id}
          onClick={() => handleTableSelect(table.id)}
          className={`absolute cursor-pointer transition-transform hover:scale-105 
            ${table.available ? 'bg-green-500/80' : 'bg-red-500/80'}
            ${formData.selectedTable === table.id ? 'ring-4 ring-white' : ''}
          `}
          style={{
            left: `${table.x}px`,
            top: `${table.y}px`,
            width: `${table.seats * 15}px`,
            height: '40px',
            borderRadius: '8px',
          }}
        >
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm whitespace-nowrap">
            {table.seats} pers.
          </div>
        </div>
      ))}
    </div>
    <div className="flex justify-center gap-8 mt-8">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-500/80 rounded"></div>
        <span>Disponible</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-500/80 rounded"></div>
        <span>Occupé</span>
      </div>
    </div>
  </div>
}