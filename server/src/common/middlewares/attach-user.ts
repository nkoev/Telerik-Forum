
export function attachUser(req, _, next) {
  req.user = {
    id: '6fdc0baa-acd3-4df8-854b-8a571b2b6612',
    roles: ['Admin']
  }
  next();
};
