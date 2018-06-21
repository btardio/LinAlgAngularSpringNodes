package com.btardio.angular;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.HttpStatus;

// import com.btardio.angular.RequestBodyMatrix;


@SpringBootApplication
@RestController
@CrossOrigin(origins="*")   /*** REMOVE FOR GITHUB UPLOAD ***/
public class AngularApplication {

	private final Logger log = LoggerFactory.getLogger(this.getClass());


	
	public static void main(String[] args) {
		SpringApplication.run(AngularApplication.class, args);
	}
	
/*
 * 
 * 
 * 
 * list of matrices
 * list of operations
 * 
 * unit(s) to do operations with
 * 
 * base matrix -> algorithm1 with matrix[0] -> algorithm2 with matrix[1] ... operationN with matrix[n]
 * 
 * algorithm act on matrix
 * 
 * 
 */

	
	@GetMapping("/resource")
	public Map<String,Object> get_resource() {
		log.debug("debug level log - get");
		Map<String,Object> model = new HashMap<String,Object>();
		model.put("id", UUID.randomUUID().toString());
		model.put("content", "Hello World");
		return model;
		
	}
	
	
	@PostMapping(path = "/matrices", 
			     consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public MatrixJsonReaderWriter post_matrices( @RequestBody(required = false) MatrixJsonReaderWriter matrices, 
			                                     @RequestHeader HttpHeaders header ) {
		// blank post request, respond with nothing
		if ( matrices == null ) {
			return new MatrixJsonReaderWriterSimpleJson("Empty request body.");
		}
		
		SOperandSFunctionDef_BasicMath omatrix = new SOperandSFunctionDef_BasicMath(matrices);
		
		//log.debug(omatrix.result().getRmatrix().toString());
		
		matrices = omatrix.result();
		
		//MatrixSetOperandSetFunctionDefinitionBasicMath omatrix = new MatrixSetOperandSetFunctionDefinitionBasicMath() 
		//log.debug("post /matrices:" + matrices );
		
		
		//log.debug(header.toString());
		
		//inmatrixjson.calc();
		
		return matrices; //ResponseEntity.ok(HttpStatus.OK);
	}	
	
//	@PostMapping(path = "/resource", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
//	public RequestBodyMatrix post_resource( @RequestBody RequestBodyMatrix inmatrixjson ) {
//		log.debug("debug level log - post:" + inmatrixjson );
//		
//		inmatrixjson.calc();
//		
//		return inmatrixjson; //ResponseEntity.ok(HttpStatus.OK);
//	}
	
	@Bean
	public RequestResponseFilter simpleFilter() {
	  return new RequestResponseFilter();
	}	
	
	
}
