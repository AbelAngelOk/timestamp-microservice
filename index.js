// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

app.use(express.json());

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hola API'});
});

//Una solicitud /api/:date?
// con una fecha válida debe devolver un objeto JSON con una unix
// clave que sea una marca de tiempo Unix de la fecha de entrada en milisegundos (como tipo Número).
app.get("/api/:date?", function (req, res) {
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

app.post("/api/secure", function (req, res) {
  let { año, mes, día, hora = 0, minuto = 0, segundo = 0 } = req.body;

  // Validaciones de tipo y rango
  if (!/^\d{1,4}$/.test(String(año))) return res.status(400).json({ error: "Invalid año" });
  if (!/^\d{1,2}$/.test(String(mes))) return res.status(400).json({ error: "Invalid mes" });
  if (!/^\d{1,2}$/.test(String(día))) return res.status(400).json({ error: "Invalid día" });

  // Convertir a enteros
  año = parseInt(año);
  mes = parseInt(mes);
  día = parseInt(día);
  hora = parseInt(hora) || 0;
  minuto = parseInt(minuto) || 0;
  segundo = parseInt(segundo) || 0;

  // Crear fecha
  const fecha = new Date(año, mes - 1, día, hora, minuto, segundo);

  // Validar fecha
  if (isNaN(fecha.getTime())) {
    return res.status(400).json({ error: "Invalid Date" });
  }

  res.json({
    unix: fecha.getTime(),
    utc: fecha.toUTCString()
  });
});

module.exports = app;

// Solo iniciar el servidor si no está siendo importado (como lo hace Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor local corriendo en http://localhost:${PORT}`);
  });
}