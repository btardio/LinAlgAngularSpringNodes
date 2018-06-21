package com.btardio.angular;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jblas.DoubleMatrix;


public class MatrixJsonReaderWriterUnknownType extends MatrixJsonReaderWriter {
			
	protected String error;
	
	public MatrixJsonReaderWriterUnknownType() {
		this.error = new String("Unrecognized type. Use @type:SimpleJson or @type:Mathematica");
	}
	
	public String getError() {
		return this.error;
	}

}
