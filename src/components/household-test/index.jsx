import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

function HouseholdsTest() {
  const [households, setHouseholds] = useState([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [paidByProfileId, setPaidByProfileId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedExpenseType, setSelectedExpenseType] = useState('household');
  const [selectedProfileId, setSelectedProfileId] = useState('');

  async function getHouseholds() {
    const { data, error } = await supabase
      .from('households')
      .select(`
        id,
        name,
        profiles (
          id,
          name,
          monthly_income
        ),
        expenses (
          id,
          name,
          amount,
          expense_type,
          profile_id
        )
      `);

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setHouseholds(data);
    setLoading(false);

    if (!selectedHouseholdId && data.length > 0) {
      setSelectedHouseholdId(data[0].id);
    }
  }

  useEffect(() => {
    getHouseholds();
  }, []);

  const selectedHousehold = households.find(
    (household) => household.id === selectedHouseholdId
  );

  async function handleAddExpense(event) {
    event.preventDefault();

    if (!selectedHouseholdId || !expenseName || !expenseAmount) {
      setErrorMessage('Please add a household, expense name, and amount.');
      return;
    }

    const { error } = await supabase.from('expenses').insert({
      household_id: selectedHouseholdId,
      name: expenseName,
      amount: Number(expenseAmount),
      expense_type: selectedExpenseType,
      profile_id:
        selectedExpenseType === 'individual' ? selectedProfileId : null,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setExpenseName('');
    setExpenseAmount('');
    setPaidByProfileId('');
    setErrorMessage('');

    await getHouseholds();
  };

  async function handleDeleteExpense(expenseId) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);

  if (error) {
    setErrorMessage(error.message);
    return;
  }

  setErrorMessage('');
  await getHouseholds();
};

  return (
    <section style={{ padding: '40px' }}>
      <h1>Households</h1>

      {loading && <p>Loading...</p>}

      {errorMessage && <p>Error: {errorMessage}</p>}

     <form onSubmit={handleAddExpense} style={{ marginBottom: '40px' }}>
  <h2>Add expense</h2>

  <label>
    Household
    <select
      value={selectedHouseholdId}
      onChange={(event) => {
        setSelectedHouseholdId(event.target.value);
        setSelectedProfileId('');
      }}
    >
      {households.map((household) => (
        <option key={household.id} value={household.id}>
          {household.name}
        </option>
      ))}
    </select>
  </label>

  <br />

  <label>
    Expense name
    <input
      value={expenseName}
      onChange={(event) => setExpenseName(event.target.value)}
      placeholder="e.g. Water bill"
    />
  </label>

  <br />

  <label>
    Amount
    <input
      value={expenseAmount}
      onChange={(event) => setExpenseAmount(event.target.value)}
      type="number"
      step="0.01"
      placeholder="e.g. 42.50"
    />
  </label>

  <br />

  <label>
    Expense type
    <select
      value={selectedExpenseType}
      onChange={(event) => {
        setSelectedExpenseType(event.target.value);
        setSelectedProfileId('');
      }}
    >
      <option value="household">Household</option>
      <option value="individual">Individual</option>
    </select>
  </label>

  <br />

  {selectedExpenseType === 'individual' && (
    <>
      <label>
        Profile
        <select
          value={selectedProfileId}
          onChange={(event) => setSelectedProfileId(event.target.value)}
        >
          <option value="">Choose profile</option>

          {selectedHousehold?.profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
      </label>

      <br />
    </>
  )}

  <button type="submit">Add expense</button>
</form>

      {households.map((household) => (
        <div key={household.id} style={{ marginBottom: '40px' }}>
          <h2>{household.name}</h2>

          <h3>Profiles</h3>
          {household.profiles.map((profile) => (
            <p key={profile.id}>
              {profile.name}: £{profile.monthly_income}
            </p>
          ))}

          <h3>Expenses</h3>

          {household.expenses.length === 0 && <p>No expenses yet.</p>}

{household.expenses.map((expense) => {
  const paidBy = household.profiles.find(
    (profile) => profile.id === expense.paid_by_profile_id
  );

  return (
    <div key={expense.id} style={{ marginBottom: '12px' }}>
      <p>
        {expense.name}: £{expense.amount} paid by{' '}
        {paidBy?.name || 'Unknown'}
      </p>

      <button type="button" onClick={() => handleDeleteExpense(expense.id)}>
        Delete
      </button>
    </div>
  );
})}
        </div>
      ))}
    </section>
  );
}

export default HouseholdsTest;