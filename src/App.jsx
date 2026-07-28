import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import logoImg from "./assets/logo.png";

const App = () => {
  // Company & tax year details
  const [company, setCompany] = useState({
    name: "Western Cars Private Hire Ltd",
    address:
      "1, Grosvenor House, Durkins Rd, East Grinstead RH192RW, United Kingdom",
    phone: "01342 300000",
    website: "www.westerncars.co.uk",
  });

  const [taxFrom, setTaxFrom] = useState("2025-04-06");
  const [taxTo, setTaxTo] = useState("2026-04-05");

  // Driver details
  const [driver, setDriver] = useState({
    name: "",
    id: "",
    address: "",
    phone: "",
  });

  // Active tab state
  // Active tab state - default set to "driver"
  const [activeTab, setActiveTab] = useState("driver");

  // UK Tax Year Month Sequence (13 rows)
  const initialMonths = () => {
    const months = [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
      "April",
    ];
    return months.map((m) => ({
      month: m,
      gross: 0,
      commRate: 15, // Commission rate in percentage (e.g. 18 for 18%)
      commAmount: 0, // Calculated monetary commission value
      vatAmount: 0, // Calculated VAT amount
      deduct: 0,
      net: 0,
    }));
  };

  const [months, setMonths] = useState(initialMonths());

  // Dynamic calculations
  const updateMonth = (index, field, value) => {
    const updated = [...months];
    const num = parseFloat(value);
    const val = isNaN(num) ? 0 : num;
    updated[index][field] = val;

    if (field === "gross" || field === "commRate" || field === "deduct" || field === "vat") {
      const g = updated[index].gross || 0;
      const rate = 15 || 0;
      const d = updated[index].deduct || 0;
      const v = 3 || 0;

      // Calculate monetary commission amount based on percentage
      const calculatedComm = g * (rate / 100);
      updated[index].commAmount = calculatedComm;

      // calculate VAT amount based on percentage
      const calculatedVAT = calculatedComm * (v / 100);
      updated[index].vatAmount = calculatedVAT;

      // Net = Gross - Calculated Commission Amount - Deductions
      updated[index].net = Math.max(0, g - (calculatedComm + calculatedVAT));
    }
    setMonths(updated);
  };

  const updateMonthDate = (index, value) => {
    const updated = [...months];
    updated[index].date = value;
    setMonths(updated);
  };

  const totals = months.reduce(
    (acc, m) => {
      acc.gross += m.gross || 0;
      acc.commAmount += m.commAmount || 0;
      acc.deduct += m.deduct || 0;
      acc.vatAmount += m.vatAmount || 0;
      acc.net += m.net || 0;
      return acc;
    },
    { gross: 0, commAmount: 0, deduct: 0, vatAmount: 0, net: 0 },
  );

  const fmt = (val) => (val ?? 0).toFixed(2);

  // PDF Export
  const pdfRef = useRef(null);
  const generatePDF = () => {
    const element = pdfRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `IncomeStatement_${driver.name || "driver"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Driver Statement Generator
                </h1>
                <p className="text-xs text-gray-500">
                  Western Cars Private Hire Ltd
                </p>
              </div>
            </div>
            <button
              onClick={generatePDF}
              className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generate PDF
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Gross</p>
                <p className="text-2xl font-bold text-gray-800">
                  £{fmt(totals.gross)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Commission</p>
                <p className="text-2xl font-bold text-gray-800">
                  £{fmt(totals.commAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Deductions</p>
                <p className="text-2xl font-bold text-gray-800">
                  £{fmt(totals.deduct)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 12H4"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Net Earnings
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  £{fmt(totals.net)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar with Forms */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("company")}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "company"
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Company
                </button>
                <button
                  onClick={() => setActiveTab("driver")}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === "driver"
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Driver
                </button>
              </div>
              <div className="p-5">
                {activeTab === "company" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Company Information
                    </h3>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={company.name}
                        onChange={(e) =>
                          setCompany({ ...company, name: e.target.value })
                        }
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        value={company.address}
                        onChange={(e) =>
                          setCompany({ ...company, address: e.target.value })
                        }
                        rows="3"
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={company.phone}
                          onChange={(e) =>
                            setCompany({ ...company, phone: e.target.value })
                          }
                          className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="text"
                          value={company.website}
                          onChange={(e) =>
                            setCompany({ ...company, website: e.target.value })
                          }
                          className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "driver" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Driver Details & Tax Period
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tax From
                        </label>
                        <input
                          type="date"
                          value={taxFrom}
                          onChange={(e) => setTaxFrom(e.target.value)}
                          className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tax To
                        </label>
                        <input
                          type="date"
                          value={taxTo}
                          onChange={(e) => setTaxTo(e.target.value)}
                          className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Driver Name
                      </label>
                      <input
                        type="text"
                        value={driver.name}
                        onChange={(e) =>
                          setDriver({ ...driver, name: e.target.value })
                        }
                        placeholder="Enter driver name"
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Driver ID
                      </label>
                      <input
                        type="text"
                        value={driver.id}
                        onChange={(e) =>
                          setDriver({ ...driver, id: e.target.value })
                        }
                        placeholder="Enter driver ID"
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        value={driver.address}
                        onChange={(e) =>
                          setDriver({ ...driver, address: e.target.value })
                        }
                        rows="2"
                        placeholder="Enter address"
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={driver.phone}
                        onChange={(e) =>
                          setDriver({ ...driver, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                        className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Income Entries Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Income Entries
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Gross (£)
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Comm. (%)
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        VAT. (3%) (£)
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Net (£)
                      </th>
                    
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {months.map((m, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-blue-50 transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-2.5">
                          <span className="text-sm font-medium text-gray-900">
                            {m.month}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={m.gross || ""}
                            onChange={(e) =>
                              updateMonth(idx, "gross", e.target.value)
                            }
                            className="w-24 border border-gray-300 p-2 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="relative inline-block w-24">
                            <input
                              type="number"
                              step="0.1"
                              placeholder="0"
                              value={m.commRate || ""}
                              onChange={(e) =>
                                updateMonth(idx, "commRate", e.target.value)
                              }
                              className="w-full border border-gray-300 p-2 pr-6 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <span className="absolute right-2 top-2 text-xs text-gray-500 font-bold">
                              %
                            </span>
                          </div>
                          {m.commAmount > 0 && (
                            <div className="text-[10px] text-gray-500 text-right mt-0.5">
                              (£{fmt(m.commAmount)})
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={fmt(m.vatAmount)|| ""}
                            onChange={(e) =>
                              updateMonth(idx, "vatAmount", e.target.value)
                            }
                            className="w-24 border border-gray-300 p-2 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="text-sm font-semibold text-blue-600">
                            £{fmt(m.net)}
                          </span>
                        </td>
                       
                      </tr>
                    ))}
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">
                      <td className="px-4 py-3 text-sm">TOTAL</td>
                      <td className="px-4 py-3 text-sm text-right">
                        £{fmt(totals.gross)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        £{fmt(totals.commAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        £{fmt(totals.vatAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        £{fmt(totals.net)}
                      </td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden PDF Template with Fixed Spacing & Alignment */}
      <div className="hidden">
        <div
          ref={pdfRef}
          style={{
            width: "7.0in",
            fontFamily: "Arial, sans-serif",
            color: "#000000",
            fontSize: "10pt",
            lineHeight: "1.4",
            backgroundColor: "#ffffff",
            padding: "10px",
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ width: "40%", textAlign: "right" }}>
              <img
                src={logoImg}
                alt="Logo"
                style={{ width: "3.5cm", height: "auto", objectFit: "contain" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div style={{ width: "60%" }}>
              <div style={{ fontSize: "16pt", fontWeight: "bold" }}>
                {company.name}
              </div>
              <div
                style={{ marginTop: "4px", fontSize: "9pt", lineHeight: "1.4" }}
              >
                {company.address} <br />
                Tel: {company.phone} <br />
                {company.website}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "15px 0 15px 0" }}>
            <span style={{ fontSize: "16pt", fontWeight: "bold" }}>
              Annual Driver Income Statement
            </span>
          </div>

          {/* Company and Driver Information */}
          <div style={{ marginBottom: "15px" }}>
            <table
              style={{
                width: "100%",
                fontSize: "9.5pt",
                borderCollapse: "collapse",
                lineHeight: "1.5",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      fontWeight: "bold",
                      width: "110px",
                      padding: "3px 0",
                    }}
                  >
                    Tax Year:
                  </td>
                  <td style={{ padding: "3px 0" }}>
                    From {taxFrom || "________________"} To{" "}
                    {taxTo || "________________"}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "3px 0" }}>
                    Driver Name:
                  </td>
                  <td style={{ padding: "3px 0" }}>
                    {driver.name || "________________________"}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "3px 0" }}>
                    Driver ID:
                  </td>
                  <td style={{ padding: "3px 0" }}>
                    {driver.id || "________________________"}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "3px 0" }}>
                    Address:
                  </td>
                  <td style={{ padding: "3px 0" }}>
                    {driver.address || "________________________"}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold", padding: "3px 0" }}>
                    Phone:
                  </td>
                  <td style={{ padding: "3px 0" }}>
                    {driver.phone || "________________________"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Income Breakdown Table */}
          <div style={{ marginBottom: "20px" }}>
            <h3
              style={{
                fontSize: "11pt",
                fontWeight: "bold",
                margin: "0 0 6px 0",
              }}
            >
              Income Breakdown
            </h3>
            <table
              style={{
                width: "100%",
                fontSize: "9.5pt",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e5e7eb",
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  <th style={{ padding: "6px 8px", textAlign: "left" }}>
                    Month
                  </th>
                  <th style={{ padding: "6px 8px", textAlign: "right" }}>
                    Gross (£)
                  </th>
                  <th style={{ padding: "6px 8px", textAlign: "right" }}>
                    Comm. (£)
                  </th>
                  <th style={{ padding: "6px 8px", textAlign: "right" }}>
                    VAT. (£)
                  </th>
                  <th style={{ padding: "6px 8px", textAlign: "right" }}>
                    Net (£)
                  </th>
                </tr>
              </thead>
              <tbody>
                {months.map((m, idx) => (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#f9fafb" : "#ffffff",
                    }}
                  >
                    <td style={{ padding: "5px 8px", lineHeight: "1.4" }}>
                      {m.month}
                    </td>
                    <td
                      style={{
                        padding: "5px 8px",
                        textAlign: "right",
                        lineHeight: "1.4",
                      }}
                    >
                      {m.gross ? fmt(m.gross) : ""}
                    </td>
                    <td
                      style={{
                        padding: "5px 8px",
                        textAlign: "right",
                        lineHeight: "1.4",
                      }}
                    >
                      {m.commAmount
                        ? `${fmt(m.commAmount)} (${m.commRate}%)`
                        : ""}
                    </td>
                    <td
                      style={{
                        padding: "5px 8px",
                        textAlign: "right",
                        lineHeight: "1.4",
                      }}
                    >
                      {m.vatAmount ? fmt(m.vatAmount) : ""}
                    </td>
                    <td
                      style={{
                        padding: "5px 8px",
                        textAlign: "right",
                        lineHeight: "1.4",
                      }}
                    >
                      {m.net ? fmt(m.net) : ""}
                    </td>
                 
                  </tr>
                ))}
                <tr
                  style={{
                    backgroundColor: "#e5e7eb",
                    borderTop: "1px solid #000",
                    borderBottom: "1px solid #000",
                    fontWeight: "bold",
                  }}
                >
                  <td style={{ padding: "6px 8px" }}>TOTAL</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>
                    {fmt(totals.gross)}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>
                    {fmt(totals.commAmount)}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>
                    {fmt(totals.vatAmount)}
                  </td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>
                    {fmt(totals.net)}
                  </td>
                  <td style={{ padding: "6px 8px" }}></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div>
            <h3
              style={{
                fontSize: "11pt",
                fontWeight: "bold",
                margin: "0 0 6px 0",
              }}
            >
              Summary
            </h3>
            <table
              style={{
                width: "320px",
                fontSize: "9.5pt",
                borderCollapse: "collapse",
                lineHeight: "1.6",
              }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: "4px 0" }}>Total Gross Earnings:</td>
                  <td style={{ textAlign: "right", padding: "4px 0" }}>
                    £ {fmt(totals.gross)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0" }}>
                    Total Company Commission:
                  </td>
                  <td style={{ textAlign: "right", padding: "4px 0" }}>
                    £ {fmt(totals.commAmount)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0" }}>Total VAT:</td>
                  <td style={{ textAlign: "right", padding: "4px 0" }}>
                    £ {fmt(totals.vatAmount)}
                  </td>
                </tr>
                <tr
                  style={{
                    borderTop: "1px solid #000",
                    fontWeight: "bold",
                  }}
                >
                  <td style={{ padding: "6px 0" }}>Total Net Earnings:</td>
                  <td style={{ textAlign: "right", padding: "6px 0" }}>
                    £ {fmt(totals.net)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
