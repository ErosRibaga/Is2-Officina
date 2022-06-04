function isAdmin(isAdmin) {
  return (req, res, next) => {
    if (req.loggedUser.admin != isAdmin) {
      return res.status(401).json({ error: 'Not allowed' });
    }

    next();
  };
}

function scopedOperations(user, operations) {
  if(user.admin) return operations;
  return operations.filter(operation => operation.employee._id == user.id);
}

function canViewOperation(user, operation) {
  return (user.admin || operation.employee._id == user.id)
}

module.exports = { isAdmin, scopedOperations, canViewOperation };
