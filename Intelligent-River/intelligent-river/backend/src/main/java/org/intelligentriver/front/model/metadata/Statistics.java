package org.intelligentriver.front.model.metadata;

public class Statistics {

    public class Set {
        public String datetime;
        public String records;
        public String samples;

        public Set(String datetime, String records, String samples) {
            this.datetime = datetime;
            this.records = records;
            this.samples = samples;
        }
    }

    public Set data;
    public Set diagnostics;
}
