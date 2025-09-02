import express from "express"
import cors from "cors"
import fs from "fs"

const app = express()



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const saveMessage = () => {
  fs.writeFileSync(fileURLToPath, JSON.stringify(messages))
}

app.post("/messages",(req,res) => {
  const {name, message} = req.body

 
  saveMessage(message)

  try { 
    const newMessage =  {
      name,
      message,
      timestamp: new Date().toISOString()
    }
    saveMessage(message)
    res.status(201).json("Saved successfully")
    }
  catch (error) {
    console.log ("Error: ", error)
    res.status(500).json("Internal server errror");
  }
  
})

export default app 