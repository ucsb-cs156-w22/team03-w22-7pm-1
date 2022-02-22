package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.collections.EarthquakesCollection;
import edu.ucsb.cs156.example.documents.EarthquakeFeature;
import edu.ucsb.cs156.example.services.EarthquakeQueryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(description = "Earthquake features")
@RequestMapping("/api/earthquakes")
@RestController
@Slf4j
public class EarthquakeController extends ApiController {

    @Autowired
    EarthquakesCollection earthquakesCollection;


    @Autowired
    ObjectMapper mapper;

//List earthquakes: List all earthquakes in the collection. All USERS.

    @PreAuthorize("hasRole('ROLE_USER')")
    @ApiOperation(value = "List all earthquakes")
    @GetMapping("/all")
    public List<EarthquakeFeature> allFeatures() {
        List<EarthquakeFeature> features = earthquakesCollection.findAll();
        return features;
    }
//Retrive earthquakes: store earthquakes near Storke Tower into MongoDB collection. ADMIN only.
    @Autowired
    EarthquakeQueryService earthquakeQueryService;
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ApiOperation(value = "Get all earthquakes that are within a specified distance from Storke Tower, and that are at least a specified magnitude, and store them in the MongoDB collection", notes = "")
    @PostMapping("/retrieve")
    public ResponseEntity<List<EarthquakeFeature>> retriveFeatures(
            @ApiParam("Distance from storke tower in KM, e.g. 10.0") @RequestParam String distanceKM,
            @ApiParam("Minimum magnitude, e.g. 1.5") @RequestParam String minMagnitude) throws JsonProcessingException {
        log.info("retriveFeatures: distanceKM={} minMagnitude={}", distanceKM, minMagnitude);
        List<EarthquakeFeature> eqf = earthquakeQueryService.retriveEarthquakeFeatures(distanceKM,minMagnitude);
        List<EarthquakeFeature> eqfSaved = earthquakesCollection.saveAll(eqf);
/*
        List<EarthquakeFeature> eqfSaved = new ArrayList<>();
        for(EarthquakeFeature ef : eqf){
            eqfSaved.add(earthquakesCollection.save(ef));
        }
*/
        return ResponseEntity.ok().body(eqfSaved);
    }

    @ApiOperation(value = "Get earthquakes a certain distance from UCSB's Storke Tower", notes = "JSON return format documented here: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php")
    @GetMapping("/get")
    public ResponseEntity<String> getEarthquakes(
        @ApiParam("distance in km, e.g. 100") @RequestParam String distanceKM,
        @ApiParam("minimum magnitude, e.g. 2.5") @RequestParam String minMagnitude
    ) throws JsonProcessingException {
        log.info("getEarthquakes: distanceKM={} minMagnitude={}", distanceKM, minMagnitude);
        String result = earthquakeQueryService.getJSON(distanceKM, minMagnitude);
        return ResponseEntity.ok().body(result);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ApiOperation(value = "Delete all earthquakes from the collection")
    @PostMapping("/purge")
    public void purgeAllFeatures() throws JsonProcessingException{
        earthquakesCollection.deleteAll();
    }

}