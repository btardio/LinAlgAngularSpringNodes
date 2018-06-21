package com.btardio.angular;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import org.jblas.DoubleMatrix;
import org.jblas.exceptions.SizeException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@JsonInclude(NON_NULL)
public class RequestBodyMatrix{
	
	private final Logger log = LoggerFactory.getLogger(this.getClass());
	

	
	// read json as string
	
	private String matrix;
	
	private String matrices;
	
	private String soperations;
	
	// read json as list
	
	private List<List<Double>> mlist;
	
	private List<List<List<Double>>> mslist;
	
	private List<String> operations;
	
	// DoubleMatrix results
	
	private DoubleMatrix dmatrix;
	
	private ArrayList<DoubleMatrix> lmatrices;
	
	private ArrayList<String> loperations;	
	
	// results
	
	private DoubleMatrix rmatrix;
	
	// error message
	
	private String matError;
	
	public RequestBodyMatrix() { }
	
	//public RequestBodyMatrix( String in_matrix ){
		//this.matrix = in_matrix;
		//this.materror = null;
	//}
	
	
	
	public ArrayList<DoubleMatrix> getLmatrices() {
		return this.lmatrices;
	}
	
	public void setLMatrices(ArrayList<DoubleMatrix> in_lmatrices) {
		
	}
	
	public DoubleMatrix calc() {
		log.debug("calc();");
		this.rmatrix = this.makecalculations( this.lmatrices, this.operations );
		return this.rmatrix;
	}
	
	public String getMatError() {
		return this.matError;
	}
	
	public void setMatError(String in_error) {
		this.matError = in_error;
	}

	public String getRmatrix() {
		
		log.debug("log.debug rmatrix: " + this.rmatrix);
		
		if ( this.rmatrix == null) {
			return "";
		}
		else {
			return this.rmatrix.toString();
		}
	}
	
	public void setRmatrix( List<List<Double>> in_Rmatrix ) {
		
		log.debug(in_Rmatrix.toString());
		
		try {
			this.rmatrix = mlisttodmlist(in_Rmatrix);
		}
		catch (IOException e) {
			log.debug(e.getMessage());
			// todo
		}
		
	}
	
	public List<List<Double>> getMlist(){
		return this.mlist;
	}
	
	public void setMlist( List<List<Double>> in_MList ) {
		
		log.debug("MList");
		
		log.debug(in_MList.toString());
	
		this.mlist = in_MList;
		
		log.debug(this.mlist.toString());
		
		try {
			this.dmatrix = mlisttodmlist(in_MList).transpose();
		}
		catch (IOException e) {
			log.debug(e.getMessage());
			// todo
		}
			
		log.debug(this.dmatrix.toString());
		
	}
	
	public List<List<List<Double>>> getMslist(){
		
		return this.mslist;
	}
	
	// TODO: combine into setMatrices
	public DoubleMatrix setMslist( List<List<List<Double>>> in_mslist ) {
	
		log.debug("setMslist");
		
		this.mslist = in_mslist;
		
		this.lmatrices = new ArrayList<DoubleMatrix>();
		
		for ( List<List<Double>> l : this.mslist ) {
			try {
				this.lmatrices.add(mlisttodmlist(l).transpose());
			}
			catch (IOException e) {
				log.debug(e.getMessage());
				// todo
			}
		}
		
		
		 
		
		
		
		//ArrayList<ArrayList<Double>> rmatrix = new ArrayList<ArrayList<Double>>();
		
		//if ( this.operations != null ) { //&& this.lmatrices.size() > 1 && this.operations.size() + 1 == this.lmatrices.size() ) {
			
		//	this.rmatrix = this.makecalculations(this.lmatrices, this.operations);
			
		//}
		
		//log.debug(this.rmatrix.toString());
		
		return this.rmatrix;
		
	}	
	
	public String getMatrix() {
		return this.matrix;
	}
	
	public void setMatrix ( String in_matrix ) {
		this.matrix = in_matrix;
		
		try {
			this.dmatrix = matrixtodmatrix(this.matrix).transpose();
		}
		catch (IOException e) {}
		
		log.debug(this.dmatrix.toString());
		
	}
	
	public String getMatrices() {
		return this.matrices;
	}
	
	public void setMatrices( String in_matrices ) {
		
		this.matrices = in_matrices;

		this.lmatrices = new ArrayList<DoubleMatrix>();
		
		log.debug(this.matrices);
		
		try {
			JSONArray jsonArray = new JSONArray( this.matrices );
			
			for (int i = 0; i < jsonArray.length(); i++) {
				String matrix = jsonArray.getJSONArray(i).toString();
				log.debug(matrix);
				log.debug(matrixtodmatrix(matrix).toString());
				this.lmatrices.add(matrixtodmatrix(matrix).transpose());
			}
		}
		catch (JSONException e) {
			log.debug(e.getMessage());
			// todo exception
		}
		catch (IOException e) {
			log.debug(e.getMessage());
			// todo exception
		}
		
		for ( DoubleMatrix d : this.lmatrices ) {
			log.debug(d.toString());
		}
		
		
		
	}
	
	public List<String> getOperations() {
		return this.operations;
	}
	
	public void setOperations( List<String> in_operations ) {
		this.operations = in_operations;

		log.debug(this.operations.toString());
		
	}
	
	public String getSoperations() {
		return this.soperations;
	}
	
	public void setSoperations( String in_soperations ) {
		this.soperations = in_soperations;

		this.loperations = new ArrayList<String>();
		
		log.debug(this.soperations);
		
		try {
			JSONArray jsonArray = new JSONArray( this.soperations );
			
			for (int i = 0; i < jsonArray.length(); i++) {
				String operation = jsonArray.getString(i);
				log.debug(operation);
				this.loperations.add(operation);
			}
		}
		catch (JSONException e) {
			log.debug(e.getMessage());
			// todo exception
		}
		
		
		for ( String s : this.loperations ) {
			log.debug(s);
		}
		
		log.debug(this.loperations.toString());
	}
	
	@Override
    public String toString () {
		if ( this.matrix != null ) {
			return ("{\"matrix\":\"" + this.matrix + "\"}");
		}
		else if (this.matrices != null ) {
			return ("{\"matrices\":\"" + this.matrices + "\"}");
		}
		else if (this.mlist != null ) {
			return ("{\"mlist\":" + this.mlist + "\"}");
		}
		else {
			return ("{\"mslist\":" + this.mslist + "\"}");
		}
	}
	
	private DoubleMatrix mlisttodmlist ( List<List<Double>> matrix ) throws IOException {
		
		ArrayList<Double> dblsarray = new ArrayList<Double>();
		
		int w = -1;
		int h = matrix.size();
		
		for ( List<Double> row : matrix ) {
			
			if ( w == -1 ) {
				w = row.size();
			}
			else if ( w != row.size() ) {
				throw new IOException("Matrix dimensions are inaccurate.");
			}

			for ( Double dbl : row ) {
				dblsarray.add(dbl);
			}
		}
		
		double[] darray = new double[dblsarray.size()];

		for ( int i = 0; i < dblsarray.size(); i++ ) {
			darray[i] = (double) dblsarray.get(i);
		}
		
		return new DoubleMatrix(w,h,darray).transpose();

		
	}
	
	
	private DoubleMatrix matrixtodmatrix( String matrix ) throws IOException {
		
		ArrayList<Double> dblsarray = new ArrayList<Double>();
		
		int w = -1;
		int h = -1;
		
		try {
			
			JSONArray jsonArray = new JSONArray( matrix );
			
			w = -1;
			h = jsonArray.length();
			
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONArray row = jsonArray.getJSONArray(i);
				
				w = row.length();
				
				for (int j = 0; j < row.length(); j++) {
					
					if ( row.length() != w ) {
						throw new IOException("All rows not of same size.");
					}
					
					dblsarray.add(row.getDouble(j));
					
				}
				
			}
			
		}
		catch( JSONException e ){
			throw new IOException("Problem parsing matrix.");
		}

		double[] darray = new double[dblsarray.size()];

		for ( int i = 0; i < dblsarray.size(); i++ ) {
			darray[i] = (double) dblsarray.get(i);
		}
		
		return new DoubleMatrix(w,h,darray).transpose();
		
	}
	

	
	DoubleMatrix makecalculations(List<DoubleMatrix> matrices, List<String> operations) {

		if ( matrices == null || operations == null ) {
			return null;
		}
		
		log.debug("makecalculations();");
		
		DoubleMatrix result = null;
		
		if ( matrices.size() - 1 != operations.size()) {
			this.matError = new String("Number of matrix operations does not agree with number of matrices.");
			return result;
		}				
		
		for ( int i = matrices.size() - 1; i >= 0; i-- ) {
			
			if ( i == matrices.size() - 1) {
				// if this is the first iteration set result to same as first matrix
				try{
					result = matrices.get(i);
				}
				catch (SizeException e) {
					this.matError = new String("Unknown error.");
					return result;
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
						this.matError = new String("Matrices have different size rows and columns for addition.");
						return result;
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
						this.matError = new String("Matrices have different size rows and columns for subtraction.");
						return result;
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
							this.matError = new String("Unknown error.");
							return result;
						}
					}else {
										
						try {
							result = matrices.get(i).mmul(result);
						}
						catch (SizeException e) {
							this.matError = new String("Dimensions do not agree for matrix multiplication.");
							return result;
						}
					}
				}
			}
		}
		
		return result;
	}
	
	
}