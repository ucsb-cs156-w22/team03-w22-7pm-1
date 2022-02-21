package edu.ucsb.cs156.example.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;

import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;

import edu.ucsb.cs156.example.documents.EarthquakeFeature;
import edu.ucsb.cs156.example.documents.eqfGeometries;
import edu.ucsb.cs156.example.documents.eqfListing;
import edu.ucsb.cs156.example.documents.eqfMetaData;
import edu.ucsb.cs156.example.documents.eqfProperties;

@RestClientTest(EarthquakeQueryService.class)
public class EarthquakeQueryServiceTests {
    @Autowired
    private MockRestServiceServer mockRestServiceServer;

    @Autowired
    private EarthquakeQueryService earthquakeQueryService;

    @Autowired
    private ObjectMapper mapper;
    @Test
    public void test_retriveEarthquakeFeatures() throws JsonProcessingException {
        String distanceKm = "10";
        String minMagnitude = "1.5";
        String ucsbLat = "34.4140"; // hard coded params for Storke Tower
        String ucsbLong = "-119.8489";
        String expectedURL = EarthquakeQueryService.ENDPOINT.replace("{distanceKM}", distanceKm)
                .replace("{minMagnitude}", minMagnitude).replace("{latitude}", ucsbLat).replace("{longitude}", ucsbLong);

        eqfMetaData metadata = eqfMetaData.builder()
                .generated(0x111L)
                .url("testUrl")
                .title("testTitle")
                .api("testApi")
                .count(1)
                .status(1)
                .build();
        eqfProperties properties = eqfProperties.builder()
                .mag(3.0)
                .place("testPlace")
                .time(0x1L)
                .updated(0x2L)
                .tz(4)
                .url("testUrl")
                .detail("testDetail")
                .felt(15)
                .cdi(1.5)
                .mmi(2.5)
                .alert("testAlert")
                .status("testStatus")
                .tsunami(0)
                .sig(100)
                .net("testNet")
                .code("testCode")
                .ids("testIds")
                .sources("testSources")
                .types("testTypes")
                .nst(10)
                .dmin(0.5)
                .rms(0.6)
                .gap(50)
                .magType("testMagType")
                .type("testType")
                .build();


        eqfGeometries geometries = eqfGeometries.builder()
                .type("testType")
                .coordinates(List.of(0.0, 1.0, 2.0))
                .build();

        EarthquakeFeature feature = EarthquakeFeature.builder()
                ._id("123")
                .id("testId")
                .type("Feature")
                .geometries(geometries)
                .properties(properties)
                .build();

        eqfListing eqflisting = eqfListing.builder()
                .type("testListing")
                .eqfList(List.of(feature))
                .metaData(metadata)
                .build();

        String mockJSONResult = mapper.writeValueAsString(eqflisting);

        this.mockRestServiceServer.expect(requestTo(expectedURL))
            .andExpect(header("Accept", MediaType.APPLICATION_JSON.toString()))
            .andExpect(header("Content-Type", MediaType.APPLICATION_JSON.toString()))
            .andRespond(withSuccess(mockJSONResult, MediaType.APPLICATION_JSON));

        Iterable<EarthquakeFeature> actualResult = earthquakeQueryService.retriveEarthquakeFeatures(distanceKm, minMagnitude);
        String actualResultAsJSON = mapper.writeValueAsString(actualResult);
        String expectedResultAsJSON = mapper.writeValueAsString(eqflisting.getEqfList());

        assertEquals(expectedResultAsJSON, actualResultAsJSON);
    }
}

