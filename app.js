var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const isbot = require('isbot')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('/AASA', (req, res, next) => {
  const aasa = path.join(__dirname, 'apple-app-site-association')

  res.set('Content-Type', 'application/pkcs7-mime')
  res.status(200)
  res.sendFile(aasa)
})
app.use(express.static(path.join(__dirname, 'public')));

// import ReactDOMServer from 'react-dom/server';
// import { StaticRouter } from 'react-router-dom';

// app.get('/*', (req, res) => {
//   const context = {};
//   const app = ReactDOMServer.renderToString(
//     <StaticRouter location={req.url} context={context}>
//       <App />
//     </StaticRouter>
//   );

//   const indexFile = path.resolve('./build/index.html');
//   fs.readFile(indexFile, 'utf8', (err, data) => {
//     if (err) {
//       console.error('Something went wrong:', err);
//       return res.status(500).send('Oops, better luck next time!');
//     }

//     return res.send(
//       data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
//     );
//   });
// });

app.get('/sitemap.xml', (req, res, next) => {
  res.sendFile(path.join(__dirname, './', 'sitemap.xml'));
});

app.get('*', (req, res, next) => {
  if(isbot(req.get('user-agent'))) { // request from bot
    res.sendFile(path.join(__dirname, 'public/build', req.url, 'index.html'));
  } else {
    next()
  }
}, express.static(path.join(__dirname, 'public', 'build')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
