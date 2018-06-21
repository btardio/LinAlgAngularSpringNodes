
/**
 * This class is used for checking that number of rows and number of columns
 * agree for a certain linear algebra operation.
 */
export class Dimensions {
  private n_columns: number;
  private n_rows: number;

  constructor(n_rows: number, n_columns) {
    this.n_rows = n_rows;
    this.n_columns = n_columns;
  }

  /**
   * Return number of columns.
   */
  getColumnsDimensions(): number {
    return this.n_columns;
  }

  /**
   * Return number of rows.
   */
  getRowsDimensions(): number {
    return this.n_rows;
  }

}
