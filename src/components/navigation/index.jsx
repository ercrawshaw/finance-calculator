import { useState } from "react";
import "./index.css";

import elleImage from "../../assets/elle.png";
import lewisImage from "../../assets/lewis.png";

const personImages = {elle: elleImage, lewis: lewisImage};

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
            {people.map((person) => (
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
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;