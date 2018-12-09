package org.intelligentriver.common.exceptions;

public class DynamoDeleteException extends Exception {

    public DynamoDeleteException(Exception inner){
        super("Failed to delete data in DynamoDb.", inner);
    }

}
