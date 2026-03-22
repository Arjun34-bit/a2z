import sequelize from '../db/index';

export const createOrderInDB = async (userId: number, productName: string, quantity: number) => {
  const [newOrder]: any = await sequelize.query(
    `INSERT INTO "Orders" (user_id, product_name, quantity) 
     VALUES (:userId, :product_name, :quantity) RETURNING *`,
    { replacements: { userId, product_name: productName, quantity } }
  );
  return newOrder[0];
};

export const getOrdersFromDB = async (role?: string, userId?: number) => {
  let query = `SELECT o.*, u.name as user_name, u.email as user_email 
               FROM "Orders" o 
               JOIN "Users" u ON o.user_id = u.id`;
  let replacements: Record<string, any> = {};

  if (role !== 'admin') {
    query += ` WHERE o.user_id = :userId`;
    replacements = { userId };
  }

  query += ` ORDER BY o.created_at DESC`;

  const [orders] = await sequelize.query(query, { replacements });
  return orders;
};
