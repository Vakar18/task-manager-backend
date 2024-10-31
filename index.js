const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require('./routes/taskRoutes');

require('dotenv').config();

const app = express();
const PORT = 8082;
const DB_URI = "mongodb+srv://vakarahmad99:b1NiGEC2hWuEsvuz@cluster0.ydvtn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(DB_URI , {
    useNewUrlParser : true,
    useUnifiedTopology : true,
})
.then(() => console.log("DB Connected!"))
.catch((error) => console.log("Error in conntecting DB!" , error))

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.listen(PORT , () => {
    console.log(`Backend listening on port ${PORT}`)
})