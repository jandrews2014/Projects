package org.intelligentriver.common.exceptions;

public class DynamoNotFoundException extends Exception {

    public DynamoNotFoundException(Exception inner){
        super("Failed to find data in DynamoDb.", inner);
    }

}
