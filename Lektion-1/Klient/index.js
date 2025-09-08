const form = document.querySelector(".input-form") // läs in formulär
const submitBtn = document.querySelector("button[type='submit']") //läs in submit

let inputName = form.elements.name.value //.trim() Läser in det som skrivs i namn input
let inputMessage = form.elements.message.value //Läser in det som skrivs i message iput

const checkInputs = () => {

    inputName = form.elements.name.value
    inputMessage = form.elements.message.value
    

    if (!inputName || !inputMessage) submitBtn.disabled = true
    else submitBtn.disabled = false 
}

form.addEventListener("input", checkInputs())

form.addEventListener("submit", async (e) => { // e förkortning för event
    e.preventDefault() // Hindrar formuläret från att ladda om

    if (inputName || !inputMessage) return alert("Fyll i båda fälten")
    
})

