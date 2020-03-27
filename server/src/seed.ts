import { Repository, In, createConnection } from "typeorm";
import { Role } from "./database/entities/role.entity";
import { UserRoles } from "./models/users/roles.enum";
import { User } from "./database/entities/user.entity";

const seedRoles = async (connection: any) => {
  const rolesRepo: Repository<Role> = connection.manager.getRepository(Role);

  const roles: Role[] = await rolesRepo.find();
  if (roles.length) {
    console.log('The DB already has roles!');
    return;
  }

  const rolesSeeding: Role[] = Object.keys(UserRoles).map(
    (roleName: string) => rolesRepo.create({ name: roleName })
  );

  await rolesRepo.save(rolesSeeding);
  console.log('Seeded roles successfully!');
};

const seedAdmin = async (connection: any) => {
  const userRepo: Repository<User> = connection.manager.getRepository(User);
  const rolesRepo: Repository<Role> = connection.manager.getRepository(Role);

  const admin = await userRepo.findOne({
    where: {
      username: 'admin',
    },
  });

  if (admin) {
    console.log('The DB already has an admin!');
    return;
  }

  const roleNames: string[] = Object.keys(UserRoles);
  const allUserRoles: Role[] = await rolesRepo.find({
    where: {
      name: In(roleNames),
    },
  });

  if (allUserRoles.length === 0) {
    console.log('The DB does not have any roles!');
    return;
  }

  const username = 'admin';
  const password = 'Aaa123';
  // const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin: User = userRepo.create({
    username,
    password,
    roles: allUserRoles,
  });

  await userRepo.save(newAdmin);
  console.log('Seeded admin successfully!');
};

const seed = async () => {
  console.log('Seed started!');
  const connection = await createConnection();

  await seedRoles(connection);
  await seedAdmin(connection);

  await connection.close();
  console.log('Seed completed!');
};

seed().catch(console.error);