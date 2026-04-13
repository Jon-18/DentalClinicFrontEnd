import { useState } from 'react';
import "../style/components/table.css";

const Table = ({ title, columns, data }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="table-container">
      {title && <h2 className="table-title">{title}</h2>}

      {/* 🔍 Search Bar Outside the Table */}
      <div className="table-search-container">
        <input
          type="text"
          className="table-searchbar"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={row._id || index}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {row[col.key] !== undefined && row[col.key] !== null
                      ? row[col.key]
                      : "—"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="no-data">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
