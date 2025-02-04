import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FaExchangeAlt, FaSpinner, FaExclamationCircle, FaMoon, FaSun } from "react-icons/fa";

const UnitConverter = ({ isDarkMode, setIsDarkMode }) => {
  const [unitCategories, setUnitCategories] = useState([
    { value: "length", label: "Length" },
    { value: "weight", label: "Weight" },
    { value: "volume", label: "Volume" },
    { value: "temperature", label: "Temperature" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(unitCategories[0]);
  const [units, setUnits] = useState([]);
  const [fromUnit, setFromUnit] = useState({ value: "meter", label: "Meter" });
  const [toUnit, setToUnit] = useState({ value: "kilometer", label: "Kilometer" });
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch unit options based on category selection
  useEffect(() => {
    const fetchUnits = () => {
      let unitOptions = [];
      switch (selectedCategory.value) {
        case "length":
          unitOptions = [
            { value: "meter", label: "Meter" },
            { value: "kilometer", label: "Kilometer" },
            { value: "mile", label: "Mile" },
            { value: "yard", label: "Yard" },
          ];
          break;
        case "weight":
          unitOptions = [
            { value: "gram", label: "Gram" },
            { value: "kilogram", label: "Kilogram" },
            { value: "ounce", label: "Ounce" },
            { value: "pound", label: "Pound" },
          ];
          break;
        case "volume":
          unitOptions = [
            { value: "liter", label: "Liter" },
            { value: "milliliter", label: "Milliliter" },
            { value: "gallon", label: "Gallon" },
            { value: "cup", label: "Cup" },
          ];
          break;
        case "temperature":
          unitOptions = [
            { value: "celsius", label: "Celsius" },
            { value: "fahrenheit", label: "Fahrenheit" },
            { value: "kelvin", label: "Kelvin" },
          ];
          break;
        default:
          unitOptions = [];
          break;
      }
      setUnits(unitOptions);
      setFromUnit(unitOptions[0]);
      setToUnit(unitOptions[1]);
    };

    fetchUnits();
  }, [selectedCategory]);

  // Trigger conversion when inputs change
  useEffect(() => {
    convertUnits();
  }, [amount, fromUnit, toUnit, selectedCategory]);

  // Conversion logic
  const convertUnits = () => {
    if (!amount || amount <= 0) {
      setConvertedAmount(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let conversionRate = 1;
      switch (selectedCategory.value) {
        case "length":
          conversionRate = convertLength(fromUnit.value, toUnit.value, amount);
          break;
        case "weight":
          conversionRate = convertWeight(fromUnit.value, toUnit.value, amount);
          break;
        case "volume":
          conversionRate = convertVolume(fromUnit.value, toUnit.value, amount);
          break;
        case "temperature":
          conversionRate = convertTemperature(fromUnit.value, toUnit.value, amount);
          break;
        default:
          setError("Invalid conversion type");
          break;
      }

      setConvertedAmount(conversionRate.toFixed(2));
    } catch (error) {
      setError("Error during conversion");
    } finally {
      setLoading(false);
    }
  };

  const convertLength = (from, to, amount) => {
    const conversions = {
      meter: 1,
      kilometer: 0.001,
      mile: 0.000621371,
      yard: 1.09361,
    };

    return (amount / conversions[from]) * conversions[to];
  };

  const convertWeight = (from, to, amount) => {
    const conversions = {
      gram: 1,
      kilogram: 0.001,
      ounce: 0.035274,
      pound: 0.00220462,
    };

    return (amount / conversions[from]) * conversions[to];
  };

  const convertVolume = (from, to, amount) => {
    const conversions = {
      liter: 1,
      milliliter: 1000,
      gallon: 0.264172,
      cup: 4.22675,
    };

    return (amount / conversions[from]) * conversions[to];
  };

  const convertTemperature = (from, to, amount) => {
    if (from === to) return amount;

    if (from === "celsius") {
      return to === "fahrenheit" ? (amount * 9) / 5 + 32 : amount + 273.15;
    }
    if (from === "fahrenheit") {
      return to === "celsius" ? ((amount - 32) * 5) / 9 : ((amount - 32) * 5) / 9 + 273.15;
    }
    if (from === "kelvin") {
      return to === "celsius" ? amount - 273.15 : ((amount - 273.15) * 9) / 5 + 32;
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
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
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Unit Converter</h2>
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-300"
          >
            {isDarkMode ? <FaSun className="text-white" /> : <FaMoon className="text-white" />}
          </button> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Unit Category Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Category:</label>
          <Select
            options={unitCategories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            styles={customSelectStyles}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {/* Amount Input */}
        <div className="mb-6">
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

        {/* Unit Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* From Unit */}
          <div>
            <label className="block text-sm font-medium mb-2">From:</label>
            <Select
              options={units}
              value={fromUnit}
              onChange={setFromUnit}
              styles={customSelectStyles}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center md:justify-start">
            <button
              onClick={swapUnits}
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300"
            >
              <FaExchangeAlt />
            </button>
          </div>

          {/* To Unit */}
          <div>
            <label className="block text-sm font-medium mb-2">To:</label>
            <Select
              options={units}
              value={toUnit}
              onChange={setToUnit}
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
          <div className="mt-6 text-center">
            <p className="text-2xl font-semibold">
              Converted Unit:{" "}
              <span className="text-indigo-600">{convertedAmount || "--"}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitConverter;