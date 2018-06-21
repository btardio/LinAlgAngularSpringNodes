package com.btardio.angular;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.commons.io.input.CloseShieldInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// example filter
public class MyLoggingRequestWrapper extends HttpServletRequestWrapper {

	public MyLoggingRequestWrapper(HttpServletRequest request){
		
		super(request);
	    
	}
	
	@Override
	public ServletInputStream getInputStream() throws IOException {
		
		return super.getInputStream();
				
	}
	
	@Override
	public BufferedReader getReader() throws IOException {
		
		return super.getReader();
		
	}
	
}
