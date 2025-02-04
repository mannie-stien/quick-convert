import React, { useState, useEffect } from "react";
import TimeZoneConverterV2 from "./components/TimeZoneConverterV2";
import CurrencyConverter from "./components/CurrencyConverter";
import UnitConverter from "./components/UnitConverter";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaSun,
  FaMoon,
  FaGripVertical,
} from "react-icons/fa";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import logo from "./assets/logo.png";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [toolOrder, setToolOrder] = useState([
    "TimeZoneConverterV2",
    "CurrencyConverter",
    "UnitConverter",
  ]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const newOrder = [...toolOrder];
      const activeIndex = newOrder.indexOf(active.id);
      const overIndex = newOrder.indexOf(over.id);
      [newOrder[activeIndex], newOrder[overIndex]] = [
        newOrder[overIndex],
        newOrder[activeIndex],
      ];
      setToolOrder(newOrder);
    }
  };

  const renderTool = (tool) => {
    switch (tool) {
      case "TimeZoneConverterV2":
        return <TimeZoneConverterV2 isDarkMode={isDarkMode} />;
      case "CurrencyConverter":
        return <CurrencyConverter isDarkMode={isDarkMode} />;
      case "UnitConverter":
        return <UnitConverter isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={` py-10 px-6 sm:px-8 lg:px-12 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <img
            src={logo} // Path to your logo in the public folder
            alt="QuickConvert Logo"
            className="w-10 h-10 hover:scale-110 transition-transform duration-200"
          />
          {/* App Name */}
          <h1 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
            QuickConvert
          </h1>
          
        </div>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors duration-200"
        >
          {isDarkMode ? (
            <FaSun className="text-xl" />
          ) : (
            <FaMoon className="text-xl" />
          )}
        </button>
      </header>

      {/* Tools Layout */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {toolOrder.map((tool, index) => (
            <DraggableTool
              key={tool}
              tool={tool}
              index={index}
              renderTool={renderTool}
            />
          ))}
        </div>
      </DndContext>

      {/* Footer */}
      <footer
        className={`mt-12 p-8 rounded-xl shadow-lg ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
        }`}
      >
        <div className="text-center">
          <p className="text-lg font-semibold">
            Built with ❤️ by Emmanuel Agyare
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://github.com/mannie-stien"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition-colors duration-200"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/emmanuel-agyare-946a62139/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition-colors duration-200"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            {/* <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-500 transition-colors duration-200"
            >
              <FaTwitter className="w-6 h-6" />
            </a> */}
          </div>
          <p className="mt-4 text-sm">
            © {new Date().getFullYear()} Multi-Conversion App. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const DraggableTool = ({ tool, index, renderTool }) => {
  const { setNodeRef, attributes, listeners, transform, isDragging } =
    useDraggable({ id: tool });
  const { setNodeRef: droppableRef } = useDroppable({ id: tool });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    transition: "opacity 0.2s, transform 0.2s",
  };

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300"
      style={style}
    >
      <div
        ref={droppableRef}
        className={`w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
          isDragging ? "ring-2 ring-indigo-500" : ""
        }`}
      >
        <div className="p-4 cursor-move" {...listeners} {...attributes}>
          <FaGripVertical className="text-gray-400 dark:text-gray-500" />
        </div>
        <div className="p-6">{renderTool(tool)}</div>
      </div>
    </div>
  );
};

export default App;
