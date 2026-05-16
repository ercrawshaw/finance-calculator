function CostTable({
  title,
  items,
  updateValue,
  amountField,
  showDelete = false,
  onDelete,
}) {
  return (
    <section className="card">
      <h2>{title}</h2>

      {items.map((item, index) => (
        <div className="row" key={item.id || index}>
          <input
            className="input-row"
            value={item.name}
            onChange={(e) => updateValue(index, "name", e.target.value)}
          />

          <div className={showDelete ? "cost-actions" : ""}>
            <div className="currency-input">
              <span className="currency-symbol">£</span>

              <input
                type="number"
                value={item[amountField]}
                onChange={(e) =>
                  updateValue(index, amountField, e.target.value)
                }
              />
            </div>

            {showDelete && (
              <button
                className="delete-button"
                onClick={() => onDelete(index)}
                aria-label={`Remove ${item.name}`}
              >
                &times;
              </button>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

export default CostTable;