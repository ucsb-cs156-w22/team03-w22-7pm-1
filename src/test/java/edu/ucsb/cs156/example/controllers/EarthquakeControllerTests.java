package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.EarthquakeQueryService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.collections.EarthquakesCollection;
import edu.ucsb.cs156.example.documents.EarthquakeFeature;
import edu.ucsb.cs156.example.documents.eqfGeometries;
import edu.ucsb.cs156.example.documents.eqfListing;
import edu.ucsb.cs156.example.documents.eqfMetaData;
import edu.ucsb.cs156.example.documents.eqfProperties;
import edu.ucsb.cs156.example.entities.User;


import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = EarthquakeController.class)
@Import(TestConfig.class)
public class EarthquakeControllerTests extends ControllerTestCase {
    @MockBean
        EarthquakesCollection earthquakesCollection;

    @MockBean
        EarthquakeQueryService earthquakeQueryService;

    @MockBean
        UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void api_earthquakeFeatures_all__user_logged_in__returns_all_features_that_exists() throws Exception {
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


            eqfGeometries geometry = eqfGeometries.builder()
                .type("testType")
                .coordinates(List.of(0.0, 1.0, 2.0))
                .build();

            EarthquakeFeature feature1 = EarthquakeFeature.builder()
                ._id("123")
                .id("testId_1")
                .type("Feature")
                .geometry(geometry)
                .properties(properties)
                .build();

            EarthquakeFeature feature2 = EarthquakeFeature.builder()
                ._id("456")
                .id("testId_2")
                .type("Feature")
                .geometry(geometry)
                .properties(properties)
                .build();

            List<EarthquakeFeature> featureList = new ArrayList<>();
            featureList.add(feature1);
            featureList.add(feature2);

            when(earthquakesCollection.findAll()).thenReturn(featureList);
            MvcResult response = mockMvc.perform(get("/api/earthquakes/all"))
                .andExpect(status().isOk()).andReturn();

            verify(earthquakesCollection, times(1)).findAll();
            String expectedJson = mapper.writeValueAsString(featureList);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void api_earthquakeFeatures_retrive__admin_logged_in__store_features_to_collection() throws Exception {
            String distanceKM = "10";
            String minMagnitude = "1.5";
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


            eqfGeometries geometry = eqfGeometries.builder()
                .type("testType")
                .coordinates(List.of(0.0, 1.0, 2.0))
                .build();

            EarthquakeFeature feature = EarthquakeFeature.builder()
                ._id("123")
                .id("testId")
                .type("Feature")
                .geometry(geometry)
                .properties(properties)
                .build();

            List<EarthquakeFeature> featureList = new ArrayList<>();
            featureList.add(feature);

            List<String> flAsJson = new ArrayList<>();
            flAsJson.add(mapper.writeValueAsString(featureList.get(0)));
            
            List<EarthquakeFeature> savedFl = new ArrayList<>();
            savedFl.add(mapper.readValue(flAsJson.get(0), EarthquakeFeature.class));
            savedFl.get(0).set_id("saved123");

            String savedFlAsJson = mapper.writeValueAsString(savedFl);

            when(earthquakesCollection.saveAll(eq(featureList))).thenReturn(savedFl);

            when(earthquakeQueryService.retriveEarthquakeFeatures(eq(distanceKM),eq(minMagnitude))).thenReturn(featureList);

            //List<EarthquakeFeature> testList = earthquakesCollection.findAll();

            MvcResult response = mockMvc.perform(
                                //post("/api/redditposts/storeone?subreddit=UCSantaBarbara")
                                post("/api/earthquakes/retrieve?distanceKM=10&minMagnitude=1.5")
                                                .with(csrf()))
                                .andExpect(status().isOk())
                                .andReturn();
            verify(earthquakeQueryService, times(1)).retriveEarthquakeFeatures(eq(distanceKM),eq(minMagnitude));
            verify(earthquakesCollection, times(1)).saveAll(eq(featureList));
            String responseString = response.getResponse().getContentAsString();
            assertEquals(savedFlAsJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void api_earthquakeFeatures_retrive__user_logged_in__return_error() throws Exception {
            mockMvc.perform(post("/api/earthquakes/retrieve?distanceKM=10&minMagnitude=1.5"))
            .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void api_earthquakeFeatures_admin_loggen_in_delete_all_features() throws Exception {
            mockMvc.perform(post("/api/earthquakes/purge").with(csrf())).andExpect(status().isOk()).andReturn();

            verify(earthquakesCollection, times(1)).deleteAll();
        }
        @WithMockUser(roles = { "USER" })
        @Test
        public void api_earthquakeFeatures_delete__user_logged_in__return_error() throws Exception {
            mockMvc.perform(post("/api/earthquakes/purge")).andExpect(status().is(403));
        }   
}
