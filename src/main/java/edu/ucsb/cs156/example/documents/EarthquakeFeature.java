package edu.ucsb.cs156.example.documents;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "earthquakes")
@JsonIgnoreProperties(ignoreUnknown = true)

public class EarthquakeFeature {
    @Id
    private String _id; //Different from actual id field. This is the MongoDB identifier of the document.

    private String type;
    private eqfProperties properties;
    private eqfGeometries geometries;
    private String id;
}