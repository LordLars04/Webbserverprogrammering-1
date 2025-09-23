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
    `;

    messagesContainer.appendChild(messageDiv);
  })
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

window.addEventListener("load", async (e) => {
  try {
    const response = await axios.get("http://localhost:3000/messages");

    console.log({response: response.data.data});

    displayMessages(response.data.data);
  } catch (error) { }

}); // Initial check on page load
