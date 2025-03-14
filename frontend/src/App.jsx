import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Aufgaben abrufen beim Laden der Seite
  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then(setTasks)
      .catch((error) => console.error("Fehler beim Abrufen der Aufgaben:", error));
  }, []);

  // Funktion zum Hinzufügen neuer Aufgaben
  const itemHinzufuegen = () => {
    if (!title.trim()) {
      return; // Eingabevalidierung: Leerzeichen ignorieren
    }

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then((res) => res.json())
      .then((neueAufgabe) => setTasks([...tasks, neueAufgabe]))
      .catch((error) => console.error("Fehler beim Hinzufügen der Aufgabe:", error));

    setTitle(""); // Eingabefeld leeren
  };

  // Funktion zum Löschen einer Aufgabe
  const itemLoeschen = (id_nummer) => {
    fetch(`http://localhost:3050/delete/${id_nummer}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Entfernen der Aufgabe aus der lokalen Liste
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id_nummer));
        } else {
          console.error("Fehler beim Löschen des Items");
        }
      })
      .catch((error) => console.error("Fehler beim Löschen der Aufgabe:", error));
  };

  return (
    <>
      <h1>To-Do List</h1>
      {/* Eingabefeld für neue Aufgaben */}
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button
        disabled={!title.trim()} // Button wird deaktiviert, wenn das Eingabefeld leer ist
        onClick={itemHinzufuegen}
      >
        Add
      </button>

      {/* Liste der Aufgaben */}
      <ul>
        {tasks.map(({ id, title, completed }) => (
          <li key={id}>
            <input type="checkbox" />
            {title}
            {/* Löschen-Button */}
            <button onClick={() => itemLoeschen(id)}>X</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
