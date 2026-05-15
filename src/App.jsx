import { useEffect, useState } from "react";
import "./App.css";

import { initialCosts, initialPeople } from "./data/starterData";
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
        />
      )}

      {page === "personal" && (
        <PersonalCostsPage selectedPerson={selectedPerson} />
      )}
    </div>
    </main>
  );
}

export default App;