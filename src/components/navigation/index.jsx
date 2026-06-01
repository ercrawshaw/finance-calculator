import { useState } from "react";
import "./index.css";
import { personImages } from "../../data/personImages";

const pages = [
  { id: "home", label: "Home" },
  { id: "household", label: "Household costs" },
  { id: "personal", label: "Personal costs" },
];

function Navigation({
  page,
  setPage,
  people,
  selectedPerson,
  setSelectedPerson,
  user,
  handleLogout,
}) {
  const [isPersonMenuOpen, setIsPersonMenuOpen] = useState(false);

  const currentPerson = people.find(
    (person) => person.id === selectedPerson
  );

  const currentImage = personImages[currentPerson?.image];

  return (
    <nav className="nav">
      <select
        className="mobile-page-select"
        value={page}
        onChange={(e) => setPage(e.target.value)}
      >
        {pages.map((pageOption) => (
          <option key={pageOption.id} value={pageOption.id}>
            {pageOption.label}
          </option>
        ))}
      </select>

      <div className="nav-links">
        {pages.map((pageOption) => (
          <button
            key={pageOption.id}
            className={page === pageOption.id ? "active" : ""}
            onClick={() => setPage(pageOption.id)}
          >
            {pageOption.label}
          </button>
        ))}
      </div>

      <div className="nav-person">
        <button
          className="nav-person-button"
          onClick={() => setIsPersonMenuOpen(!isPersonMenuOpen)}
        >
          <img
            src={currentImage}
            alt={currentPerson?.name}
            className="nav-person-image"
          />

          <span className="nav-person-name">
            {currentPerson?.name}
          </span>
        </button>

        {isPersonMenuOpen && (
          <div className="person-menu">
            {people.map((person) => {
              const isLoggedInPerson = person.user_id === user?.id;

              return (
                <button
                  key={person.id}
                  onClick={() => {
                    setSelectedPerson(person.id);
                    setIsPersonMenuOpen(false);
                  }}
                >
                  <img
                    src={personImages[person.image]}
                    alt={person.name}
                    className="person-menu-image"
                  />

                  <span>{person.name}</span>

                  {isLoggedInPerson && (
                    <span className="person-menu-you">You</span>
                  )}
                </button>
              );
            })}

            <div className="person-menu-divider" />

            <button
              type="button"
              className="person-menu-logout"
              onClick={() => {
                setIsPersonMenuOpen(false);
                handleLogout();
              }}
            >
              Log out
            </button>
          </div>
)}
      </div>
    </nav>
  );
}

export default Navigation;