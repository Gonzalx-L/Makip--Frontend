import {
  FaHome,
  FaFolder,
  FaRegChartBar,
  FaCog,
  FaRegQuestionCircle,
  FaRegUserCircle,
  FaTh,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { MdOutlineDashboard, MdExpandMore } from "react-icons/md";
import { useState } from "react";

const NAV_OPTIONS = [
  { icon: <FaHome />, label: "Home" },
  { icon: <MdOutlineDashboard />, label: "Dashboard" },
  { icon: <FaTh />, label: "Projects" },
  { icon: <FaFolder />, label: "Folders", expand: true },
  { divider: true },
  { icon: <FaRegChartBar />, label: "Reporting" },
  { icon: <FaCog />, label: "Settings" },
  { icon: <FaRegQuestionCircle />, label: "Support", badge: "Online" },
  { icon: <FaExternalLinkAlt size={14} />, label: "Open in browser" },
];

const AdmiSiderbar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md flex flex-col justify-center items-center w-8 h-8 space-y-1"
        onClick={() => setShowSidebar(!showSidebar)}>
        <span className="block h-0.5 w-4 bg-white" />
        <span className="block h-0.5 w-4 bg-white" />
        <span className="block h-0.5 w-4 bg-white" />
      </button>
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 z-40 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } w-64 md:translate-x-0 md:relative md:w-64`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <span className="w-8 h-8 bg-red-500 rounded-lg inline-block mr-3"></span>
          <span className="text-xl font-bold text-gray-800">MAKIP</span>
        </div>

        {/* Search */}
        <div className="p-4 relative">
          <input className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder='Search' />
          <span className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width='16' height='16' fill='none'>
              <path
                d='M12.5 12.5L10 10M11 6.5A4.5 4.5 0 1 1 2 6.5a4.5 4.5 0 0 1 9 0Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
          </span>
        </div>

        {/* Nav */}
        <ul className="px-4 space-y-1">
          {NAV_OPTIONS.map((item, i) =>
            item.divider ? (
              <li className="border-t border-gray-200 my-2" key={i} />
            ) : (
              <li className="group" key={i}>
                <a tabIndex={0} className="flex items-center justify-between px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                  <span className="flex items-center space-x-3">
                    <span className="text-gray-500">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </span>
                  {item.expand && (
                    <MdExpandMore className="text-gray-400 w-4 h-4 transition-transform group-hover:text-gray-600" />
                  )}
                  {item.badge && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">{item.badge}</span>
                  )}
                </a>
              </li>
            )
          )}
        </ul>

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <img
              src='https://randomuser.me/api/portraits/women/44.jpg'
              alt='Olivia Rhye'
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">Olivia Rhye</div>
              <div className="text-sm text-gray-500 truncate">olivia@untitledui.com</div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <FaRegUserCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdmiSiderbar;
