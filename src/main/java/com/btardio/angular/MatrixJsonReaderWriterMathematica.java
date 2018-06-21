package com.btardio.angular;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jblas.DoubleMatrix;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(using = MatrixJsonReaderWriterMathematicaSerializer.class)
@JsonDeserialize(using = MatrixJsonReaderWriterMathematicaDeserializer.class)
public class MatrixJsonReaderWriterMathematica extends MatrixJsonReaderWriter{

//	private List<DoubleMatrix> dmatrices;
//	
//	private List<List<List<Double>>> matrices;
//	
//	private List<String> operations;
//	
//	protected String error;
//	
	public MatrixJsonReaderWriterMathematica() {
	}
	
	public MatrixJsonReaderWriterMathematica( String error ) {
		//this.error = error;
		super.setError(error);
	}
	
	public MatrixJsonReaderWriterMathematica(ArrayList<ArrayList<ArrayList<Double>>> matrices, 
											 ArrayList<String> operations,
											 ArrayList<DoubleMatrix> dmatrices) {
		//this.matrices = matrices;
		//this.operations = operations;
		//this.dmatrices = dmatrices;
		super.setMatrices(matrices);
		super.setOperations(operations);
		super.setDmatrices(dmatrices);
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
    
    public ArrayList<DoubleMatrix> getDmatrices(){
    	//return this.dmatrices;
    	return super.getDmatrices();
    }
    
	public ArrayList<ArrayList<ArrayList<Double>>> getMatrices(){
		//return this.matrices;
		return super.getMatrices();
	}

	public void setMatrices(ArrayList<ArrayList<ArrayList<Double>>> matrices) {
		
//		if ( this.dmatrices == null ) {
//			this.dmatrices = new ArrayList<DoubleMatrix>();
//		}
//		else {
//			this.dmatrices.clear();
//		}
		
//		for ( List<List<Double>> m : matrices) {
//			try {
//				this.dmatrices.add( super.todblmatlist( m ) );
//			} catch (IOException e) {
//				this.error = e.getMessage();
//				e.printStackTrace();
//			}
//		}
//		
//		this.matrices = matrices;
		
		ArrayList<DoubleMatrix> newdmatrices = new ArrayList<DoubleMatrix>();
		
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
		
	}

}
