// Tabs.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

interface Tab {
  name: string;
  content: React.ReactNode;
}

const tabs: Tab[] = [
  { name: "Tab1", content: <div>Content for Tab 1</div> },
  { name: "Tab2", content: <div>Content for Tab 2</div> },
  { name: "Tab3", content: <div>Content for Tab 3</div> },
];

const Tabs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.replace("/", "") || "Tab1";

  const handleTabClick = (tabName: string) => {
    navigate(`/${tabName}`);
  };

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`tab-button ${activeTab === tab.name ? "active" : ""}`}
            onClick={() => handleTabClick(tab.name)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.find((tab) => tab.name === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;
