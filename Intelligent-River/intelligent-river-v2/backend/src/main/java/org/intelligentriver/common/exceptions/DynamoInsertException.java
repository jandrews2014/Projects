package org.intelligentriver.common.exceptions;

public class DynamoInsertException extends Exception {

    public DynamoInsertException(Exception inner){
        super("Failed sending data to DynamoDb.", inner);
    }

}
