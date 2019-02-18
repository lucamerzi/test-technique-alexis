const port = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Allow retrieval of req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Allow Cross-Origin Resource Sharing (cors)
// (access the API from the frontend JavaScript on a different domain/origin)
app.use(
  cors({
    // allow other domains/origins to send cookies
    credentials: true,
    // this is the domain we want cookies from (our React app)
    origin: ["http://localhost:3001"]
  })
);

app.use("/api", require("./routes/api"));

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});