package org.intelligentriver.common;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.*;
import org.intelligentriver.common.exceptions.SQSDeleteException;
import org.intelligentriver.common.exceptions.SQSInsertException;
import org.intelligentriver.common.exceptions.SQSRetrieveException;
import org.slf4j.Logger;

import java.util.ArrayList;
import java.util.List;

/**
 * Required properties:
 * - AWS_KEY_SECRET & AWS_KEY_ACCESS: authentication of the service
 * - SQS_MAX_MESSAGES: maximum amount of messages that could be retrieved from the queue
 * - LOGGER: code of logger file for the status messages
 * - PROPERTY_SQS_DELAY
 */

public class SQS {

    //region Variables

    private static Logger mLogger;

    private AmazonSQS mSQS;
    private int mMaxMessages;
    private int mDelay;

    //endregion

    public SQS(String keyAccess, String keySecret, String region, Logger logger, int maxMessages, int delay) {
        try {
            mLogger = logger;

            AWSCredentials credentials = new BasicAWSCredentials(keyAccess, keySecret);
            mSQS = AmazonSQSClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(credentials))
                    .withRegion(region)
                    .build();
            mMaxMessages = Integer.valueOf(maxMessages);
            mDelay = Integer.valueOf(delay);
        } catch (Exception e) {
            mLogger.info("ERROR: can't load Amazon credentials." + e.toString());
        }

        mLogger.info("SQS Client has been initialized.");
        System.out.println("SQS Client has been initialized.");
    }

    int getDelay(){
        return mDelay;
    }

    public SendMessageResult sendMessage(String queue, String message) throws SQSInsertException {
        try {
            SendMessageRequest request = new SendMessageRequest(queue, message);
            request.setMessageGroupId("main");
            return mSQS.sendMessage(request);
        } catch (Exception exc){
            throw new SQSInsertException(exc);
        }
    }

    List<Message> retrieveMessage(String queue) throws SQSRetrieveException {
        try {
            ReceiveMessageRequest request = new ReceiveMessageRequest(queue);
            request.setMaxNumberOfMessages(mMaxMessages);
            return mSQS.receiveMessage(request).getMessages();
        } catch (Exception exc){
            throw new SQSRetrieveException(exc);
        }
    }

    void deleteMessages(String queue, List<Message> messages)  throws SQSDeleteException {
        try {
            List<DeleteMessageBatchRequestEntry> entries = new ArrayList<>();
            for (Message message : messages)
                entries.add(new DeleteMessageBatchRequestEntry(message.getMessageId(), message.getReceiptHandle()));
            DeleteMessageBatchRequest request = new DeleteMessageBatchRequest(queue, entries);
            mSQS.deleteMessageBatch(request);
        } catch (Exception exc){
            throw new SQSDeleteException(exc);
        }
    }
}
