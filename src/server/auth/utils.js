import models from '../models';

export function isAdmin(user, options = {}) {
  if (!user) {
    return false;
  }
  return models.user.findById(user.id, Object.assign({
    include: [models.role],
  }, options)).then(theUser =>
    models.role.find(Object.assign({
      where: {
        role: 'admin'
      },
    }, options)).then(admin =>
      theUser.hasRole(admin, options)
    )
  );
}

export function isManager(user, options = {}) {
  if (!user) {
    return false;
  }
  return models.user.findById(user.id, Object.assign({
    include: [models.role],
  }, options)).then(theUser =>
    models.role.find(Object.assign({
      where: {
        role: 'manager'
      },
    }, options)).then(manager =>
      theUser.hasRole(manager, options)
    )
  );
}
