/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
package com.sample;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import java.util.HashMap;
import java.util.Map;

import com.ibm.mfp.adapter.api.AdaptersAPI;
import org.apache.http.client.methods.HttpUriRequest;
import com.ibm.json.java.JSONObject;
import java.util.logging.Logger;
import javax.ws.rs.core.Context;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import java.util.HashMap;
import java.util.Map;

import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.HttpEntity;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.xml.sax.SAXException;
public class IAMUserLogin extends UserAuthenticationSecurityCheck {
    private String userId, displayName;
    private String errorMsg;
    private boolean rememberMe = false;
	static Logger logger = Logger.getLogger(IAMUserLogin.class.getName());
	private transient CloseableHttpClient client;
    private transient HttpHost host;
    private transient HttpResponse jsAdapterResponse;
    private transient HttpEntity httpEntity;
		
	@Context
	AdaptersAPI adaptersAPI;
	
    @Override
    protected AuthenticatedUser createUser() {
        return new AuthenticatedUser(userId, displayName, this.getName());
    }

    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
/*		
try{
		String text=getRta();
		logger.info(text);
		if(text.equals("RTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")){
			errorMsg = ">>>>>>>>>>>>>>>>>>>>>>>>"+text;
			logger.info(errorMsg);
			return false;
		}
}catch(Exception ex){
	
}*/
        if(credentials!=null && credentials.containsKey("username") && credentials.containsKey("password")){
            String username = credentials.get("username").toString();
            String password = credentials.get("password").toString();
            if(!username.isEmpty() && !password.isEmpty() && username.equals(password)) {
                userId = username;
                displayName = username;

                //Optional RememberMe
                if(credentials.containsKey("rememberMe") ){
                    rememberMe = Boolean.valueOf(credentials.get("rememberMe").toString());
                }
                errorMsg = null;
                return true;
            }
            else {
                errorMsg = "Wrong Credentials";
            }
        }
        else{
            errorMsg = "Credentials not set properly";
        }
        return false;
    }
	
		public String getRta() throws IOException, IllegalStateException, SAXException, URISyntaxException {
		String adapterName="calculator";
		String procedureName="getGhonim";
        HttpGet jsAdapterGet = new HttpGet("/mfp/api/adapters/"+adapterName+"/"+procedureName);
        URI uri = new URIBuilder(jsAdapterGet.getURI()).addParameter("params", "['123']").build();

        jsAdapterGet.setURI(uri);

        return execute(jsAdapterGet);
	}
	   

    public String execute(HttpUriRequest req) throws IOException, IllegalStateException, SAXException {
      	client = HttpClientBuilder.create().build();
      	host = new HttpHost("localhost", 9080, "http");
  		jsAdapterResponse = client.execute(host, req);
  		httpEntity = jsAdapterResponse.getEntity();
        return httpEntity != null ? EntityUtils.toString(httpEntity) : null;
  	}



    @Override
    protected Map<String, Object> createChallenge() {
        Map challenge = new HashMap();
        challenge.put("errorMsg",errorMsg);
        challenge.put("remainingAttempts",getRemainingAttempts());
        return challenge;
    }
	
    @Override
    protected boolean rememberCreatedUser() {
        return rememberMe;
    }
}
