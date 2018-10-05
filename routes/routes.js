

module.exports = (app) => {

  ///////////////////////////////////////////////////////////
  // Testing/Debug Middleware
  ///////////////////////////////////////////////////////////
  app.use((req, res, next) => {
    // console.debug(`DEBUG originalUrl: ${req.originalUrl}`) 
    next()
  })

  
  
  ///////////////////////////////////////////////////////////
  // API
  ///////////////////////////////////////////////////////////
  const apiRouter = require('./api')()
  app.use("/api", apiRouter)


  ///////////////////////////////////////////////////////////
  // Root Router Handler, Serves Pug rendered index
  ///////////////////////////////////////////////////////////
  app.route('/')
    .get((req, res, next) => {
      res.render('index', {
      title: "Personal Library",
      header: "Personal Library"
      })
    })


  ///////////////////////////////////////////////////////////
  // 404 Not Found Handler
  ///////////////////////////////////////////////////////////
  app.use((req, res, next) => {
    res.status(404)
    .type('text')
    .send('Page Not Found');
  })


  ///////////////////////////////////////////////////////////
  // Error Handler
  ///////////////////////////////////////////////////////////
  app.use((err, req, res, next) => {
    // console.error(err.message)

    res.send({success: false, error: err.message})
  })
}