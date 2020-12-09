import express from "express";
import EnableWebSocket from "express-ws";
import WSManager from "./web-socket/WSManager";
import expressWs from "express-ws";

const app: express.Application = express();

EnableWebSocket(app);
WSManager(app as expressWs.Application);


// @ts-ignore
app.use(function(err, req, res, _next) {
    console.log(err);
    return res.status(500).end();
});

app.get("/", (req, res) => {
    res.send("1");
})

app.listen(8080, function () {
    console.log("Server started on port 8080.");
});