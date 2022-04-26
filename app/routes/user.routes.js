module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/insert", users.create);
  router.post("/insert/csv", users.createFromCSV);

  // Retrieve all Users
  router.get("/retrieve", users.findAll);

    // Retrieve a single Tutorial with id
    router.get("/:id", users.findOne);

    // Update a Tutorial with id
    router.put("/:id", users.update);

    // Delete a Tutorial with id
    router.delete("/:id", users.delete);

      // app.use('/api', router);
  app.use('/api/users', router);
};
