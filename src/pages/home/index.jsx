import "./index.css";

import elleImage from "../../assets/elle.png";
import lewisImage from "../../assets/lewis.png";

const personImages = {
  elle: elleImage,
  lewis: lewisImage,
};

function HomePage({ people, selectedPerson, setSelectedPerson }) {
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
              onClick={() => setSelectedPerson(person.id)}
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