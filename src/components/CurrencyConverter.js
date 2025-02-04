import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FaExchangeAlt, FaSpinner, FaExclamationCircle, FaMoon, FaSun } from "react-icons/fa";

const CurrencyConverter = ({ isDarkMode, setIsDarkMode }) => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState({ value: "USD", label: "USD" });
  const [toCurrency, setToCurrency] = useState({ value: "EUR", label: "EUR" });
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
        const currencyKeys = Object.keys(response.data.rates);
        const currencyOptions = currencyKeys.map((currency) => ({
          value: currency,
          label: currency,
        }));
        setCurrencies(currencyOptions);
      } catch (error) {
        setError("Error fetching currency options.");
      }
    };

    fetchCurrencies();
  }, []);

  // Fetch conversion rates when inputs change
  useEffect(() => {
    const fetchRates = async () => {
      if (!amount || amount <= 0) return;

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`);
        const rate = response.data.rates[toCurrency.value];
        if (rate) {
          setConvertedAmount((amount * rate).toFixed(2));
        } else {
          setError("Invalid currency conversion.");
        }
      } catch (error) {
        setError("Error fetching conversion rate.");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, toCurrency, amount]);

  // Swap currencies
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Custom styles for react-select
  const customSelectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: isDarkMode ? "#1F2937" : "#fff",
      borderColor: state.isFocused ? "#6366f1" : isDarkMode ? "#374151" : "#D1D5DB",
      color: isDarkMode ? "#F9FAFB" : "#111827",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#6366f1" : isDarkMode ? "#4B5563" : "#9CA3AF",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDarkMode ? "#1F2937" : "#fff",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? (isDarkMode ? "#374151" : "#E5E7EB") : "transparent",
      color: isDarkMode ? "#F9FAFB" : "#111827",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDarkMode ? "#F9FAFB" : "#111827",
    }),
  };

  return (
    <div
      className={`rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } flex flex-col h-full`}  // Use flexbox for better layout control
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Currency Converter</h2>
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-300"
          >
            {isDarkMode ? <FaSun className="text-white" /> : <FaMoon className="text-white" />}
          </button> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-grow"> {/* Added flex-grow to take up remaining space */}
        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
            min="1"
          />
        </div>

        {/* Currency Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium mb-2">From:</label>
            <Select
              options={currencies}
              value={fromCurrency}
              onChange={setFromCurrency}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center md:justify-start">
            <button
              onClick={swapCurrencies}
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300"
            >
              <FaExchangeAlt />
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium mb-2">To:</label>
            <Select
              options={currencies}
              value={toCurrency}
              onChange={setToCurrency}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {/* Converted Amount */}
        {loading ? (
          <div className="flex items-center justify-center space-x-2 text-indigo-600">
            <FaSpinner className="animate-spin" />
            <p>Converting...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <FaExclamationCircle />
            <p>{error}</p>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <p className="text-2xl font-semibold">
              Converted Amount:{" "}
              <span className="text-indigo-600">{convertedAmount || "--"}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
