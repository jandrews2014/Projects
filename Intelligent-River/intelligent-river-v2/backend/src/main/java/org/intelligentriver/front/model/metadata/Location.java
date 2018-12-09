package org.intelligentriver.front.model.metadata;

import org.intelligentriver.front.model.IDbJson;

public class Location extends IDbJson {

    public double lat;
    public double lng;

    public Location(){}

    public Location(double lat, double lng) {
        this.lat = lat;
        this.lng = lng;
    }

}
