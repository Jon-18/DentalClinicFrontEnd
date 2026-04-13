import { useState } from "react";
import "../style/components/sidebar.css";

const Sidebar = ({ title, links, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "⮜" : "⮞"}
      </button>

      {isOpen ? <h2 class="sidebar-title">{title}</h2> : <h2 class="sidebar-title">{title}</h2>}
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <button
              className="sidebar-link"
              onClick={() => onLinkClick(link.key)}
            >
              {isOpen ? link.label : link.label[0]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
