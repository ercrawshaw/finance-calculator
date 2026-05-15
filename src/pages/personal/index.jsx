function PersonalCostsPage({ selectedPerson }) {
  return (
    <section className="card">
      <h1>Personal costs</h1>

      <p>
        This page will show personal costs for{" "}
        <strong>{selectedPerson}</strong>.
      </p>

      <p>
        We can build this next so each person has their own bills,
        subscriptions, savings and spending money.
      </p>
    </section>
  );
}

export default PersonalCostsPage;