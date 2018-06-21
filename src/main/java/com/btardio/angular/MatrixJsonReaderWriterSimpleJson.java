package com.btardio.angular;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jblas.DoubleMatrix;


public class MatrixJsonReaderWriterSimpleJson extends MatrixJsonReaderWriter{
		
//	private List<List<List<Double>>> matrices;
//
//	private List<DoubleMatrix> dmatrices;
//	
//	protected List<String> operations;
//	
//	protected String error;
	
	public MatrixJsonReaderWriterSimpleJson() {
		// TODO Auto-generated constructor stub
	}
	
	public MatrixJsonReaderWriterSimpleJson( String error ) {
		//this.error = error;
		super.setError( error );
	}	

	public ArrayList<DoubleMatrix> getDmatrices(){
		//return this.dmatrices;
		return super.getDmatrices();
	}
	
	public String getError() {
		//return this.error;
		return super.getError();
	}

    public ArrayList<String> getOperations(){
    	//return this.operations;
    	return super.getOperations();
    }
    
    public void setOperations(ArrayList<String> operations) {
    	//this.operations = operations;
    	super.setOperations(operations);
    }
    
	public ArrayList<ArrayList<ArrayList<Double>>> getMatrices(){
		//return this.matrices;
		return super.getMatrices();
	}

	public void setMatrices(ArrayList<ArrayList<ArrayList<Double>>> matrices) {
		
		ArrayList<DoubleMatrix> newdmatrices = new ArrayList<DoubleMatrix>();
		
//		if ( this.dmatrices == null ) {
//			this.dmatrices = new ArrayList<DoubleMatrix>();
//		}
//		else {
//			this.dmatrices.clear();
//		}
		
		for ( ArrayList<ArrayList<Double>> m : matrices) {
			try {
				newdmatrices.add( super.todblmatlist( m ) );
			} catch (IOException e) {
				super.setError(e.getMessage());
				e.printStackTrace();
			}
		}
		
		super.setDmatrices(newdmatrices);
		super.setMatrices(matrices);
		//this.matrices = matrices;
		
	}
}
