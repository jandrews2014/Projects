package org.intelligentriver.common;

import com.amazonaws.services.sqs.model.Message;
import com.amazonaws.services.sqs.model.MessageAttributeValue;
import org.apache.http.util.TextUtils;
import org.intelligentriver.common.exceptions.SQSDeleteException;
import org.intelligentriver.common.exceptions.SQSRetrieveException;
import org.slf4j.Logger;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SQSWrapper {

    public interface Callback {
        void handleMessage(Map<String, MessageAttributeValue> headers, String messageId, String body);
    }

    private SQS mSQS;
    private String mQueueName;
    private Thread mThread;
    private List<Callback> mCallbacks;
    private Logger mLogger;

    public SQSWrapper(SQS sqs, String queueName, Logger logger) {
        if (sqs == null) throw new NullPointerException("SQS cannot be null.");
        mQueueName = queueName;
        mSQS = sqs;
        mLogger = logger;
        mCallbacks = new ArrayList<>();
    }

    public void subscribe(Callback callback) {
        if (callback == null) return;

        mCallbacks.add(callback);
        if (mThread == null) {
            initThread();
            mThread.start();
        }
    }

    public void unsubscribe(Callback callback) {
        if (callback == null) return;

        mCallbacks.remove(callback);
        if (mCallbacks.isEmpty() && mThread != null) {
            mThread.interrupt();
            mThread = null;
        }
    }

    /**
     * Starts the main thread of working with SQS queues.
     * It loads bundles of queues (amount is set in settings).
     * Then the messages are being processed by the subscribed callback methods
     * and deleted after completion. If something cannot be deleted, exception is thrown and logged.
     */
    @SuppressWarnings("InfiniteLoopStatement")
    private void initThread() {
        mThread = new Thread(() -> {
            while (true) {
                try {
                    List<Message> messages = mSQS.retrieveMessage(mQueueName);
                    for (Message message : messages)
                        fireCallbacks(message);
                    if (messages.size() > 0)
                        mSQS.deleteMessages(mQueueName, messages);
                    Thread.sleep(mSQS.getDelay());
                } catch (SQSRetrieveException exc) {
                    mLogger.error("ERROR: Failed loading the messages from SQS." + exc.toString());
                } catch (SQSDeleteException exc) {
                    mLogger.error("ERROR: Failed deleting the messages from SQS." + exc.toString());
                } catch (Exception exc) {
                    mLogger.error("ERROR: Something bad has happened." + exc.toString());
                }
            }
        });
    }

    /**
     * The method, responsible of calling all the callbacks and sending 'em the message.
     */
    private void fireCallbacks(Message message) {
        if (message == null) return;
        for (Callback callback : mCallbacks)
            if (!TextUtils.isEmpty(message.getBody()))
                callback.handleMessage(message.getMessageAttributes(), message.getMessageId(), message.getBody());
    }
}
