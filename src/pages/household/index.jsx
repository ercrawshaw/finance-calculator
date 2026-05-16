import "./index.css";
import { initialCosts } from "../../data/starterData.js";
import CostTable from "../../components/cost-table/index.jsx";
import Button from "../../components/button/index.jsx";


function HouseholdCostsPage({
  people,
  setPeople,
  costs,
  setCosts,
  selectedPerson,
  householdBreakdown,
  totalHouseholdCosts,
}) {

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

      <CostTable
        title="Salaries"
        items={people}
        updateValue={updatePerson}
        amountField="salary"
      />

      <CostTable
        title="Shared monthly costs"
        items={costs}
        updateValue={updateCost}
        amountField="amount"
        showDelete={true}
        onDelete={removeCost}
      />

      <section className="card household-actions">
        <Button buttonType="primary" clickedFunction={addCost} text="&#43; Add cost" />
        <Button buttonType="secondary" clickedFunction={resetHouseholdData} text="Reset costs" />
      </section>

      <section className="card result">
        <h2>What each person owes</h2>

        <p>
          <strong>Total monthly costs:</strong> £{totalHouseholdCosts.toFixed(2)}
        </p>

        {householdBreakdown.map((person) => {
          const isSelected = person.id === selectedPerson;

          return (
            <div
              className={`result-row ${isSelected ? "selected-row" : ""}`}
              key={person.id}
            >
              <span>{isSelected ? "You" : person.name}</span>
              <span>{(person.percentage * 100).toFixed(1)}%</span>
              <strong>£{person.householdAmountOwed.toFixed(2)}</strong>
            </div>
          );
        })}
      </section>
    </>
  );
}

export default HouseholdCostsPage;