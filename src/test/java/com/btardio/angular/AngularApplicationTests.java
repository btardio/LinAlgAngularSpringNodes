package com.btardio.angular;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.jblas.DoubleMatrix;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
//import org.springframework.boot.test.web.client.
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AngularApplicationTests {

	private final Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private TestRestTemplate testRestTemplate;
	
	@LocalServerPort
	private int port;	
	
	@Test
	public void contextLoads() {
	}

	
	@Test
	public void post_erroneoustype() throws Exception {
		//if ( true ) { return; }
		HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
		
	    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
	    
	    body.add("@type", "foo-bar");
	    
	    String s = new String("{\"@type\":\"foo-bar\"}");
	    
	    HttpEntity<String> request = new HttpEntity<String>(s, headers);
	    //request.
	    log.debug("Request:" + request.toString());
	    
		ResponseEntity<Map> response = this.testRestTemplate.postForEntity(
				"http://localhost:" + this.port + "/matrices", request, Map.class);
	    
		log.debug("Response:" + response.getBody());
		assertTrue(response.getBody().keySet().size() == 2);
		assertTrue(response.getBody().containsKey("@type"));
		assertTrue(response.getBody().get("@type").equals("MatrixJsonReaderWriterUnknownType"));
		assertTrue(response.getBody().containsKey("error"));
		assertTrue(response.getBody().get("error").equals("Unrecognized type. Use @type:SimpleJson or @type:Mathematica"));
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		assertTrue(response.getHeaders().getContentType().equals(MediaType.APPLICATION_JSON_UTF8));
		
	}	
	
	@Test
	public void post_empty() throws Exception {
		//if ( true ) { return; }
		HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
		
	    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
	    
	    //body.add("{}", null);
	    
	    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
	    
	    log.debug("Request:" + request.toString());
	    
		ResponseEntity<Map> response = this.testRestTemplate.postForEntity(
				"http://localhost:" + this.port + "/matrices", request, Map.class);
	    
		log.debug("Response:" + response.getBody());
		assertTrue(response.getBody().keySet().size() == 2);
		assertTrue(response.getBody().containsKey("@type"));
		assertTrue(response.getBody().get("@type").equals("MatrixJsonReaderWriterUnknownType"));
		assertTrue(response.getBody().containsKey("error"));
		assertTrue(response.getBody().get("error").equals("Unrecognized type. Use @type:SimpleJson or @type:Mathematica"));
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		assertTrue(response.getHeaders().getContentType().equals(MediaType.APPLICATION_JSON_UTF8));
		
	}
	
	@Test 
	public void post_null() throws Exception {
		//if ( true ) { return; }
		HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
		
	    MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
	    
	    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(null, headers);
	    
	    log.debug("Request:" + request.toString());
	    
		ResponseEntity<Map> response = this.testRestTemplate.postForEntity(
				"http://localhost:" + this.port + "/matrices", request, Map.class);
	    
		log.debug("Response:" + response.getBody());
		assertTrue(response.getBody().keySet().size() == 2);
		assertTrue(response.getBody().containsKey("@type"));
		assertTrue(response.getBody().get("@type").equals("SimpleJson"));
		assertTrue(response.getBody().containsKey("error"));
		assertTrue(response.getBody().get("error").equals("Empty request body."));
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		assertTrue(response.getHeaders().getContentType().equals(MediaType.APPLICATION_JSON_UTF8));



	}
	
	

	@Test
	public void post_simplejson_onematrix() throws Exception {
		//if ( true ) { return; }
		HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
		
	    String body = new String("{\"@type\":\"SimpleJson\",\"matrices\":[[[1,2],[3,4]]]}");
	    
	    HttpEntity<String> request = new HttpEntity<String>(body, headers);
	    
	    log.debug("Request:" + request.toString());
	    
		ResponseEntity<Map> response = this.testRestTemplate.postForEntity(
				"http://localhost:" + this.port + "/matrices", request, Map.class);
	    
		log.debug("Response:" + response.getBody());
		assertTrue(response.getBody().keySet().size() == 4); // changed to 4 while working on something else, should revisit
		assertTrue(response.getBody().containsKey("@type"));
		assertTrue(response.getBody().get("@type").equals("SimpleJson"));
		assertTrue(response.getBody().containsKey("matrices"));
		assertTrue(response.getBody().containsKey("dmatrices"));
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		assertTrue(response.getHeaders().getContentType().equals(MediaType.APPLICATION_JSON_UTF8));
		
		List<List<List<Double>>> matricesa = (List<List<List<Double>>>) response.getBody().get("matrices");
		
		ObjectMapper objectMapperb = new ObjectMapper();
		List<List<List<Double>>> matricesb = objectMapperb.readValue("[[[1.0,2.0],[3.0,4.0]]]", ArrayList.class);
		
		for ( int i = 0; i < matricesa.size(); i++) {
			for ( int j = 0; j < matricesa.get(i).size(); j++)
			{
				for ( int k = 0; k < matricesa.get(i).get(j).size(); k++) {
					assertEquals( 0, matricesa.get(i).get(j).get(k).compareTo(matricesb.get(i).get(j).get(k)) );
				}
			}
		}
		
		assertEquals(matricesa, matricesb); //"[[[1,2],[3,4]]]");

		DoubleMatrix matrixa = new DoubleMatrix(2,2, new double[] {1.0, 3.0, 2.0, 4.0});
		
		ObjectMapper objectMapperc = new ObjectMapper();
		MatrixJsonReaderWriter rmatrix = objectMapperc.readValue(body, MatrixJsonReaderWriter.class);
		
		assertEquals(((MatrixJsonReaderWriterSimpleJson)rmatrix).getDmatrices().get(0), matrixa);
		
	}			
	

	

	@Test
	public void post_simplejson_multiplematrices() throws Exception {
		//if ( true ) { return; }
		int numrows = 2;
		int numcolumns = 2;
		int nummatrices = 3;
		HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
		
	    Random rgen = new Random(System.currentTimeMillis());

	    String jsonmatrixstr = new String("");
	    
		ArrayList<ArrayList<Double>> ald = new ArrayList<ArrayList<Double>>();
	    
		for ( int k = 0; k < nummatrices; k++) {
			ald.add(new ArrayList<Double>());
			jsonmatrixstr += "[";
		    for ( int i = 0; i < numrows; i++ ) {
		    	jsonmatrixstr += "[";
		    	for ( int j = 0; j < numcolumns; j++)
		    	{
		    		double nxtdbl = rgen.nextDouble();
		    		jsonmatrixstr += nxtdbl;
		    		ald.get(k).add(nxtdbl);
		    		if ( j + 1 < numcolumns ) {
		    			jsonmatrixstr += ",";
		    		}
		    	}
		    	jsonmatrixstr += "]";
		    	if ( i + 1 < numrows ) {
		    		jsonmatrixstr += ",";
		    	}
		    }
		    jsonmatrixstr += "]";
		
		    if ( k + 1 < nummatrices ) {
		    	jsonmatrixstr += ",";
		    }
		}
	    
	    String body = new String("{\"@type\":\"SimpleJson\",\"matrices\":["
	    		+ jsonmatrixstr
	    		+ "]}");
	    
	    HttpEntity<String> request = new HttpEntity<String>(body, headers);
	    
	    log.debug("Request:" + request.toString());
	    
		ResponseEntity<Map> response = this.testRestTemplate.postForEntity(
				"http://localhost:" + this.port + "/matrices", request, Map.class);
	    
		log.debug("Response:" + response.getBody());
		assertTrue(response.getBody().keySet().size() == 4); // changed to 4 while working on something else, should revisit
		assertTrue(response.getBody().containsKey("@type"));
		assertTrue(response.getBody().get("@type").equals("SimpleJson"));
		assertTrue(response.getBody().containsKey("matrices"));
		assertTrue(response.getBody().containsKey("dmatrices"));
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
		assertTrue(response.getHeaders().getContentType().equals(MediaType.APPLICATION_JSON_UTF8));
		
		List<List<List<Double>>> matricesa = (List<List<List<Double>>>) response.getBody().get("matrices");
		
		ObjectMapper objectMapperb = new ObjectMapper();
		List<List<List<Double>>> matricesb = objectMapperb.readValue("[" + jsonmatrixstr + "]", ArrayList.class);
		
		for ( int i = 0; i < matricesa.size(); i++) {
			for ( int j = 0; j < matricesa.get(i).size(); j++)
			{
				for ( int k = 0; k < matricesa.get(i).get(j).size(); k++) {
					assertEquals( 0, matricesa.get(i).get(j).get(k).compareTo(matricesb.get(i).get(j).get(k)) );
				}
			}
		}
		
		assertEquals(matricesa, matricesb); //"[[[1,2],[3,4]]]");

		for(int i = 0; i < ald.size(); i++ ) {
			
			double[] dbls = new double[ald.get(i).size()];
			
			for( int j = 0; j < ald.get(i).size(); j++) {
				dbls[j] = (double)ald.get(i).get(j);
			}
			
			DoubleMatrix matrixa = new DoubleMatrix(numrows,numcolumns, dbls).transpose();
			
			ObjectMapper objectMapperc = new ObjectMapper();
			MatrixJsonReaderWriter rmatrix = objectMapperc.readValue(body, MatrixJsonReaderWriter.class);
			
			assertEquals(((MatrixJsonReaderWriterSimpleJson)rmatrix).getDmatrices().get(i), matrixa);			
			
		}

	}		

	
	// better test of the matrices, the simplejson tests could be rewritten as this one
	@Test
	public void post_mathematica_matrices() throws Exception {

		// make ii number of requests with different size matrices, different number of matrices
		for ( int ii = 1; ii < 5; ii++ ) {
		
			int nummatrices = ii;
			int numrows = ii;
			int numcolumns = ii;
			
			HttpHeaders headers = new HttpHeaders();
		    headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
			
		    Random rgen = new Random(System.currentTimeMillis());
	
		    String jsonmatrixstr = new String("");
		    
			ArrayList<ArrayList<ArrayList<Double>>> ald = new ArrayList<ArrayList<ArrayList<Double>>>();
		    
			// iterate, creating ald and jsonmatrix str, json matrix str is used to send as a post request
			// ald is used to compare the response of the post request
			for ( int k = 0; k < nummatrices; k++) {
				ald.add(new ArrayList<ArrayList<Double>>());
				jsonmatrixstr += "[\"List\",";
			    for ( int i = 0; i < numrows; i++ ) {
			    	ald.get(k).add(new ArrayList<Double>());
			    	jsonmatrixstr += "[\"List\",";
			    	for ( int j = 0; j < numcolumns; j++)
			    	{
			    		double nxtdbl = rgen.nextDouble();
			    		jsonmatrixstr += nxtdbl;
			    		ald.get(k).get(i).add(nxtdbl);
			    		if ( j + 1 < numcolumns ) {
			    			jsonmatrixstr += ",";
			    		}
			    	}
			    	jsonmatrixstr += "]";
			    	if ( i + 1 < numrows ) {
			    		jsonmatrixstr += ",";
			    	}
			    }
			    jsonmatrixstr += "]";
			
			    if ( k + 1 < nummatrices ) {
			    	jsonmatrixstr += ",";
			    }
			}	    
		    
		    String body = new String("{\"@type\":\"Mathematica\","
		    		+ "\"matrices\":[\"List\","
		    		+ jsonmatrixstr
		    		+ "],"
		    		+ "\"operations\":[\"+\"]}");
		    
		    HttpEntity<String> request = new HttpEntity<String>(body, headers);
		    
		    log.debug("Request:" + request.toString());
		    
			ResponseEntity<? extends MatrixJsonReaderWriter> response = 
					(ResponseEntity<? extends MatrixJsonReaderWriter>) 
					this.testRestTemplate.postForEntity(
					"http://localhost:" + this.port + "/matrices", request, MatrixJsonReaderWriter.class);
		    
			log.debug("Response:" + response.getBody());
			
			assertTrue(response.getBody() instanceof MatrixJsonReaderWriter);
			assertTrue(response.getBody() instanceof MatrixJsonReaderWriterMathematica);
			
			assertTrue(response.getStatusCode().equals(HttpStatus.OK));
			assertTrue(response.getHeaders().getContentType().equals(MediaType.APPLICATION_JSON_UTF8));
			
			MatrixJsonReaderWriterMathematica rwminst = (MatrixJsonReaderWriterMathematica) response.getBody();
			
			// compare the result of the request with ald
			for ( int i = 0; i < ald.size(); i++) {
				for ( int j = 0; j < ald.get(i).size(); j++)
				{
					for ( int k = 0; k < ald.get(i).get(j).size(); k++) {
						assertEquals( 0, ald.get(i).get(j).get(k).compareTo(rwminst.getMatrices().get(i).get(j).get(k)) );
					}
				}
			}		
	
			for ( int i = 0; i < rwminst.getMatrices().size(); i++) {
				for ( int j = 0; j < rwminst.getMatrices().get(i).size(); j++)
				{
					for ( int k = 0; k < rwminst.getMatrices().get(i).get(j).size(); k++) {
						assertEquals( 0, ald.get(i).get(j).get(k).compareTo(rwminst.getMatrices().get(i).get(j).get(k)) );
					}
				}
			}		
			assertEquals(rwminst.getDmatrices().size(), ald.size());
			
			for ( int i = 0; i < ald.size(); i++) {
				for ( int j = 0; j < ald.get(i).size(); j++)
				{
					for ( int k = 0; k < ald.get(i).get(j).size(); k++) {
						assertEquals( 0, ald.get(i).get(j).get(k).compareTo(rwminst.getDmatrices().get(i).get(j, k)) );
					}
				}
			}		
	
			for ( int i = 0; i < rwminst.getMatrices().size(); i++) {
				for ( int j = 0; j < rwminst.getMatrices().get(i).size(); j++)
				{
					for ( int k = 0; k < rwminst.getMatrices().get(i).get(j).size(); k++) {
						assertEquals( 0, ((Double)rwminst.getDmatrices().get(i).get(j, k)).compareTo(rwminst.getMatrices().get(i).get(j).get(k)) );
					}
				}
			}					
			
			//assertEquals(rwminst.getDmatrices(), ald);
			
			//for ( int i = 0; i < rwminst.getDmatrices().size(); i++) {
		}
		
	}
	
//	
//	ObjectMapper objectMappera = new ObjectMapper();
//	RequestBodyMatrix rbm_mslista = objectMappera.readValue(mslista, RequestBodyMatrix.class);
//	assertNotNull(rbm_mslista);
//	  
//	DoubleMatrix matrixa = new DoubleMatrix(2,2, new double[] {12.0, 23.0, 30.0, 40.0});
//	DoubleMatrix matrixb = new DoubleMatrix(2,2, new double[] {1.0,2.0,1.0,2.0});
//	DoubleMatrix matrixc = new DoubleMatrix(2,2, new double[] {4.1,2.3,1.5,5.5});
//	  
//	ArrayList<DoubleMatrix> lmatrices = rbm_mslista.getLmatrices();
//	  
//	assertEquals(lmatrices.get(0), matrixa);
//	assertEquals(lmatrices.get(1), matrixb);
//	assertEquals(lmatrices.get(2), matrixc);
	
	
//	
//	@Test
//	public void serialize() throws Exception {
//		
//		String mslista = "{\"matrices\":[[[12,23],[30,40]],[[1,2],[1,2]],[[4.1,2.3],[1.5,5.5]]],\"operations\":[\"*\",\"*\",\"*\"]}";
//		
//		ObjectMapper objectMappera = new ObjectMapper();
//        RequestBodyMatrix rbm_mslista = objectMappera.readValue(mslista, RequestBodyMatrix.class);
//        assertNotNull(rbm_mslista);
//        
//        DoubleMatrix matrixa = new DoubleMatrix(2,2, new double[] {12.0, 23.0, 30.0, 40.0});
//        DoubleMatrix matrixb = new DoubleMatrix(2,2, new double[] {1.0,2.0,1.0,2.0});
//        DoubleMatrix matrixc = new DoubleMatrix(2,2, new double[] {4.1,2.3,1.5,5.5});
//        
//        ArrayList<DoubleMatrix> lmatrices = rbm_mslista.getLmatrices();
//        
//        assertEquals(lmatrices.get(0), matrixa);
//        assertEquals(lmatrices.get(1), matrixb);
//        assertEquals(lmatrices.get(2), matrixc);
//        
//
//        String matricesa = "{\"matrices\":\"[[[12,23],[30,40]],[[1,2],[1,2]],[[4.1,2.3],[1.5,5.5]]]\",\"operations\":[\"*\",\"*\",\"*\"]}";
//        
//		ObjectMapper objectMapperb = new ObjectMapper();
//        RequestBodyMatrix rbm_matricesa = objectMapperb.readValue(matricesa, RequestBodyMatrix.class);
//        assertNotNull(rbm_matricesa);
//        
//        matrixa = new DoubleMatrix(2,2, new double[] {12.0, 23.0, 30.0, 40.0});
//        matrixb = new DoubleMatrix(2,2, new double[] {1.0,2.0,1.0,2.0});
//        matrixc = new DoubleMatrix(2,2, new double[] {4.1,2.3,1.5,5.5});
//        
//        lmatrices = rbm_matricesa.getLmatrices();
//        
//        assertEquals(lmatrices.get(0), matrixa);
//        assertEquals(lmatrices.get(1), matrixb);
//        assertEquals(lmatrices.get(2), matrixc);
//        
//        
//        //for ( DoubleMatrix m : rbm.getLmatrices() ) {
//        //	log.debug(m.toString());
//        //}
//        
////        log.debug(rbm.getMslist().toString());
////        
////        log.debug(result.toString());
////        rbm.calc();
////        log.debug(rbm.getRmatrix());
////        assertTrue( result.toString().equals(rbm.getRmatrix()) );
//        
//        
//        
//        //assertThat(car.getColor(), containsString("Black"));		
//		
//	}	
	
}













//
//@Test
//public void post_mathematica_onematrix() throws Exception {
//	if ( true ) { return; }
//	HttpHeaders headers = new HttpHeaders();
//    headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
//	
//    String body = new String("{\"@type\":\"Mathematica\","
//    		+ "\"matrices\":[[\"List\",[\"List\",6,8],[\"List\",10,12]],[\"List\",[\"List\",-1,0],[\"List\",1,2]]],"
//    		+ "\"operations\":[\"+\"]}");
//    
//    HttpEntity<String> request = new HttpEntity<String>(body, headers);
//    
//    log.debug("Request:" + request.toString());
//    
//	ResponseEntity<Map> response = this.testRestTemplate.postForEntity(
//			"http://localhost:" + this.port + "/matrices", request, Map.class);
//    
//	log.debug("Response:" + response.getBody());
//	assertTrue(response.getBody().keySet().size() == 4);
//	assertTrue(response.getBody().containsKey("@type"));
//	assertTrue(response.getBody().get("@type").equals("Mathematica"));
//	assertTrue(response.getBody().containsKey("matrices"));
//	assertTrue(response.getBody().containsKey("dmatrices"));
//	assertTrue(response.getBody().containsKey("operations"));
//	assertTrue(response.getStatusCode().equals(HttpStatus.OK));
//	assertTrue(response.getHeaders().getContentType().equals(MediaType.APPLICATION_JSON_UTF8));
//	
//	//log.debug(""+response.getBody().get("matrices").toString()
//	//		.replaceAll("List", "\"List\"").replaceAll(""));
//	
//	ObjectMapper mapper = new ObjectMapper();
//    JsonNode node = mapper.readTree(response.getBody().toString().replaceAll("List", "\"List\""));
//    
////	JsonFactory factory = new JsonFactory();
////	JsonParser jp  = factory.createParser(response.getBody().toString().replaceAll("List", "\"List\""));
////
////	while(!jp.isClosed()){
////	    JsonToken jsonToken = jp.nextToken();
////
////	    log.debug("jsonToken = " + jsonToken);
////	}
//	
//	//JsonNode node = jp.getCodec().readTree(jp);
//	
//	JsonNode matricesNode = node.path("matrices");
//	assertFalse(matricesNode.isMissingNode());
//			
//	for ( JsonNode m : matricesNode ) {
//		log.debug(">>" + m.toString());
//	}
//	List<List<Double>> convertedlist = MatrixJsonReaderWriter.convertMathematicaListToList(node);
//	if ( true ) { return; }
//	
//	//MatrixJsonReaderWriter.convertMathematicaListToList(matrix);
//	
//	List<List<List<Double>>> matricesa = (List<List<List<Double>>>) response.getBody().get("matrices");
//	
//	
//	
//	ObjectMapper objectMapperb = new ObjectMapper();
//	List<List<List<Double>>> matricesb = objectMapperb.readValue("[[[1.0,2.0],[3.0,4.0]]]", ArrayList.class);
//	
//	for ( int i = 0; i < matricesa.size(); i++) {
//		for ( int j = 0; j < matricesa.get(i).size(); j++)
//		{
//			for ( int k = 0; k < matricesa.get(i).get(j).size(); k++) {
//				assertEquals( 0, matricesa.get(i).get(j).get(k).compareTo(matricesb.get(i).get(j).get(k)) );
//			}
//		}
//	}
//	
//	assertEquals(matricesa, matricesb); //"[[[1,2],[3,4]]]");
//
//	DoubleMatrix matrixa = new DoubleMatrix(2,2, new double[] {1.0, 3.0, 2.0, 4.0});
//	
//	ObjectMapper objectMapperc = new ObjectMapper();
//	MatrixJsonReaderWriter rmatrix = objectMapperc.readValue(body, MatrixJsonReaderWriter.class);
//	
//	assertEquals(((MatrixJsonReaderWriterSimpleJson)rmatrix).getDmatrices().get(0), matrixa);
//	
//}				

