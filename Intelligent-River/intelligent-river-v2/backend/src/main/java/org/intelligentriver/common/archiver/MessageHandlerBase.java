package org.intelligentriver.common.archiver;

import org.intelligentriver.common.DynamoDb;
import org.intelligentriver.common.SQS;
import org.intelligentriver.common.SQSWrapper;
import org.json.JSONObject;
import org.slf4j.Logger;

@SuppressWarnings("unused")
public abstract class MessageHandlerBase implements SQSWrapper.Callback {

    protected Logger mLogger;

    protected String mErrorQueue;
    protected String mTableName;

    protected DynamoDb mDynamoDb;

    protected SQS mSQS;
    private SQSWrapper mSQSWrapper;

    protected int mMessagesProcessed;

    /**
     * @param incomingQueue name of the incoming queue (observation_json by default)
     * @param errorQueue    name of the error queue (observation_unprocessed by default)
     */
    public MessageHandlerBase(String tableName, Logger logger, String incomingQueue, String errorQueue,
                              String keyAccess, String keySecret, String region, int maxMessages, int delay) {
        mErrorQueue = errorQueue;
        mTableName = tableName;
        mLogger = logger;

        mSQS = new SQS(keyAccess, keySecret, region, logger, maxMessages, delay);
        mSQSWrapper = new SQSWrapper(mSQS, incomingQueue, mLogger);
        mDynamoDb = new DynamoDb(keyAccess, keySecret, region, logger);
    }

    public void start() {
        mSQSWrapper.subscribe(this);
    }

    public void stop() {
        mSQSWrapper.unsubscribe(this);
    }

    /**
     * Publishes message to the error queue. The resulting message contains error description and the message itself.
     *
     * @param queue queue for the message to be sent to
     */
    protected void publishMessage(String queue, JSONObject json) {
        publishMessage(queue, json.toString());
    }

    protected void publishMessage(String queue, String message) {
        try {
            mSQS.sendMessage(queue, message);
        } catch (Exception e) {
            mLogger.error("ERROR: Failed sending message to the error queue." + e.toString());
        }
    }

    int getMessagesProcessed() {
        return mMessagesProcessed;
    }

    void resetMessagesProcessed(){
        mMessagesProcessed = 0;
    }
}
