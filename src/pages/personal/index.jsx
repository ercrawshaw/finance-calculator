import CostTable from "../../components/cost-table";
import Button from "../../components/button/index.jsx";
import { initialPersonalCosts } from "../../data/starterData.js";

function PersonalCostsPage({
  selectedPerson,
  personalCosts,
  setPersonalCosts,
  householdData,
}) {
  const selectedCosts = personalCosts?.[selectedPerson] || [];

  const personalCostsTotal = selectedCosts.reduce(
    (sum, cost) => sum + Number(cost.amount),
    0
  );

  const salary = householdData?.salary || 0;
  const householdAmountOwed = householdData?.householdAmountOwed || 0;

  const moneyLeftOver = salary - householdAmountOwed - personalCostsTotal;

  function updateCost(index, field, value) {
    const updatedCosts = [...selectedCosts];

    updatedCosts[index] = {
      ...updatedCosts[index],
      [field]: field === "amount" ? Number(value) : value,
    };

    setPersonalCosts({
      ...personalCosts,
      [selectedPerson]: updatedCosts,
    });
  }

  function removeCost(indexToRemove) {
    setPersonalCosts({
      ...personalCosts,
      [selectedPerson]: selectedCosts.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  }

  function addCost() {
    setPersonalCosts({
      ...personalCosts,
      [selectedPerson]: [
        ...selectedCosts,
        {
          id: crypto.randomUUID(),
          name: "New cost",
          amount: 0,
        },
      ],
    });
  }

  function resetPersonalCosts() {
    setPersonalCosts({
      ...personalCosts,
      [selectedPerson]: [...(initialPersonalCosts[selectedPerson] || [])],
    });
  }

  return (
    <>
      <section className="card">
        <h1>Personal costs</h1>

        <p>
          This page shows personal costs for{" "}
          <strong>{householdData?.name || selectedPerson}</strong>.
        </p>
      </section>

      <section className="card">
        <h2>Monthly summary</h2>

        <p>
          <strong>Salary:</strong> £{salary.toFixed(2)}
        </p>

        <p>
          <strong>Household contribution:</strong> £
          {householdAmountOwed.toFixed(2)}
        </p>

        <p>
          <strong>Personal costs:</strong> £{personalCostsTotal.toFixed(2)}
        </p>

        <p>
          <strong>Money left over:</strong> £{moneyLeftOver.toFixed(2)}
        </p>
      </section>

      <CostTable
        title="Personal monthly costs"
        items={selectedCosts}
        updateValue={updateCost}
        amountField="amount"
        showDelete
        onDelete={removeCost}
      />

      <section className="card household-actions">
        <Button
          buttonType="primary"
          clickedFunction={addCost}
          text="+ Add cost"
        />

        <Button
          buttonType="secondary"
          clickedFunction={resetPersonalCosts}
          text="Reset costs"
        />
      </section>
    </>
  );
}

export default PersonalCostsPage;