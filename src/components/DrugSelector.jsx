function DrugSelector({ drugs, selectedDrug, onDrugChange }) {
  return (
    <div className="drug-selector">
      <label htmlFor="drug-select" className="selector-label">
        Filter by Drug:
      </label>
      <select
        id="drug-select"
        value={selectedDrug}
        onChange={(e) => onDrugChange(e.target.value)}
        className="drug-select"
      >
        <option value="All">All Drugs</option>
        {drugs.map((drug, index) => (
          <option key={index} value={drug.name}>
            {drug.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DrugSelector;

