
export function attachUser(req, _, next): void {
  req.user = {
    id: '6fdc0baa-acd3-4df8-854b-8a571b2b6612',
    username: 'admin',
    roles: ['Admin']
  }
  next();
};
