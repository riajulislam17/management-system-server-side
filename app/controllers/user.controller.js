const e = require("cors");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {

  // Create a User
  const user = {
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email
  };

  // Save User in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Create and Save new multi User
exports.createFromCSV = (req, res) => {
  const data = req.body.users;
  const dataList = JSON.parse(data)
  Object.keys(dataList).map((keys) => {

    if (dataList[keys].hasOwnProperty('first_name') && dataList[keys].hasOwnProperty('last_name') && dataList[keys].hasOwnProperty('email')) {

      if (dataList[keys].first_name.length > 0 && dataList[keys].last_name.length > 0 && dataList[keys].email.length > 0) {
        const user = {
          first_name: dataList[keys].first_name,
          last_name: dataList[keys].last_name,
          email: dataList[keys].email
        };
        // console.log('done')
        // Save User in the database
        User.create(user)
          .then(data => {
            res.send(data);
          }
          )
          .catch(err => {
            // res.send({
            //   message:
            //     err.message || "Some error occurred while creating the User."
            // });
            // console.log(err)
          });
      }
      else {
        console.warn(data,'data rejected')
      }
    }
    else {
      console.log('wrong structure')
    }
  })
  // res.
};

const getPagination = (page, size) => {
  const limit = size;
  const offset = page*size;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, users, totalPages, currentPage };
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  const { limit, offset } = getPagination(page, size);
  User.findAndCountAll({limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send({
        message: "Error retrieving User with id=" + id
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.send({
        message: "Could not delete User with id=" + id
      });
    });
};