package com.btardio.angular;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.jsontype.TypeSerializer;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

public class MatrixJsonReaderWriterMathematicaSerializer extends StdSerializer<MatrixJsonReaderWriterMathematica> {

	private static final long serialVersionUID = 2L;

	public MatrixJsonReaderWriterMathematicaSerializer() {
		this(null);
	}

	public MatrixJsonReaderWriterMathematicaSerializer(Class<MatrixJsonReaderWriterMathematica> t) {
        super(t);
    }
	
	private JsonGenerator writearraylisttogenshort(ArrayList<ArrayList<Double>> matrix, 
			                                       JsonGenerator gen) throws IOException {
		//ArrayList<ArrayList<ArrayList<Double>>>
				
		
//        gen.writeStartArray();
//        gen.writeString("List");
//        for ( ArrayList<ArrayList<Double>> matrix : matrices ) {
        	
        	gen.writeStartArray();
        	gen.writeString("List");
        	
        	for ( ArrayList<Double> row : matrix ) {
        		
        		gen.writeStartArray();
        		gen.writeString("List");
        		
        		for ( Double n : row ) {
        			
        			gen.writeNumber(n);
        			
        		}
        		
        		gen.writeEndArray();
        		
        	}
        	
        	gen.writeEndArray();
        	
//        }
//        
//        gen.writeEndArray();		
		
        return gen;
		
	}
	
	private JsonGenerator writearraylisttogen(ArrayList<ArrayList<ArrayList<Double>>> matrices, JsonGenerator gen) throws IOException {
		//ArrayList<ArrayList<ArrayList<Double>>>
				
		
        gen.writeStartArray();
        gen.writeString("List");
        for ( ArrayList<ArrayList<Double>> matrix : matrices ) {
        	
        	gen.writeStartArray();
        	gen.writeString("List");
        	
        	for ( ArrayList<Double> row : matrix ) {
        		
        		gen.writeStartArray();
        		gen.writeString("List");
        		
        		for ( Double n : row ) {
        			
        			gen.writeNumber(n);
        			
        		}
        		
        		gen.writeEndArray();
        		
        	}
        	
        	gen.writeEndArray();
        	
        }
        
        gen.writeEndArray();		
		
        return gen;
		
	}
	
	
	
	@Override
	public void serialize(MatrixJsonReaderWriterMathematica value, JsonGenerator gen, SerializerProvider provider)
			throws IOException {
		ArrayList<ArrayList<ArrayList<Double>>> matrices = value.getMatrices();
		//gen.writeStartObject();
		
		gen.writeStringField("@type", StaticProperties.SUBTYPE_MATHEMATICA);

		gen.writeFieldName("operations");
		gen.writeObject(value.getOperations());
		
		gen.writeFieldName("matrices");
		gen = writearraylisttogen(matrices, gen);	
		
		

		gen.writeFieldName("dmatrices");
		gen.writeObject(value.getDmatrices());

		if ( value.getRmatrix() != null ) {
			
			gen.writeFieldName("rmatrix");
			gen = writearraylisttogenshort(value.getRmatrix(), gen);
			
		}
		
		if ( value.getRdmatrix() != null ) {
			gen.writeFieldName("rdmatrix");
			gen.writeObject(value.getRdmatrix());
		}
		
        //gen.writeEndObject();
        
	}

	@Override
	public void serializeWithType(MatrixJsonReaderWriterMathematica value, JsonGenerator gen, 
	        SerializerProvider provider, TypeSerializer typeSerializer) 
	        throws IOException, JsonProcessingException {

		
		
		gen.writeStartObject();
		//WritableTypeId typeIdStart = typeSerializer.typeId(value, JsonToken.START_OBJECT);
		//typeSerializer.writeTypePrefix(gen, typeIdStart);

		this.serialize(value, gen, provider); // call your customized serialize method

		//WritableTypeId typeIdEnd = typeSerializer.typeId(value, JsonToken.END_OBJECT);
		//typeSerializer.writeTypeSuffix(gen, typeIdEnd);
		gen.writeEndObject();
	}	
	
}
