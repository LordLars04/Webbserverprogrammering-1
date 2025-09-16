import express from "express"
import cors from "cors" // Tilllåter förfrågningar från andra domäner (cross-origin recource sharing)
import fs from "fs" // Node.js filsystem modul för att läsa och skriva filer
import { fileURLToPath } from "url" // Hjälper osss att få sökvägen till den aktuella fil
import { dirname } from "path" // Hjälper oss att få sökvägen till den aktuella mappen

const __filename = fileURLToPath(import.meta.url) // Hjälper oss att få sökvägen till den aktuella fil
const __dirname = dirname(__filename) // Hjälper oss att få sökvägen till den aktuella mappen

const corsOptions = {
  origin: "https://5500-firebase-web-up1-1756207702057.cluster-pbm4nlfnrzakyryoooaq5fq3ps.cloudworkstations.dev",
  optionsSuccessStatus: 200
}

const app = express() // Skapa Express-applikationen

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const saveMessage = (messageData) => { // The function now accepts an argument, 'messageData'.
  const filePath = `${__dirname}/messages.json` // Skapa fullständign sökväg till JSON-filen

  let messages = []
  if (fs.existsSync(filePath)) { // Kontrollera om filen finns 
    const data = fs.readFileSync(filePath, "utf-8") //läs fil som text
    messages = JSON.parse(data) // Konvertera JSON - filen till ett JavaScript-objekt
  }

  messages.push(messageData) // This now works because messageData is passed into the function.

  // Spara tillbaka hela arrayen till filen
  //JSON.stringify() konvertera JS till JSON
  //JSON.parse() konvertera JSON till JS
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2)) 


}


app.post("/messages",(req,res) => {
  const {name, message} = req.body

  try { 
    const messageData =  {
      name,
      message,
      timestamp: new Date().toISOString()
    }

    saveMessage(messageData)

    res.status(201).json("Saved successfully")
  } catch (error) {
    console.log ("Error: ", error)
    res.status(500).json("Internal server errror");
  }

})

export default app
