import axios from 'axios';
const form = document.querySelector(".input-form");
const submitBtn = document.querySelector("button[type='submit']");

// Function to check input fields and toggle the submit button's state


  const checkInputs = () => {
  let inputName = form.elements.name.value.trim();
  let inputMessage = form.elements.message.value.trim();

  // Disable the button if either field is empty
  if (!inputName || !inputMessage) {
    submitBtn.disabled = true;
  } else {
    submitBtn.disabled = false;
  }
};

const displayMessages = (messages) => {
console.log({messages: messages});

  const messagesContainer = document.querySelector(".messages")
  console.log({messagesContainer: messagesContainer});

  messagesContainer.innerHTML = ""
 

  messages.forEach(msg =>{
    console.log({msg: msg});
    const messageDiv = document.createElement("div")
    messageDiv.className= "message";

    const date = new Date(msg.timestamp).toLocaleString("sv-SE")

    messageDiv.innerHTML = `
    <div class="message-header">
      <strong>${msg.name}</strong>
      <span class="timestamp">${date}</span>
    </div>
    <p class="message-content">${msg.message}</p>
    <button class="delete-btn" data-id="${msg.id}">Radera</button>
    <button class="update-btn" data-id="${msg.id}">uppdatera</button>
    `;

    messagesContainer.appendChild(messageDiv);
  })

  // Efter att alla medelanden har lagts till, lägg till event Listeners på radera knapparna
  addDeleteEventListeners();
};

// Add an event listener to check inputs whenever the user types
form.addEventListener("input", checkInputs);

// Add an event listener for form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the form from reloading the page

  // Get the current values from the form right before sending
  const inputName = form.elements.name.value.trim();
  const inputMessage = form.elements.message.value.trim();

  if (!inputName || !inputMessage) {
    alert("Fyll i båda fälten");
    return;
  }

  const messageData = {
    name: inputName,
    message: inputMessage,
  }

  try {
    // Send the form data to the server
    const response = await axios.post('http://localhost:3000/messages', 
     messageData
    );

    if (response.status === 201) {
      alert("Meddelandet sparades!");
      form.reset(); // Clear the form fields
      checkInputs(); // Re-disable the submit button
    } else {
      alert("Ett fel uppstod!"); 
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Kunde inte skicka meddelandet");
  }
});

window.addEventListener("load", async (e) =>loadMessages());

 const loadMessages = async () => {
  
  try {
    const response = await axios.get("http://localhost:3000/messages");

    console.log({response: response.data.data});

    displayMessages(response.data.data);
  } catch (error) { }

}; // Initial check on page load


const addDeleteEventListeners = () => {
  // Hitta alla knappar med klassen "delete-btn"
  const deleteButtons= document.querySelectorAll(".delete-btn");

  // Läg till en klick-lyssnare på varje knapp
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", handleDelete);
  })
};

const addUpdateEventListeners = () => {
  const updateButtons = document.querySelectorAll(".update-btn");

  updateButtons.forEach((btn) => {
    btn.addEventListener("click", handleUpdate);
  });
};

const handleUpdate = async (e) => {
  const messageId = e.target.dataset.id;
  const messageDiv = e.target.closest(".message");

  // Hämta nuvarande värden
  const curentName = messageDiv.querySelector(".message-header strong").textContent;
  const curentMessage = messageDiv.querySelector(".message-content").textContent;

  // Skapa ett enkelt fromulär för redigering
  const newName = prompt("Ändra namn:", curentName);
  if (newName === null) return; // Användaren avbröt

  const newMessage = prompt("Ändra meddeelande:", curentMessage);
  if (newMessage === null) return; // Användaren avbröt

  try {
    const uppdates = {};

    if (newName !== curentName) updates.name = newName;
    if (newMessage !== curentMessage) updates.message = newMessage;

    // Om inget ändrats, avbryt
    if (Object.keys(updates).length === 0) {
      alert("Inga ändringar gjordes");
      return;
    }

    const response = await axios.patch(`http://localhost:3000/messages/${messageId}`, uppdates);

    if (response.data.success=== true) {
      alert("Meddelandet har uppdaterats!");
      await loadMessages();
    } else {
      alert("Kunde inte uppdatera meddelandet");
    }
  } catch (error) {
      alert("Kunde inte uppdatera meddelandet");
  }
};

const handleDelete = async (e) => {
  const messageId = e.target.dataset.id;
  console.log({messageId: messageId});
  try {
    // Skicka DELETE-requerst till servern
    // Vi lägger till ID:t i URL:en
    const response = await axios.delete(`http://localhost:3000/messages/${messageId}`);

    if (response.data.success) {
      alert("Meddelandet raderades!");

      // Ladda om alla meddelanden för att visa uppdaterad lista
      await loadMessages();
    } else {
      alert("Kunde inte radera meddelandet");
    }
  } catch (error) {
    console.log("Fel vid radering:", error);

    if (error.response && error.response.status === 404) {
      alert(" Meddelandet hittades inte");
    } else {
      alert("Kunde inte radera meddelandet");
    }
  }
}