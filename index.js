// Taken from https://developer.couchbase.com/documentation/server/5.1/sdk/nodejs/sample-app-backend.html

'use strict';

var bearerToken = require('express-bearer-token');
var bodyParser = require('body-parser');
var cors = require('cors');
var couchbase = require('couchbase');
var express = require('express');
var jwt = require('jsonwebtoken');
var config = require('./utils/config');

var JWT_KEY = 'IAMSOSECRETIVE!';

var bucket;
var cluster;


var app = express();
app.use(cors());
app.use(bodyParser.json());


// Static files are in dist/ as we build using prod mode
// We need them both with (Cloud) and without (local) the webapp/ base path
app.use(express.static('dist'));
app.use('/webapp', express.static('dist'));


function resetBucket() {
  console.log("Setting up couchbase connection...");
  cluster = new couchbase.Cluster('couchbase://localhost');
  cluster.authenticate(config.couchbase.user, config.couchbase.password);
  console.log("-- Authenticated to the Cluster.");
  console.dir(cluster);

  bucket = cluster.openBucket(config.couchbase.bucket);
  console.log("-- Opened the Bucket.");
  console.dir(bucket);

  bucket.operationTimeout = 120 * 1000;
  console.log("Done.");
}


app.get('(/webapp)?/api/airports', function(req, res) {
  console.dir(req);
  var searchTerm = req.query.search || 'paris';

  var qs = "SELECT airportname, city, country, faa from `travel-sample` WHERE LOWER(airportname) LIKE '%" + searchTerm + "%';";
  var q = couchbase.N1qlQuery.fromString(qs);

  bucket.query(q, function(err, rows) {
    if (err) {
      res.status(500).send({
        error: err
      });
      return;
    }

    res.send({
      airports: rows
    });
  });
});

app.get('(/webapp)?/api/flightPaths/:from/:to', function(req, res) {
  var fromAirport = req.params.from;
  var toAirport = req.params.to;
  var leaveDate = new Date(req.query.leave);

  var dayOfWeek = leaveDate.getDay();

  var qs1 =
      "SELECT faa AS fromAirport" +
      " FROM `travel-sample`" +
      " WHERE airportname = '" + fromAirport + "'" +
      " UNION" +
      " SELECT faa AS toAirport" +
      " FROM `travel-sample`" +
      " WHERE airportname = '" + toAirport + "';";
  var q = couchbase.N1qlQuery.fromString(qs1);
  bucket.query(q, function(err, rows) {
    if (err) {
      res.status(500).send({
        error: err,
        context: [qs1]
      });
      return;
    }

    if (rows.length !== 2) {
      res.status(404).send({
        error: "One of the specified airports is invalid.",
        context: [qs1]
      });
      return;
    }

    var toFaa = rows[0].toAirport;
    var fromFaa = rows[1].fromAirport;

    var qs2 =
        " SELECT a.name, s.flight, s.utc, r.sourceairport, r.destinationairport, r.equipment" +
        " FROM `travel-sample` AS r" +
        " UNNEST r.schedule AS s" +
        " JOIN `travel-sample` AS a ON KEYS r.airlineid" +
        " WHERE r.sourceairport = '" + fromFaa + "'" +
        " AND r.destinationairport = '" + toFaa + "'" +
        " AND s.day = " + dayOfWeek +
        " ORDER BY a.name ASC;";

    var q = couchbase.N1qlQuery.fromString(qs2);
    bucket.query(q, function(err, rows) {
      if (err) {
        res.status(500).send({
          error: err,
          context: [qs1, qs2]
        });
        return;
      }

      if (rows.length === 0) {
        res.status(404).send({
          error: "No flights exist between these airports.",
          context: [qs1, qs2]
        });
        return;
      }

      for (var i = 0; i < rows.length; ++i) {
        rows[i].flighttime = Math.ceil(Math.random() * 8000);
        rows[i].price = Math.ceil(rows[i].flighttime / 8 * 100) / 100;
      }

      res.send({
        data: rows,
        context: [qs1, qs2]
      });
    });
  })
});

app.get('(/webapp)?/api/hotel/:description/:location?', function(req, res) {
  var description = req.params.description;
  var location = req.params.location;

  var qp = couchbase.SearchQuery.conjuncts(couchbase.SearchQuery.term('hotel').field('type'));

  if (location && location !== '*') {
    qp.and(couchbase.SearchQuery.disjuncts(
        couchbase.SearchQuery.matchPhrase(location).field("country"),
        couchbase.SearchQuery.matchPhrase(location).field("city"),
        couchbase.SearchQuery.matchPhrase(location).field("state"),
        couchbase.SearchQuery.matchPhrase(location).field("address")
    ));
  }

  if (description && description !== '*') {
    qp.and(
        couchbase.SearchQuery.disjuncts(
            couchbase.SearchQuery.matchPhrase(description).field("description"),
            couchbase.SearchQuery.matchPhrase(description).field("name")
        ));
  }

  var q = couchbase.SearchQuery.new('hotels', qp)
      .limit(100);

  bucket.query(q, function(err, rows) {
    if (err) {
      res.status(500).send({
        error: err
      });
      return;
    }

    if (rows.length === 0) {
      res.send({
        data: [],
        context: []
      });
      return;
    }

    var results = [];

    var totalHandled = 0;
    for (var i = 0; i < rows.length; ++i) {
      (function(row) {
        bucket.lookupIn(row.id)
            .get('country')
            .get('city')
            .get('state')
            .get('address')
            .get('name')
            .get('description')
            .execute(function (err, docFrag) {
              if (totalHandled === -1) {
                return;
              }

              var doc = {};

              try {
                doc.country = docFrag.content('country');
                doc.city = docFrag.content('city');
                doc.state = docFrag.content('state');
                doc.address = docFrag.content('address');
                doc.name = docFrag.content('name');
              } catch (e) { }

              // This is in a separate block since some versions of the
              //  travel-sample data set do not contain a description.
              try {
                doc.description = docFrag.content('description');
              } catch (e) { }

              results.push(doc);

              totalHandled++;

              if (totalHandled >= rows.length) {
                res.send({
                  data: results,
                  context: []
                });
              }
            });
      })(rows[i]);
    }
  });
});

// Proxy for DxAPI to avoid CORS issues. This isn't 'safe', by the way.
var request = require('request');
app.use('(/webapp)?/dapi', function(req, res) {
  var url = config.dapi.rootURL + req.url;
  req.pipe(request({uri: url, headers: req.headers, rejectUnauthorized:false})).pipe(res);
});

var port = process.env.PORT || 4200;
app.listen(port, function () {
  console.log('Hackathon app listening on port ' + port);
});
resetBucket();

