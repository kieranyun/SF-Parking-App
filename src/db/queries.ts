export const QUERIES = {
  streetSweepingTableExists:
    `
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'street_sweeping'
      );
    `,
  checkRowCount: `SELECT COUNT(*) FROM street_sweeping`,


}