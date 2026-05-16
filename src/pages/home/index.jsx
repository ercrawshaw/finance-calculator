import "./index.css";
import { personImages } from "../../data/personImages";

function HomePage({ page, setPage, people, selectedPerson, setSelectedPerson }) {

  function onClick(person) {
    setSelectedPerson(person.id);
    setPage("household");
  };

  return (
    <section>
      <h1>Who are we working as today?</h1>

      <div className="person-grid">
        {people.map((person) => {
          const isSelected = person.id === selectedPerson;
          const image = personImages[person.image];

          return (
            <button
              key={person.id}
              className={`person-avatar ${
                isSelected ? "person-avatar-selected" : ""
              }`}
              onClick={() => onClick(person)}
            >
              <img src={image} alt={person.name} />

              <span className="name">{person.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default HomePage;