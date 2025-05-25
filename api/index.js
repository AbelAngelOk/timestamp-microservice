const express = require('express');
const app = express();
const serverless = require('serverless-http');

app.use(express.json());
app.use(require('cors')({ optionsSuccessStatus: 200 }));
app.use(express.static(path.join(__dirname, '../public')));

const path = require('path');

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get("/api/:date?", (req, res) => {
  const dateParam = req.params.date;
  let date;

  if (!dateParam) {
    date = new Date();
  } else if (/^\d+$/.test(dateParam)) {
    date = new Date(parseInt(dateParam));
  } else {
    date = new Date(dateParam);
  }

  if (isNaN(date.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

app.post("/api/secure", (req, res) => {
  let { año, mes, día, hora = 0, minuto = 0, segundo = 0 } = req.body;

  año = parseInt(año);
  mes = parseInt(mes);
  día = parseInt(día);
  hora = parseInt(hora);
  minuto = parseInt(minuto);
  segundo = parseInt(segundo);

  const fecha = new Date(año, mes - 1, día, hora, minuto, segundo);
  if (isNaN(fecha.getTime())) {
    return res.status(400).json({ error: "Invalid Date" });
  }

  res.json({
    unix: fecha.getTime(),
    utc: fecha.toUTCString()
  });
});

// Exportar como función serverless
module.exports = app;
module.exports.handler = serverless(app);
