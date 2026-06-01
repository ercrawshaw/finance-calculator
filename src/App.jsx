import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { supabase } from "./lib/supabaseClient";
import { getUserHousehold } from "./utils/profile-utils";

import { initialCosts, initialPersonalCosts } from "./data/starterData";

import AuthPage from "./pages/auth-page";
import Navigation from "./components/navigation";
import HomePage from "./pages/home";
import HouseholdCostsPage from "./pages/household";
import PersonalCostsPage from "./pages/personal";

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoadingHousehold, setIsLoadingHousehold] = useState(false);

  const [page, setPage] = useState(() => {
    return localStorage.getItem("page") || "home";
  });

  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");

  const [costs, setCosts] = useState(() => {
    const savedCosts = localStorage.getItem("costs");
    return savedCosts ? JSON.parse(savedCosts) : initialCosts;
  });

  const [personalCosts, setPersonalCosts] = useState(() => {
    const savedPersonalCosts = localStorage.getItem("personalCosts");
    return savedPersonalCosts
      ? JSON.parse(savedPersonalCosts)
      : initialPersonalCosts;
  });

  useEffect(() => {
    async function getCurrentSession() {
      const { data } = await supabase.auth.getSession();

      setUser(data.session?.user ?? null);
      setIsCheckingSession(false);
    }

    getCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function loadHouseholdPeople() {
      if (!user) {
        setPeople([]);
        setSelectedPerson("");
        return;
      }

      setIsLoadingHousehold(true);

      try {
        const household = await getUserHousehold(user.id);

        const formattedPeople = household.profiles.map((profile) => ({
          id: profile.id,
          name: profile.name,
          salary: Number(profile.monthly_income),
          image: profile.name.toLowerCase(),
          user_id: profile.user_id,
        }));

        setPeople(formattedPeople);

        const signedInPerson = formattedPeople.find((person) => {
          return person.user_id === user.id;
        });

        if (signedInPerson) {
          setSelectedPerson(signedInPerson.id);
        } else if (formattedPeople.length > 0) {
          setSelectedPerson(formattedPeople[0].id);
        }
      } catch (error) {
        console.error("Could not load household people:", error.message);
      } finally {
        setIsLoadingHousehold(false);
      }
    }

    loadHouseholdPeople();
  }, [user]);

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

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setPeople([]);
    setSelectedPerson("");
  }

  if (isCheckingSession) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <AuthPage />;
  }

  if (isLoadingHousehold) {
    return <p>Loading household...</p>;
  }

  if (people.length === 0) {
    return (
      <main className="app">
        <p>No household profiles found for this user.</p>

        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </main>
    );
  }

  return (
    <main className="app">
      <Navigation
        page={page}
        setPage={setPage}
        people={people}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        user={user}
        handleLogout={handleLogout}
      />

      <div className="page-content">
        {page === "home" && (
          <HomePage
            user={user}
            page={page}
            setPage={setPage}
            people={people}
            selectedPerson={selectedPerson}
            setSelectedPerson={setSelectedPerson}
          />
        )}

        {page === "household" && (
          <HouseholdCostsPage
            user={user}
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
            user={user}
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