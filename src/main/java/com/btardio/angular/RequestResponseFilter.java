package com.btardio.angular;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.filter.RequestContextFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.WebUtils;

public class RequestResponseFilter extends OncePerRequestFilter {

	private final Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Override
	protected void doFilterInternal(HttpServletRequest request, 
			                        HttpServletResponse response, 
			                        FilterChain filterChain) throws IOException, ServletException{
		
		 if (request instanceof HttpServletRequest
				 && response instanceof HttpServletResponse) {
	            //HttpServletRequest requestToCache = new ContentCachingRequestWrapper(request);
	            //MyLoggingRequestWrapper requestToWrap = new MyLoggingRequestWrapper(request);
	            //HttpServletResponse responseToCache = new ContentCachingResponseWrapper(response);
	            // wrap request, send wrapped request to filterChain doFilter
			 	// process relevant to request/response - ie: change request? not good idea,
			 	// should leave this alone because of streams that don't cast and because
			    // of threading
			 	filterChain.doFilter(request, response);
			 	// process relevant to other things
	            //printDebugForRequest(requestToCache);
			 
		 }
		 else {
			 filterChain.doFilter(request, response);			 
		 }
 		
 	}
	

}

