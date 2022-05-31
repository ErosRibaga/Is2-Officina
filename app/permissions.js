function isAdmin(isAdmin) {
  return (req, res, next) => {
    if (req.loggedUser.admin != isAdmin) {
      res.status(401);
      return res.send('Not allowed');
    }

    next();
  };
}

function scopedOperations(user, operations) {
  console.log(user)
  if(user.admin) return operations;
  return operations.filter(operation => operation.employee._id == user.id);
}

function canViewOperation(user, operation) {
  return (user.admin || operation.employee._id == user.id)
}

module.exports = { isAdmin, scopedOperations, canViewOperation };
