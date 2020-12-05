const cors = require('cors');

const express = require('express');

const port = process.env.PORT || 3000;

var user = require('./routes/user');

var app = express();

// To prevent network error when client and server are on same localhost but different ports -- allow control access origin
app.use(cors());
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,Cache-Control,Accept,X-Access-Token ,X-Requested-With, Content-Type, Access-Control-Request-Method"
  );
  if (req.method === "OPTIONS") return res.status(200).end();

  next();
});

app.use('/user', user);

app.listen(port, () => {
  console.log(`Server has started on internal port ${port}. The docker port may be different`);
})
