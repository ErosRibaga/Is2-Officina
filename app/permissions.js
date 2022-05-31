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
  if(user.admin) return operations;
  return operations.filter(operation => operation.employee == 'Mario Limone');
}

function canViewOperation(user, operation) {
  return (user.admin || operation.employee == 'Mario Limone')
}

module.exports = { isAdmin, scopedOperations, canViewOperation };
