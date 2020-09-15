const form = document.querySelector(".form");
const notesList = document.querySelector(".notes-list");
let notes = [];
let contador = 0;
let contadorHTML = document.createElement("p");
contadorHTML.innerText = `Total puntos: ${contador}`;

eventListeners();
iniciarContador();

function eventListeners() {
  form.addEventListener("submit", addNote);
  document.addEventListener("DOMContentLoaded", () => {
    notes = JSON.parse(localStorage.getItem("notes")) || [];

    createHTML();
  });
}

function iniciarContador() {
  const container = document.querySelector(".add-note");

  container.appendChild(contadorHTML);
}
function addNote(e) {
  e.preventDefault();
  const note = document.querySelector("#note").value;
  const puntaje = document.querySelector("#puntaje").value;

  if (note === "" || puntaje === "") {
    showErrorMessage("No se pueden agregar tareas vacías o sin puntaje");
    return;
  }

  const noteObj = {
    id: Date.now(),
    note: note,
    puntaje: parseInt(puntaje),
  };

  notes = [...notes, noteObj];

  createHTML();
}

function showErrorMessage(error) {
  const errorMessage = document.createElement("p");
  errorMessage.textContent = error;
  errorMessage.classList.add("error");

  const container = document.querySelector(".add-note");
  container.appendChild(errorMessage);

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
}

function createHTML() {
  cleanHTML();
  if (notes.length > 0) {
    notes.forEach((note) => {
      const li = document.createElement("li");
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete");
      deleteBtn.innerText = "X";
      deleteBtn.onclick = () => {
        deleteNote(note.id);
      };
      const doneBtn = document.createElement("button");
      doneBtn.classList.add("done");
      doneBtn.innerText = "Hecho";
      doneBtn.onclick = () => {
        doneNote(note.id);
      };
      const puntaje = document.createElement("span");
      puntaje.classList.add("puntaje");
      puntaje.innerText = `Vale: ${note.puntaje}`;
      li.innerText = note.note;
      li.appendChild(puntaje);
      li.appendChild(doneBtn);
      li.appendChild(deleteBtn);

      notesList.appendChild(li);
    });
  }
  storageSincronization();
}
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);

  createHTML();
}

function doneNote(id) {
  let note = notes.filter((note) => note.id === id);
  let doneTask = document.createElement("div");
  doneTask.innerHTML = ` <p>Terminaste la tarea ${note[0].note}, sumaste ${note[0].puntaje} puntos</p>`;
  const container = document.querySelector(".done-tasks");
  container.appendChild(doneTask);
  contador = contador + note[0].puntaje;
  contadorHTML.innerText = `Total puntos: ${contador}`;
  if (contador >= 100) {
    const goalDiv = document.querySelector(".goal");
    const goalMessage = document.createElement("p");
    goalMessage.style.padding = "3rem";
    goalMessage.innerHTML =
      "🥳¡Felicidades!¡Lograste tu objetivo de hoy!<br>Recordá que cada pequeño paso que das te acerca donde querés llegar";
    goalDiv.appendChild(goalMessage);
  }

  notes = notes.filter((note) => note.id !== id);

  createHTML();
}

function cleanHTML() {
  while (notesList.firstChild) {
    notesList.removeChild(notesList.firstChild);
  }
}

function storageSincronization() {
  localStorage.setItem("notes", JSON.stringify(notes));
}
