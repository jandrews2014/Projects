package org.intelligentriver.common.archiver;

import org.slf4j.Logger;

public abstract class ExecutorBase implements Runnable {

    public enum Status {Running, Stopped, Exception}

    protected MessageHandlerBase mHandler;
    protected static Logger mLogger;
    private Status mStatus = Status.Stopped;

    protected ExecutorBase(Logger logger) {
        mLogger = logger;
    }

    public void run() {
        if (mHandler != null) {
            mHandler.start();
        }
        mStatus = Status.Running;
        mLogger.info("Consumer started.");
        System.out.println("Consumer started.");
    }

    public void stop() {
        if (mHandler != null) {
            mHandler.stop();
            mHandler.resetMessagesProcessed();
        }
        mStatus = Status.Stopped;
        mLogger.info("Program stopped");
        System.out.println("Program stopped");
    }

    public Status getStatus() {
        return mStatus;
    }

    public int getMessagesProcessed() {
        return mHandler != null ? mHandler.getMessagesProcessed() : 0;
    }
}
