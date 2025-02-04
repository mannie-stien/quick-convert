import React, { useState, useEffect } from "react";
import Select from "react-select";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy, FaMoon, FaSun } from "react-icons/fa";

const TimeZoneConverterV2 = ({ isDarkMode}) => {
  const [leftZone, setLeftZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [rightZone, setRightZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [leftTime, setLeftTime] = useState("");
  const [rightTime, setRightTime] = useState("");
  const [timeZones, setTimeZones] = useState([]);
  //   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isDarkModes, setIsDarkMode] = useState(isDarkMode);
  const [copied, setCopied] = useState(false);

  // Fetch supported time zones
  useEffect(() => {
    setTimeZones(
      Intl.supportedValuesOf("timeZone").map((tz) => ({
        value: tz,
        label: tz,
        abbreviation: new Intl.DateTimeFormat("en-US", {
          timeZone: tz,
          timeZoneName: "short",
        })
          .formatToParts()
          .find((part) => part.type === "timeZoneName").value,
      }))
    );
  }, []);

  // Update times every second
  useEffect(() => {
    const updateTimes = () => {
      setLeftTime(getFormattedTime(leftZone, selectedDate));
      setRightTime(getFormattedTime(rightZone, selectedDate));
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [leftZone, rightZone, selectedDate]);

  // Get formatted time for a given time zone and date
  const getFormattedTime = (timeZone, date) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    //   second: "2-digit",
      hour12: true,
    }).format(date);
  };

  // Calculate time difference between two time zones
  const getTimeDifference = (zone1, zone2) => {
    const date = new Date();
    const time1 = new Intl.DateTimeFormat("en-US", {
      timeZone: zone1,
      hour: "numeric",
    }).format(date);
    const time2 = new Intl.DateTimeFormat("en-US", {
      timeZone: zone2,
      hour: "numeric",
    }).format(date);
    return Math.abs(parseInt(time1) - parseInt(time2));
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6366f1",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#6366f1"
        : isDarkMode
        ? "#4b5563"
        : "white",
      color: state.isSelected ? "white" : isDarkMode ? "white" : "#1e293b",
      "&:hover": {
        backgroundColor: "#6366f1",
        color: "white",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? "white" : "#1e293b",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? "#4b5563" : "white",
    }),
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value ? new Date(e.target.value) : new Date();
    setSelectedDate(newDate);
  };

  return (
    <div
      className={`${
        isDarkMode
          ? " text-white"
          : " from-indigo-50 to-purple-50"
      } flex items-center justify-center transition-colors duration-300`}
    >
      <div
        className={`max-w-4xl w-full ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-2xl overflow-hidden transition-colors duration-300`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white text-center">
              Time Zone Converter
            </h2>
            
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Date Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Date and Time:
            </label>
            <input
              type="datetime-local"
              value={selectedDate.toISOString().slice(0, 16)}
              onChange={handleDateChange}
              className={`w-full p-2 border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              } rounded-lg shadow-sm`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="flex flex-col items-center space-y-6">
              {/* Left Time Display */}
              <div className="text-5xl font-semibold text-indigo-600 animate-pulse">
                {leftTime}
              </div>
              {/* Left Time Zone Selector */}
              <Select
                options={timeZones}
                value={timeZones.find((tz) => tz.value === leftZone)}
                onChange={(selected) => setLeftZone(selected.value)}
                styles={customStyles}
                className="w-full"
                placeholder="Select a time zone..."
              />
              {/* Copy to Clipboard */}
              <CopyToClipboard text={leftTime} onCopy={() => setCopied(true)}>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                  <FaCopy />
                  <span>Copy Time</span>
                </button>
              </CopyToClipboard>
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-center space-y-6">
              {/* Right Time Display */}
              <div className="text-5xl font-semibold text-purple-600 animate-pulse">
                {rightTime}
              </div>
              {/* Right Time Zone Selector */}
              <Select
                options={timeZones}
                value={timeZones.find((tz) => tz.value === rightZone)}
                onChange={(selected) => setRightZone(selected.value)}
                styles={customStyles}
                className="w-full"
                placeholder="Select a time zone..."
              />
              {/* Copy to Clipboard */}
              <CopyToClipboard text={rightTime} onCopy={() => setCopied(true)}>
                <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                  <FaCopy />
                  <span>Copy Time</span>
                </button>
              </CopyToClipboard>
            </div>
          </div>

          {/* Time Difference */}
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold">
              Time Difference: {getTimeDifference(leftZone, rightZone)} hours
            </p>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                const temp = leftZone;
                setLeftZone(rightZone);
                setRightZone(temp);
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
            >
              Swap Time Zones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeZoneConverterV2;
