import express from "express"
import cors from "cors" // Tilllåter förfrågningar från andra domäner (cross-origin recource sharing)
import fs from "fs" // Node.js filsystem modul för att läsa och skriva filer
import { fileURLToPath } from "url" // Hjälper osss att få sökvägen till den aktuella fil
import { dirname } from "path" // Hjälper oss att få sökvägen till den aktuella mappen
import {v4 as uuidv4} from "uuid"; // Används för att generera unika ID:n

const __filename = fileURLToPath(import.meta.url) // Hjälper oss att få sökvägen till den aktuella fil
const __dirname = dirname(__filename) // Hjälper oss att få sökvägen till den aktuella mappen

const app = express() // Skapa Express-applikationen

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

 const filePath = `${__dirname}/messages.json`; // Skapa fullständign sökväg till JSON-filen
 const data = fs.readFileSync(filePath, "utf-8"); //läs fil som text

const saveMessage = (messageData) => { // The function now accepts an argument, 'messageData'.
 
  let messages = []
  if (fs.existsSync(filePath)) { // Kontrollera om filen finns 
   messages = JSON.parse(data) // Konvertera JSON - filen till ett JavaScript-objekt
  }

  messages.push(messageData) // This now works because messageData is passed into the function.

  // Spara tillbaka hela arrayen till filen
  //JSON.stringify() konvertera JS till JSON
  //JSON.parse() konvertera JSON till JS
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2)) 


}

const getMessages = () => {
 

  try {
    if (fs.existsSync(filePath)){

      return JSON.parse(data)
    }
    return []
  } catch (error) {
    console.log(" Fel med läsning av meddelanden: ", error);
    return []
  }
};

const deleteMessage = (messageId) => {
  try {
    if(!fs.existsSync(filePath)) {
      return false; // Returnera false om filen inte finns
    }

   let messages = JSON.parse(data); // Konvertera JSON-filen till ett JavaScript array

   // Filtera bort mneddelandet med matchande ID
   // filter() skapar en ny array som INTE innehåller meddelandet vi vill radera
   const filteredMessages = messages.filter(msg => msg.id !== messageId);

   // KOlla om något meddelande togs bort
   if (messages.length === filteredMessages.length) {
    return false; // Ingen meddelande togs bort, returnera false
   }

   // Spara den uppdaterade arrayen (utan det raderade meddelandert) 
    fs.writeFileSync(filePath, JSON.stringify(filteredMessages, null, 2));
    return true;
  } catch (error) {
    console.log(" Fel vid radering:", error);
    return false;
  }
};

// Lägg till funktion för att updatera ett message objekt
const updateMessage = (messageId, updatera) => {
  try {
    // Kontrollera om filen finns
    if (!fs.existsSync(filePath)) {
      return false;
    }

    // Hömta meddelanden från messages.json
    const currentData = fs.readFileSync(filePath, 'utf-8');
    let messages = JSON.parse(currentData); // Omvandla datan i curentData till en JS-array

    // Hämta index för meddelandet som ska uppdateras
    const messageIndesx = messages.findIndex(msg => msg.id == messageId);

    if (messageIndex == -1) {
      return false;
    }

    // Uppdatera endast de fält som skickas in, behåll resten
    messages[messageIndex] = {
      ...messages[messageIndex],
      ...updates, 
      id: messageId,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
    return true;
  } catch (error) {
    console.log("Fel vid uppdatering:", error);
    return false;    
  }
}

app.post("/messages",(req,res) => {
  const {name, message} = req.body

  const id = uuidv4();
  
  try { 
    const messageData =  {
      name,
      message,
      timestamp: new Date().toISOString(),
      id, 
    }

    saveMessage(messageData)

    res.status(201).json("Saved successfully")
  } catch (error) {
    console.log ("Error: ", error)
    res.status(500).json("Internal server errror");
  }

})

app.get("/messages",(req,res) => {

  try {
    const messages = getMessages()
   
    res.status(200).json({success: true,  data: messages});
  } 
  catch (error) {
    console.log("Fel vid hämtning av meddelanden:", error);
    res.status(500).json({success: false});
  }
});

app.delete("/messages/:id", (req, res) =>{
  console.log(" raderar meddelande");
  const messageId = req.params.id;

  console.log({ID: messageId});
  try {
    const deleted = deleteMessage(messageId);
    
    if (deleted) {
      res.status(200).json({success: true,});
    }
    else {
      res.status(404).json({success: false});
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({success: false});
  }
});

app.patch("/messages/:id", (req, res) => {
  //Läs ut id och meddelande och spara i två variabeler
  const messageId = req.params.id;
  const updates = req.body;

  console.log("Uppdatera meddelande:", messageId, updates);

  try {
    // Anropar updateMessage och sparar svaret i en variabel
    const result = updateMessage(messageId, updates);

    if (result === true) {
      res.status(201).json({
        success:true,
      });
    } else {
      res.status(404).json({
        success: false,
      })
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      success:false,
      error: "Serverfel",
      
    })
  }
});
export default app;
