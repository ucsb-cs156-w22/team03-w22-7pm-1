package edu.ucsb.cs156.example.documents;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class eqfListing {
    private String type; //e.g featureCollection
    private eqfMetaData metaData;
    private List<EarthquakeFeature> eqfList;
    private List<Double> bbox;
}