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
  } catch (error) { }

}); // Initial check on page load
