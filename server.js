const express = require("express");
const app = express();
app.use(express.static('public'));

const port = process.env.PORT || 80;

app.get("/", (req, res)=>{
	console.log("requested");
	res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, function(error) {
	console.log(error ? error : "Server running on port " + port);
});