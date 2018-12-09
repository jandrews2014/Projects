package org.intelligentriver.common.exceptions;

public class SQSRetrieveException extends Exception {

    public SQSRetrieveException(Exception inner){
        super("Failed retrieving data from the queue.", inner);
    }
}
