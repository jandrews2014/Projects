package org.intelligentriver.common;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient;
import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.document.spec.QuerySpec;
import com.amazonaws.services.dynamodbv2.document.utils.ValueMap;
import org.intelligentriver.common.exceptions.DynamoDeleteException;
import org.intelligentriver.common.exceptions.DynamoInsertException;
import org.intelligentriver.common.exceptions.DynamoNotFoundException;
import org.slf4j.Logger;

import java.util.Iterator;

@SuppressWarnings("unused")
public class DynamoDb {

    private Logger mLogger;
    private DynamoDB mDB;

    public DynamoDb(String keyAccess, String keySecret, String region, Logger logger) {
        try {
            mLogger = logger;

            AWSCredentials credentials = new BasicAWSCredentials(keyAccess, keySecret);

            AmazonDynamoDB client = AmazonDynamoDBClient.builder()
                    .withCredentials(new AWSStaticCredentialsProvider(credentials))
                    .withRegion(region)
                    .build();
            mDB = new DynamoDB(client);
        } catch (Exception e) {
            mLogger.info("ERROR: can't load Amazon credentials." + e.toString());
        }
    }

    public void put(String tableName, Item item) throws DynamoInsertException {
        try {
            Table table = mDB.getTable(tableName);
            table.putItem(item);
        } catch (Exception exc) {
            mLogger.error("ERROR: Failed inserting the items into the table." + exc.toString());
            throw new DynamoInsertException(exc);
        }
    }

    public Item get(String tableName, String key, String value) throws DynamoNotFoundException {
        try {
            Table table = mDB.getTable(tableName);
            PrimaryKey primaryKey = new PrimaryKey();
            primaryKey.addComponent(key, value);
            return table.getItem(primaryKey);
        } catch (Exception exc) {
            throw new DynamoNotFoundException(exc);
        }
    }

    public void remove(String tableName, String key, String value) throws DynamoDeleteException {
        try {
            Table table = mDB.getTable(tableName);
            PrimaryKey primaryKey = new PrimaryKey();
            primaryKey.addComponent(key, value);
            table.deleteItem(primaryKey);
        } catch (Exception exc) {
            mLogger.error("ERROR: Failed to delete the items into the table." + exc.toString());
            throw new DynamoDeleteException(exc);
        }
    }

    public void destroy() {
        mDB = null;
    }

    /**
     * @param day has to be in the format yyyy-MM-dd (new DateTime().toString("yyyy-MM-dd") for today)
     */
    public Iterator<Item> query(String tableName, String day) throws DynamoNotFoundException {
        Table table = mDB.getTable(tableName);

        QuerySpec spec = new QuerySpec()
                .withKeyConditionExpression("id = :v_id")
                .withScanIndexForward(false) // true - ascending, false - descending
                .withValueMap(new ValueMap()
                        .withString(":v_id", day));

        return table.query(spec).iterator();
    }
}
