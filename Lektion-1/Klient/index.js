const form = document.querySelector(".input-form");
const submitBtn = document.querySelector("button[type='submit']");

// Function to check input fields and toggle the submit button's state
const checkInputs = () => {
  let inputName = form.elements.name.value.trim();
  let inputMessage = form.elements.message.value.trim();

  const backenUrl = "https://5500-firebase-web-up1-1756207702057.cluster-pbm4nlfnrzakyryoooaq5fq3ps.cloudworkstations.dev/Lektion-1/Klient/index.html"

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

  try {
    // Send the form data to the server
    const response = await fetch('http://localhost:3000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name: inputName, 
        message: inputMessage 
      })
    });

    if (response.ok) {
      alert("Meddelandet sparades!");
      console.log("Message saved successfully");
      form.reset(); // Clear the form fields
      checkInputs(); // Re-disable the submit button
    } else {
      alert("Ett fel uppstod!");
      console.error("Failed to save message");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Kunde inte skicka meddelandet");
  }
});

// Run the check once when the script loads to set the initial button state
checkInputs();
