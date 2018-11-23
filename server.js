var mikroNode = require('mikronode'),
  requestController = require('./Controllers/request-controller.js'),
  controllerMongo = require('./Controllers/mongo-controller.js'),
  url = require('url'),
  express = require('express'),
  http = require('http'),
  path = require('path'),
  WebSocket = require('ws'),
  app = require('./app.js'),

  //Login start

  MongoClient = require('mongodb').MongoClient,
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcryptjs'),
  createError = require('http-errors'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  expressValidator = require('express-validator'),
  flash = require('connect-flash'),
  session = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  logger = require('morgan');


const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'caramelNetworkDb';
const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true
});
var db;

client.connect(function (err) {
  if (err == null) {
    console.log("Connected successfully to server");
    db = client.db(dbName);
    db.createCollection("users", function (err, res) {
      if (err) throw err;
      else {
        db.collection("users").insertOne({
          username: "admin",
          password: "$2a$10$Zfua7.PuYGhI3j7PzmyVneAkv3WFB5mx4oxgW9wZ90RNoAIkud8GC"
        }, function (req, res) {
          if (err) throw err;
        })
      }
    });

  } else {
    console.log(err.message);
  }
});

//login end


const wss = new WebSocket.Server({
  port: 8081
});
const wssForUsers = new WebSocket.Server({
  port: 8082
});


var routerSubMaskIp = '192.168.8';
var routerIp = routerSubMaskIp + '0.1';
var mikroTipObject = new mikroNode(routerIp);



const databaseName = 'caramelNetworkDb';
const networkDnsLog = 'networkDnsLog';
const networkUserDetails = 'networkUserDetails';
const networkUserRequestDetails = 'networkUserRequestDetails';

var app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'Views/public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

/* app.use(function (req, res, next) {
  next(createError(404));
}); */

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = http.createServer(app);


const databasePromise = new Promise(function (resolve, reject) {
  try {

    controllerMongo.createConnection(databaseName, networkDnsLog, networkUserDetails, networkUserRequestDetails, resolve);

  } catch (ex) {

    reject('error');

  }
});
databasePromise
  .then(function whenOk(response) {

    // mikroConnection();
    // setInterval(function () {

    //     mikroConnection( "inLoop" );

    //   }, 5000  );


    app.get('/', function (req, res) {

      res.render("index", {
        "listObj": []
      });

    });

    app.get('/index', function (req, res) {

      res.render("index", {
        "listObj": []
      });

    });

    app.get('/users', function (req, res) {

      controllerMongo.getAllUserDetails(res);

    });

    app.get('/user', ensureAuthenticated, function (req, res) {

      controllerMongo.getAllUserRequestDetails(req.query.ip, res);

    });

    //login start
    app.get('/login', function (req, res, next) {
      res.render('login', {
        title: 'Login'
      });
    });
    app.get('/changePassword', ensureAuthenticated, function (req, res, next) {
      res.render('changePassword', {
        title: 'Login'
      });
    });

    app.post('/changePassword', ensureAuthenticated, function (req, res, next) {
      console.log(req.body);
      if (req.body.NewPassword.length < 8) {
        req.flash('error_msg', 'Password should be minimum 8 characters long');
        res.redirect('/changePassword');
      } else if (req.body.NewPassword != req.body.cNewPassword) {
        req.flash('error_msg', 'Passwords do not match');
        res.redirect('/changePassword');
      } else {

        bcrypt.hash(req.body.NewPassword, 10, function (err, hash) {
          if (!err) {

            db.collection('users').updateOne({
              "username": "admin"
            }, {
              $set: {
                "password": hash
              }
            }, function (err, r) {
              if (!err) {
                req.flash('success_msg', 'Password is changed');
                res.redirect('/login');
              } else {
                req.flash('error_msg', 'Could not change password');
                res.redirect('/changePassword');
              }
            });
          } else {
            req.flash('error', err.message);
            res.redirect('/changePassword');
          }
        });
      }

    });

    app.post('/login',
      passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      }),
      function (req, res) {
        res.redirect('/');
      });

    app.get('/logout', function (req, res) {
      req.logout();
      req.flash('success_msg', 'you are out');
      res.redirect('/login');
    });
    //login end

    app.listen(4000);
  })
  .catch(function notOk(err) {

    console.error(err)

  });

//login start
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/login');
  }
}

passport.use(new LocalStrategy(
  function (username, password, done) {

    db.collection('users').findOne({
      username: username
    }, function (err, r) {
      if (!err) {
        if (r) {
          bcrypt.compare(password, r.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
              return done(null, r);
            } else {
              return done(null, false, {
                message: 'Invalid password'
              });
            }
          });
        } else {
          return done(null, false, {
            message: 'Incorrect username or password'
          });
        }
      } else {
        throw err;
      }
    });
  }));

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  db.collection('users').findOne({
    username: username
  }, function (err, r) {
    if (!err) {
      done(err, r);
    }
  });
});

//login end

wss.on('connection', ws => {

  ws.on('message', message => {

    var msgObj = JSON.parse(message);
    controllerMongo.getAllUserRequestDetailsByIp(msgObj.ipAddress, msgObj.timestamp, ws);

  });

});



wssForUsers.on('connection', ws => {

  ws.on('message', message => {

    var msgObj = JSON.parse(message);
    controllerMongo.getAllUserDetailsWs(ws);

  });

});



////////////////////////////////////////
////////////////////////////////////////
//@Since 1.0 ///////////////////////////
// Connecting to the mikroTik router live and performing
function mikroConnection(times = null) {


  mikroTipObject.connect()
    .then(([login]) => {

      return login('admin', '<<"Ctch@PHase5DHA">>');

    })
    .then(function (mtConnection) {

      var channelDnsDetails = mtConnection.openChannel("getDns");
      channelDnsDetails.write('/ip/dns/cache/getall');
      channelDnsDetails.on('trap', function (data) {
        console.log(data);
        console.log('DNS request failed');
      });
      channelDnsDetails.on('done', function (result) {
        var dnsDetails = result.data;
        var dnsdetailsList = [];
        if (times == null) {

          generateDns(dnsDetails, dnsdetailsList, callbackGenerateDns = function (dnsDetails, dnsdetailsList) {
            setTimeout(function () {
              generateDns(dnsDetails, dnsdetailsList, callbackGenerateDns)
            }, 0);
          });

        } else {

          generateDnsInLoop(dnsDetails, dnsdetailsList, callbackGenerateDns = function (dnsDetails, dnsdetailsList) {
            setTimeout(function () {
              generateDnsInLoop(dnsDetails, dnsdetailsList, callbackGenerateDns)
            }, 0);
          });

        }
        channelDnsDetails.close();
        mtConnection.close();
      });
    });
}

function generateDns(dnsDetails, dnsdetailsList, callbackGenerateDns) {

  item = dnsDetails.shift();
  if (item) {
    dnsdetailsList.push({
      'ipAddress': item[2].value,
      'urlLink': item[1].value
    });
    callbackGenerateDns(dnsDetails, dnsdetailsList);
  } else {
    controllerMongo.saveDnsDetails(dnsdetailsList);
    requestController.requestControllerMain(controllerMongo);

  }
}

function generateDnsInLoop(dnsDetails, dnsdetailsList, callbackGenerateDns) {

  item = dnsDetails.shift();
  if (item) {
    dnsdetailsList.push({
      'ipAddress': item[2].value,
      'urlLink': item[1].value
    });
    callbackGenerateDns(dnsDetails, dnsdetailsList);
  } else {
    controllerMongo.saveDnsDetails(dnsdetailsList);

  }
}