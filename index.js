let express = require("express");

let app = express();

const PORT = 10015;

app.use("/samples/MFC",express.static("index-MFC.js"));

app.get("/", (req,res) => {
    res.send("<html><body><h1> Hola Mundo!</h1></body></html>");
});

app.listen(10015);

console.log(`Server listening on port ${PORT}.`);