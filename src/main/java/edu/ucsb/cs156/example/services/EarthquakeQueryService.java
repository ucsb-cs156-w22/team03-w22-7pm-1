package edu.ucsb.cs156.example.services;

import org.springframework.web.client.RestTemplate;

import edu.ucsb.cs156.example.documents.eqfListing;
import edu.ucsb.cs156.example.documents.EarthquakeFeature;

import org.springframework.boot.web.client.RestTemplateBuilder;

import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Slf4j
@Service
public class EarthquakeQueryService {

    ObjectMapper mapper = new ObjectMapper();

    private final RestTemplate restTemplate;

    public EarthquakeQueryService(RestTemplateBuilder restTemplateBuilder) {
        restTemplate = restTemplateBuilder.build();
    }


    public static final String ENDPOINT = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude={minMagnitude}&maxradiuskm={distanceKM}&latitude={latitude}&longitude={longitude}";
/*
    public Iterable<EarthquakeFeature> retriveEarthquakeFeatures(String distanceKM, String minMagnitude) throws HttpClientErrorException, JsonProcessingException {
 */   
    public List<EarthquakeFeature> retriveEarthquakeFeatures(String distanceKM, String minMagnitude) throws HttpClientErrorException, JsonProcessingException {

        log.info("distanceKM={}, minMagnitude={}", distanceKM, minMagnitude);
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String ucsbLat = "34.4140"; // hard coded params for Storke Tower
        String ucsbLong = "-119.8489";
        Map<String, String> uriVariables = Map.of("minMagnitude", minMagnitude, "distanceKM", distanceKM, "latitude", ucsbLat,"longitude", ucsbLong);

        ResponseEntity<String> re = restTemplate.exchange(ENDPOINT, HttpMethod.GET, entity, String.class, uriVariables);
        String json = re.getBody();

        // Convert json to Object

        eqfListing theEqfListing = mapper.readValue(json, eqfListing.class);	

        return theEqfListing.getFeatures();
    }

    public String getJSON(String distanceKM, String minMagnitude) throws HttpClientErrorException {
        log.info("distanceKM={}, minMagnitude={}", distanceKM, minMagnitude);
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String ucsbLat = "34.4140"; // hard coded params for Storke Tower
        String ucsbLong = "-119.8489";
        Map<String, String> uriVariables = Map.of("minMagnitude", minMagnitude, "distanceKM", distanceKM,"latitude", ucsbLat,"longitude", ucsbLong);

        ResponseEntity<String> re = restTemplate.exchange(ENDPOINT, HttpMethod.GET, entity, String.class,
                uriVariables);
        return re.getBody();
    }

}