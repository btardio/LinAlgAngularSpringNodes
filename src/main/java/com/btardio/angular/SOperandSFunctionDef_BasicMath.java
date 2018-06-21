package com.btardio.angular;

import java.util.List;

import org.jblas.DoubleMatrix;
import org.jblas.exceptions.SizeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SOperandSFunctionDef_BasicMath {

	private final Logger log = LoggerFactory.getLogger(this.getClass());
	
	MatrixJsonReaderWriter rw;
	
	public SOperandSFunctionDef_BasicMath( MatrixJsonReaderWriter rw) {
		this.rw = rw;
	}
	
	public MatrixJsonReaderWriter result() {
		
		try {
			this.rw.setRdmatrix(this.makecalculations(this.rw.getDmatrices(), this.rw.getOperations()));
		}
		catch ( ArithmeticException e){
			this.rw.setError(e.getMessage());
		}
		return this.rw;
		
	}
	
	private DoubleMatrix makecalculations(List<DoubleMatrix> matrices, 
								  List<String> operations) throws ArithmeticException {

		if ( matrices == null ) {
			throw new ArithmeticException("parameter matrices is missing.");
		}
				
		if ( operations == null ) {
			throw new ArithmeticException("parameter operations is missing.");
		}
		
		log.debug("makecalculations();");
		
		DoubleMatrix result = null;
		
		if ( matrices.size() - 1 != operations.size()) {
			throw new ArithmeticException("Number of matrix operations does not agree with number of matrices.");
			//return result;
		}				
		
		for ( int i = matrices.size() - 1; i >= 0; i-- ) {
			
			if ( i == matrices.size() - 1) {
				// if this is the first iteration set result to same as first matrix
				try{
					result = matrices.get(i);
				}
				catch (SizeException e) {
					throw new ArithmeticException("Unknown error.");
					//return result;
				}
			}
			else {
			
				if ( operations.get( i ).equals("+") ) {
	
					if (result == null) {
						// if this is the first operation set result to same size as first matrix
						result = DoubleMatrix.zeros(matrices.get(0).rows, matrices.get(0).columns);
					}				
					
					// add the matrix, catching a size exception
					try{
						result = result.add(matrices.get(i));
					}
					catch (SizeException e) {
						throw new ArithmeticException("Matrices have different size rows and columns for addition.");
						//return result;
					}
				}
				else if ( operations.get( i ).equals("-") ) {
					
					if (result == null) {
						// if this is the first operation set result to same size as first matrix
						result = DoubleMatrix.zeros(matrices.get(0).rows, matrices.get(0).columns);
					}					
					
					// subtract the matrix, catching a size exception
					try{
						result = result.sub(matrices.get(i));
					}
					catch (SizeException e) {
						throw new ArithmeticException("Matrices have different size rows and columns for subtraction.");
						//return result;
					}
				}
				
				else if ( operations.get( i ).equals(".") || 
						  operations.get( i ).equals("*") ) {
			
					if (result == null) {
						// if this is the first operation set result to same size as first matrix
						try{
							result = matrices.get(i);
						}
						catch (SizeException e) {
							throw new ArithmeticException("Unknown error.");
							//return result;
						}
					}else {
										
						try {
							result = matrices.get(i).mmul(result);
						}
						catch (SizeException e) {
							throw new ArithmeticException("Dimensions do not agree for matrix multiplication.");
							//return result;
						}
					}
				}
			}
		}
		
		return result;
	}	

}
