import { useEffect, useMemo, useState } from "react";import "./App.css";
import { initialCosts, initialPeople, initialPersonalCosts } from "./data/starterData";
import Navigation from "./components/navigation";
import HomePage from "./pages/home";
import HouseholdCostsPage from "./pages/household";
import PersonalCostsPage from "./pages/personal";

function App() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("page") || "home";
  }); 

  const [people, setPeople] = useState(() => {
    const savedPeople = localStorage.getItem("people");
    return savedPeople ? JSON.parse(savedPeople) : initialPeople;
  });

  const [costs, setCosts] = useState(() => {
    const savedCosts = localStorage.getItem("costs");
    return savedCosts ? JSON.parse(savedCosts) : initialCosts;
  });

  const [selectedPerson, setSelectedPerson] = useState(() => {
    return localStorage.getItem("selectedPerson") || initialPeople[0].id;
  });

  const [personalCosts, setPersonalCosts] = useState(() => {
    const savedPersonalCosts = localStorage.getItem("personalCosts");
    return savedPersonalCosts ? JSON.parse(savedPersonalCosts) : initialPersonalCosts;
  });

  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem("costs", JSON.stringify(costs));
  }, [costs]);

  useEffect(() => {
    localStorage.setItem("page", page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("selectedPerson", selectedPerson);
  }, [selectedPerson]); 

  useEffect(() => {
    localStorage.setItem("personalCosts", JSON.stringify(personalCosts));
  }, [personalCosts]);

  const totalSalary = people.reduce(
  (sum, person) => sum + Number(person.salary),
  0
);

const totalHouseholdCosts = costs.reduce(
  (sum, cost) => sum + Number(cost.amount),
  0
);

const householdBreakdown = useMemo(() => {
  return people.map((person) => {
    const percentage = totalSalary === 0 ? 0 : person.salary / totalSalary;
    const householdAmountOwed = totalHouseholdCosts * percentage;

    return {
      ...person,
      percentage,
      householdAmountOwed,
    };
  });
}, [people, totalSalary, totalHouseholdCosts]);

const selectedPersonHouseholdData = householdBreakdown.find(
  (person) => person.id === selectedPerson
);

  return (
    <main className="app">
      <Navigation
        page={page}
        setPage={setPage}
        people={people}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
      />
    
    <div className="page-content">

      {page === "home" && (
        <HomePage
          page={page}
          setPage={setPage}
          people={people}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
        />
      )}

      {page === "household" && (
        <HouseholdCostsPage
          people={people}
          setPeople={setPeople}
          costs={costs}
          setCosts={setCosts}
          selectedPerson={selectedPerson}
          householdBreakdown={householdBreakdown}
          totalHouseholdCosts={totalHouseholdCosts}
        />
      )}

      {page === "personal" && (
        <PersonalCostsPage
          selectedPerson={selectedPerson}
          personalCosts={personalCosts}
          setPersonalCosts={setPersonalCosts}
          householdData={selectedPersonHouseholdData}
        />
      )}
    </div>
    </main>
  );
}

export default App;