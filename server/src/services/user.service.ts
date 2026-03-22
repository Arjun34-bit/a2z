import sequelize from '../db/index';

export const checkEmailExists = async (email: string) => {
  const [users]: any = await sequelize.query(
    `SELECT id FROM "Users" WHERE email = :email LIMIT 1`,
    { replacements: { email } }
  );
  return users.length > 0;
};

export const findUserByEmail = async (email: string) => {
  const [users]: any = await sequelize.query(
    `SELECT * FROM "Users" WHERE email = :email LIMIT 1`,
    { replacements: { email } }
  );
  return users.length > 0 ? users[0] : null;
};

export const createUser = async (name: string, email: string, passwordHash: string, role: string) => {
  const [newUser]: any = await sequelize.query(
    `INSERT INTO "Users" (name, email, password, role) 
     VALUES (:name, :email, :password, :role) RETURNING id, name, email, role`,
    { replacements: { name, email, password: passwordHash, role } }
  );
  return newUser[0];
};
