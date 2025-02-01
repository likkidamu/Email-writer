package com.email.writer.app;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;



@Service
public class EmailGeneratorService {
	
	private final WebClient webclient;
	
	
	
	  public EmailGeneratorService(WebClient.Builder webClientBuilder) { 
	        this.webclient = webClientBuilder.build();
	    }

	@Value("${gemini.api.url}")
	private String geminiApiUrl;
	
	@Value("${gemini.api.key}")
	private String geminiApiKey;

	public String generateEmailReply(EmailRequest emailRequest) {
		
	
		
		String prompt = buildPrompt(emailRequest);
		
		Map<String, Object> requestBody = Map.of(
				"contents", new Object[] {
						Map.of("parts",new Object[] {
								Map.of("text",prompt)
						})
						});
		
		String response= webclient.post()
						.uri(geminiApiUrl+geminiApiKey)
						.header("Content-Type","application/json")
						.bodyValue(requestBody)
						.retrieve()
						.bodyToMono(String.class)
						.block();
		
		
		return extractResponseContent(response);
		
	}

	private String extractResponseContent(String response) {
		
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode rootnode = mapper.readTree(response);
			return rootnode.path("candidates")
					.get(0)
					.path("content")
					.path("parts")
					.get(0)
					.path("text")
					.asText();
		}catch(Exception e) {
			return "Error Processing request: "+ e.getMessage();
		}
		
	}

	private String buildPrompt(EmailRequest emailRequest) {
		StringBuilder prompt = new StringBuilder();
		prompt.append("Generate a Professional reply for the following email content. Please don't generate the Subject Line");
		if(emailRequest.getTone()!=null&& !emailRequest.getTone().isEmpty()) {
			prompt.append("use a").append(emailRequest.getTone()).append("tone");
		}
		prompt.append("\n Original Email\n").append(emailRequest.getEmailContent());
		return prompt.toString();
	}
}
