package com.btardio.angular;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jblas.DoubleMatrix;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;




@JsonInclude(NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(defaultImpl = MatrixJsonReaderWriterUnknownType.class,
              use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY)
@JsonSubTypes({
    @JsonSubTypes.Type(value = MatrixJsonReaderWriterMathematica.class, 
    		           name = StaticProperties.SUBTYPE_MATHEMATICA),

    @JsonSubTypes.Type(value = MatrixJsonReaderWriterSimpleJson.class, 
                       name = StaticProperties.SUBTYPE_SIMPLEJSON),
    
    @JsonSubTypes.Type(value = MatrixJsonReaderWriterSimpleString.class, 
                       name = StaticProperties.SUBTYPE_SIMPLESTRING),
    
    
    
	}
)

public abstract class MatrixJsonReaderWriter {
	
	protected String type;
	
	private ArrayList<ArrayList<ArrayList<Double>>> matrices;

	private ArrayList<DoubleMatrix> dmatrices;
	
	private ArrayList<String> operations;
	
	private String error;
	
	private DoubleMatrix rdmatrix;
	
	private ArrayList<ArrayList<Double>> rmatrix;
	
	public ArrayList<ArrayList<Double>> getRmatrix() {
		return this.rmatrix;
	}
	
	public void setRmatrix( ArrayList<ArrayList<Double>> rmatrix ) {
		this.rmatrix = rmatrix;
	}
	
	public DoubleMatrix getRdmatrix() {
		return this.rdmatrix;
	}
	
	public void setRdmatrix(DoubleMatrix rdmatrix) {
		this.rdmatrix = rdmatrix;
		this.rmatrix = this.toarraylstdbl(rdmatrix);
	}
	
	public String getError() {
		return this.error;
	}
	
	public void setError(String error) {
		this.error = error;
	}

    public ArrayList<String> getOperations(){
    	return this.operations;
    }
    
    public void setOperations(ArrayList<String> operations) {
    	this.operations = operations;
    }

	public ArrayList<ArrayList<ArrayList<Double>>> getMatrices() {
		return this.matrices;
	}	
	
	public void setMatrices(ArrayList<ArrayList<ArrayList<Double>>> matrices) {
		this.matrices = matrices;
		
		ArrayList<DoubleMatrix> newdmatrices = new ArrayList<DoubleMatrix>();
		
		for ( ArrayList<ArrayList<Double>> m : matrices) {
			try {
				newdmatrices.add( MatrixJsonReaderWriter.todblmatlist( m ) );
			} catch (IOException e) {
				this.setError(e.getMessage());
				e.printStackTrace();
			}
		}
		
		this.setDmatrices(newdmatrices);
		//this.setMatrices(matrices);		
		//this.matrices = matrices;
		
	}	
	
	public ArrayList<DoubleMatrix> getDmatrices(){
		return this.dmatrices;
	}
	
	public void setDmatrices(ArrayList<DoubleMatrix> dmatrices) {
		this.dmatrices = dmatrices;
	}
	
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    
    private ArrayList<ArrayList<Double>> toarraylstdbl ( DoubleMatrix matrix ){
    	
    	ArrayList<ArrayList<Double>> outlst = new ArrayList<ArrayList<Double>>();
		
		double[] matrixdbl = matrix.transpose().data;  // added transpose 6-19-18
		
		for ( int i = 0; i < matrix.rows; i++ ) {
			outlst.add( new ArrayList<Double>() );
			for ( int j = 0; j < matrix.columns; j ++) {
				outlst.get(i).add( matrixdbl[ (matrix.columns * i) + j ] );
			}
		}
		    	
		return outlst;
		
    }
    
	public static DoubleMatrix todblmatlist ( ArrayList<ArrayList<Double>> matrix ) throws IOException {
		
		ArrayList<Double> dblsarray = new ArrayList<Double>();
		
		int w = -1;
		int h = matrix.size();
		
		for ( ArrayList<Double> row : matrix ) {
			
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
	
	public static ArrayList<ArrayList<Double>> convertMathematicaListToList(JsonNode matrix) throws IndexOutOfBoundsException {
		

		ArrayList<ArrayList<Double>> newmatrix = new ArrayList<ArrayList<Double>>();
		for ( int i = 0; i < matrix.size(); i++ )
		{
			if ( matrix.get(i).isTextual() && matrix.get(i).asText().equals("List") ){
				if ( i != 0 ) {
					throw new IndexOutOfBoundsException("Malformed list. Use ExportString[{{1, 2}, {3, 4}}, \"ExpressionJSON\"]");
				}
			}
			else if ( i == 0 ) {
				throw new IndexOutOfBoundsException("Malformed list. Use ExportString[{{1, 2}, {3, 4}}, \"ExpressionJSON\"]");
			}
			else {
				ArrayList<Double> newrow = new ArrayList<Double>();
				
				for ( int j = 0; j < matrix.get(i).size(); j++ ) {

					if ( matrix.get(i).get(j).isTextual() && matrix.get(i).get(j).asText().equals("List") ){
						if ( j != 0 ) {
							throw new IndexOutOfBoundsException("Malformed list. Use ExportString[{{1, 2}, {3, 4}}, \"ExpressionJSON\"]");
						}
					}
					else if ( ! matrix.get(i).get(j).isDouble() && ! matrix.get(i).get(j).isInt() ) {
						throw new IndexOutOfBoundsException("Matrix does not contain convertible doubles.");
					}
					else {
						if ( i == 0 ) {
							throw new IndexOutOfBoundsException("Malformed list. Use ExportString[{{1, 2}, {3, 4}}, \"ExpressionJSON\"]");
						}
						newrow.add(matrix.get(i).get(j).asDouble());
					}
				}
				newmatrix.add(newrow);
			}
		}
		
		return newmatrix;
	}
    
}
