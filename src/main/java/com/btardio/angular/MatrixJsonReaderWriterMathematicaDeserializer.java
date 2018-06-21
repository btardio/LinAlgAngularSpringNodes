package com.btardio.angular;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jblas.DoubleMatrix;

//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;


public class MatrixJsonReaderWriterMathematicaDeserializer extends StdDeserializer<MatrixJsonReaderWriterMathematica> {

	//private final Logger log = LoggerFactory.getLogger(this.getClass());
	
	private static final long serialVersionUID = 1L;	
	
    public MatrixJsonReaderWriterMathematicaDeserializer() { 
        this(null); 
    } 
 
    public MatrixJsonReaderWriterMathematicaDeserializer(Class<?> vc) { 
        super(vc); 
    }
 
    @Override
    public MatrixJsonReaderWriterMathematica deserialize(JsonParser jp, 
    													 DeserializationContext ctxt) 
    		throws IOException, JsonProcessingException {    	

    	ArrayList<ArrayList<ArrayList<Double>>> outlist = new ArrayList<ArrayList<ArrayList<Double>>>();
    	ArrayList<DoubleMatrix> dmoutlist = new ArrayList<DoubleMatrix>();
    	
    	JsonNode node = jp.getCodec().readTree(jp);
    	
    	JsonNode operationsNode = node.path("operations");
		if (operationsNode.isMissingNode()) {
			return new MatrixJsonReaderWriterMathematica("operations must be defined.");
		}
		ArrayList<String> operations = new ArrayList<String>();
		
		for ( JsonNode op : operationsNode ) {
			operations.add(op.asText());
		}
    	
    	JsonNode matricesNode = node.path("matrices");
		if (matricesNode.isMissingNode()) {
			return new MatrixJsonReaderWriterMathematica("matrices must be defined.");
		} 
		
		
		else {
			// skip the "List" entry
			for ( int i = 1; i < matricesNode.size(); i++ ) { //JsonNode matrix : matricesNode ) {
				ArrayList<ArrayList<Double>> newmatrix = null;
				try {
					
					newmatrix = MatrixJsonReaderWriter.convertMathematicaListToList(matricesNode.get(i));
					
				}
				catch(IndexOutOfBoundsException e) {
					
					return new MatrixJsonReaderWriterMathematica(e.getMessage());
				
				}
				
				if ( newmatrix != null ) {
					
					dmoutlist.add(MatrixJsonReaderWriter.todblmatlist(newmatrix));
					outlist.add(newmatrix);
					
				}
			}
		}
 
        return new MatrixJsonReaderWriterMathematica(outlist, operations, dmoutlist);
    }


}
