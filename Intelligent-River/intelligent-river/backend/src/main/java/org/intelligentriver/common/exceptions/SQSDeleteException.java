package org.intelligentriver.common.exceptions;

public class SQSDeleteException extends Exception {

    public SQSDeleteException(Exception inner){
        super("Failed deleting message from the queue.", inner);
    }
}
