import sequelize from '../db/index';

class SupplierService {
  public createSupplierInDB = async (name: string, contactInfo: string | null) => {
    const [newSupplier]: any = await sequelize.query(
      `INSERT INTO "Suppliers" (name, contact_info) 
       VALUES (:name, :contact_info) RETURNING *`,
      { replacements: { name, contact_info: contactInfo } }
    );
    return newSupplier[0];
  };

  public getAllSuppliersFromDB = async () => {
    const [suppliers] = await sequelize.query(
      `SELECT * FROM "Suppliers" ORDER BY created_at DESC`
    );
    return suppliers;
  };
}

export const supplierService = new SupplierService();
