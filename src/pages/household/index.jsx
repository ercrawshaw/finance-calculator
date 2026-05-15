import { useMemo } from "react";
import "./index.css";
import { initialCosts } from "../../data/starterData.js";

function HouseholdCostsPage({
  people,
  setPeople,
  costs,
  setCosts,
  selectedPerson,
}) {
  const totalSalary = people.reduce(
    (sum, person) => sum + Number(person.salary),
    0
  );

  const totalCosts = costs.reduce(
    (sum, cost) => sum + Number(cost.amount),
    0
  );

  const breakdown = useMemo(() => {
    return people.map((person) => {
      const percentage = totalSalary === 0 ? 0 : person.salary / totalSalary;
      const owed = totalCosts * percentage;

      return {
        ...person,
        percentage,
        owed,
      };
    });
  }, [people, totalSalary, totalCosts]);

  function updatePerson(index, field, value) {
    const updatedPeople = [...people];

    updatedPeople[index] = {
      ...updatedPeople[index],
      [field]: field === "salary" ? Number(value) : value,
    };

    setPeople(updatedPeople);
  }

  function updateCost(index, field, value) {
    const updatedCosts = [...costs];

    updatedCosts[index] = {
      ...updatedCosts[index],
      [field]: field === "amount" ? Number(value) : value,
    };

    setCosts(updatedCosts);
  }

  function addCost() {
    setCosts([...costs, { name: "New cost", amount: 0 }]);
  }

  function removeCost(indexToRemove) {
    setCosts(costs.filter((_, index) => index !== indexToRemove));
  }

  function resetHouseholdData() {
    setCosts([...initialCosts]);
  }

  return (
    <>
      <section className="card">
        <h1>Household Calculator</h1>

        <p>
          Change salaries or shared costs and the app will work out how much
          each person should pay into the household account.
        </p>
      </section>

      <section className="card">
        <h2>Salaries</h2>

        {people.map((person, index) => (
          <div className="row" key={person.id}>
            <input
              className="input-row"
              value={person.name}
              onChange={(e) => updatePerson(index, "name", e.target.value)}
            />

            <div className="currency-input">
              <span className="currency-symbol">£</span>

              <input
                type="number"
                value={person.salary}
                onChange={(e) =>
                  updatePerson(index, "salary", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Shared monthly costs</h2>

        {costs.map((cost, index) => (
          <div className="row" key={index}>
            <input
              className="input-row"
              value={cost.name}
              onChange={(e) => updateCost(index, "name", e.target.value)}
            />

            <div className="cost-actions">
              <div className="currency-input">
                <span className="currency-symbol">£</span>

                <input
                  type="number"
                  value={cost.amount}
                  onChange={(e) =>
                    updateCost(index, "amount", e.target.value)
                  }
                />
              </div>

              <button
                className="delete-button"
                onClick={() => removeCost(index)}
                aria-label={`Remove ${cost.name}`}
              >
                &times;
              </button>
            </div>
          </div>
        ))}

        <div className="household-actions">
          <button onClick={addCost}>&#43; Add cost</button>

          <button className="reset-button" onClick={resetHouseholdData}>
            Reset costs
          </button>
        </div>
      </section>

      <section className="card result">
        <h2>What each person owes</h2>

        <p>
          <strong>Total monthly costs:</strong> £{totalCosts.toFixed(2)}
        </p>

        {breakdown.map((person) => {
          const isSelected = person.id === selectedPerson;

          return (
            <div
              className={`result-row ${isSelected ? "selected-row" : ""}`}
              key={person.id}
            >
              <span>{isSelected ? "You" : person.name}</span>
              <span>{(person.percentage * 100).toFixed(1)}%</span>
              <strong>£{person.owed.toFixed(2)}</strong>
            </div>
          );
        })}
      </section>
    </>
  );
}

export default HouseholdCostsPage;