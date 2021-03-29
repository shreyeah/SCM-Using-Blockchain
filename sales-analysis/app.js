const express = require("express");
const { PythonShell } = require("python-shell");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 5000;

app.post("/getDemand", (req, res) => {
  // try {
  //   const pyshell = new PythonShell("getDemand.py");
  //   pyshell.send("5 89");
  //   pyshell.on("message", function (message) {
  //     res.send(message);
  //     return;
  //   });
  // } catch (e) {
  //   console.log(e);
  // }
  const n = req.body.num;
  const rep = [];
  for (let i = 0; i < n; i++) {
    rep.push(Math.round(Math.random() * 100 + Math.random() * 1000));
  }
  res.json(rep);
});

app.post("/retrain", (req, res) => {
  const pyshell = new PythonShell("retrain.py");

  console.log(req.body);

  pyshell.send(req.body);

  pyshell.on("message", function (message) {
    res.send(message);
  });
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
