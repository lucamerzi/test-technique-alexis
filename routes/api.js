const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("fast-csv");
const path = require('path');
const _ = require("lodash");
const distance = require("../helpers/distance");

/**
* L'API doit expose une route sur laquelle nous enverrons un objet JSON décrivant les points d'intérêts.
*
*/

router.post("/", async (req, res, next) => {
  try {
    if (!_.isArray(req.body)) {
      throw new Error("Body should be an array")
    }
    if (_.isEmpty(req.body)) {
      throw new Error("Should not be empty")
    }
    const locations = req.body.map(data => ({
      ...data,
      click: 0,
      imp: 0
    }));

    const events = [];

    const stream = fs.createReadStream(path.resolve(__dirname, "../csv-file/events.csv"));

    const csvStream = csv()
      .on("data", (data) => {
        events.push(data)
      })
      .on("finish", () => {
        events.slice(1).map((event) => {
          const dist = locations.map(loc => {
            return distance(loc.lat, parseFloat(event[0]), loc.lon, parseFloat(event[1]))
          });
          const index = _.findIndex(dist, (val) => val === _.min(dist));
          const location = locations[index];
          switch (event[2]) {
            case "imp":
              location.imp++;
              break;
            case "click":
              location.click++;
          }
        })
      })
      .on("end", (e) => {
        const result = {}
        locations.forEach(el => {
          result[el.name] = el
        })
        res.send(result);
      });

    stream.pipe(csvStream);
  } catch (error) {
    res.send(error.message)
  }

});

module.exports = router;
