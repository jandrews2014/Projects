package org.intelligentriver.common.exceptions;

public class SQSInsertException extends Exception{

    public SQSInsertException(Exception inner){
        super("Failed inserting message to the queue.", inner);
    }
}
