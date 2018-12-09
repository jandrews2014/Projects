package com.triviagame;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.SQLException;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class DataBaseHelper extends SQLiteOpenHelper{
 
    //The Android's default system path of the application's database.
    private static String DB_PATH = "/data/data/com.triviagame/databases/";
 
    private static String DB_NAME = "mobile_trivia2.db";
 
    private SQLiteDatabase myDataBase; 
  
    private final Context myContext;
 
    
     /* Constructor
     * Takes and keeps a reference of the passed context in order to access to the application assets and resources.
     * @param context
     */
    public DataBaseHelper(Context context) {
 
    	super(context, DB_NAME, null, 1);
        this.myContext = context;
    }	
 
    /**
     * Creates a empty database on the system and rewrites it with your own database.
     * */
    public void createDataBase() throws IOException{
 
    	boolean dbExist = checkDataBase();
 
    	if(dbExist){
    		//do nothing - database already exist
    	}
    	else{
 
    		//By calling this method and empty database will be created into the default system path
               //of your application so we are going to be able to overwrite that database with our database.
        	this.getReadableDatabase();
 
        	try {
 
    			copyDataBase();
 
    		} catch (IOException e) {
 
        		throw new Error("Error copying database");
 
        	}
    	}
 
    }
 
    /**
     * Check if the database already exist to avoid re-copying the file each time you open the application.
     * @return true if it exists, false if it doesn't
     */
    private boolean checkDataBase(){
 
    	SQLiteDatabase checkDB = null;
 
    	try{
    		String myPath = DB_PATH + DB_NAME;
    		checkDB = SQLiteDatabase.openDatabase(myPath, null, SQLiteDatabase.OPEN_READONLY);
 
    	}catch(SQLiteException e){
 
    		//database does't exist yet.
    		Log.e("DBHelper", "DataBase Does Not Exist closing returning null");
 
    	}
 
    	if(checkDB != null){
    		
    		Log.e("DBHelper", "DataBase Exists closing checkDB");
    		checkDB.close();
 
    	}
 
    	return checkDB != null ? true : false;
    }
 
    /**
     * Copies your database from your local assets-folder to the just created empty database in the
     * system folder, from where it can be accessed and handled.
     * This is done by transferring byte-stream.
     * */
    private void copyDataBase() throws IOException{
 
    	//Open your local db as the input stream
    	InputStream myInput = myContext.getAssets().open(DB_NAME);
 
    	// Path to the just created empty db
    	String outFileName = DB_PATH + DB_NAME;
 
    	//Open the empty db as the output stream
    	OutputStream myOutput = new FileOutputStream(outFileName);
 
    	//transfer bytes from the inputfile to the outputfile
    	byte[] buffer = new byte[1024];
    	int length;
    	while ((length = myInput.read(buffer))>0){
    		myOutput.write(buffer, 0, length);
    	}
 
    	//Close the streams
    	myOutput.flush();
    	myOutput.close();
    	myInput.close();
 
    }
 
    public void openDataBase() throws SQLException{
 
    	//Open the database
        String myPath = DB_PATH + DB_NAME;
    	myDataBase = SQLiteDatabase.openDatabase(myPath, null, SQLiteDatabase.OPEN_READONLY);
 
    }
 
    @Override
	public synchronized void close() {
 
    	    if(myDataBase != null)
    		    myDataBase.close();
 
    	    super.close();
 
	}
 
	@Override
	public void onCreate(SQLiteDatabase db) {
 
	}
 
	//Returns the question from the database using the category ID and the question ID passed to it
	public String getQuestion( int categoryId, int questionId){
	
		final String[] FROM = {"question"}; //string array of which columns to look through in the table
		String categoryStr = "General";		//default value
		
		//converts the numeric category ID to its corresponding String value
		switch (categoryId){
			case 0:
				categoryStr = "geography"; break;
			case 1:
				categoryStr = "politics"; break;
			case 2:
				categoryStr = "History"; break;
			case 3:
				categoryStr = "sports"; break;
			case 4:
				categoryStr = "science"; break;
			case 5:
				categoryStr = "movies"; break;
			case 6:
				categoryStr = "General"; break;
			default:
				categoryStr = "General"; break;
			
		}
		
			
			Cursor cursor=myDataBase.query(categoryStr, FROM, "_id=="+questionId, null, null, null, null);//build the query, pass null for default filtering
			cursor.moveToFirst();//move the cursor to the first index location in the result column
			String result=cursor.getString(0);//return the first result column (index 0)
			
			return result;  //returns question

	}
	
	//Returns the correct answer according the the category ID and the question ID passed to it
	public String getCorrectAnswer( int categoryId, int questionId){
		final String[] FROM = {"correct"}; //string array of which columns to look through in the table
		String categoryStr = "General";	//Default value
		
		//converts the numeric category ID to its corresponding String value
		switch (categoryId)
		{
			case 0:
				categoryStr = "geography"; break;
			case 1:
				categoryStr = "politics"; break;
			case 2:
				categoryStr = "History"; break;
			case 3:
				categoryStr = "sports"; break;
			case 4:
				categoryStr = "science"; break;
			case 5:
				categoryStr = "movies"; break;
			case 6:
				categoryStr = "General"; break;
			default:
				categoryStr = "General";
	
		}
			
				Cursor cursor=myDataBase.query(categoryStr, FROM, "_id=="+questionId, null, null, null, null);//build the query, pass null for default filtering
				cursor.moveToFirst();//move the cursor to the first index location in the result column
				String result=cursor.getString(0);//return the first result column (index 0)
				return result;	//returns correct answer

	} 
	
	//Returns the first wrong answer from the database according to the category ID and question ID passed to it
	public String getWrongAnswer1( int categoryId, int questionId){
		final String[] FROM = {"wrong1"}; //string array of which columns to look through in the table
		String categoryStr = "General";	//default value
		
		//converts the numeric category ID to its corresponding String value
		switch (categoryId)
		{
			case 0:
				categoryStr = "geography"; break;
			case 1:
				categoryStr = "politics"; break;
			case 2:
				categoryStr = "History"; break;
			case 3:
				categoryStr = "sports"; break;
			case 4:
				categoryStr = "science"; break;
			case 5:
				categoryStr = "movies"; break;
			case 6:
				categoryStr = "General"; break;
			default:
				categoryStr = "General";
	
		}
			
				Cursor cursor=myDataBase.query(categoryStr, FROM, "_id=="+questionId, null, null, null, null);//build the query, pass null for default filtering
				cursor.moveToFirst();//move the cursor to the first index location in the result column
				String result=cursor.getString(0);//return the first result column (index 0)
				return result;	//returns first wrong answer

	} 
	
	//Returns the second wrong answer from the database according to the category ID and question ID passed to it
	public String getWrongAnswer2( int categoryId, int questionId){
		final String[] FROM = {"wrong2"}; //string array of which columns to look through in the table
		String categoryStr = "General";	//default value
		
		//converts the numeric category ID to its corresponding String value
		switch (categoryId)
		{
			case 0:
				categoryStr = "geography"; break;
			case 1:
				categoryStr = "politics"; break;
			case 2:
				categoryStr = "History"; break;
			case 3:
				categoryStr = "sports"; break;
			case 4:
				categoryStr = "science"; break;
			case 5:
				categoryStr = "movies"; break;
			case 6:
				categoryStr = "General"; break;
			default:
				categoryStr = "General";
	
		}
			
				Cursor cursor=myDataBase.query(categoryStr, FROM, "_id=="+questionId, null, null, null, null);//build the query, pass null for default filtering
				cursor.moveToFirst();//move the cursor to the first index location in the result column
				String result=cursor.getString(0);//return the first result column (index 0)
				return result; 	//returns second wrong answer

	} 
	
	//Returns the second wrong answer from the database according to the category ID and question ID passed to it
	public String getWrongAnswer3( int categoryId, int questionId){
		final String[] FROM = {"wrong3"}; //string array of which columns to look through in the table
		String categoryStr = "General";
		
		//converts the numeric category ID to its corresponding String value
		switch (categoryId)
		{
			case 0:
				categoryStr = "geography"; break;
			case 1:
				categoryStr = "politics"; break;
			case 2:
				categoryStr = "History"; break;
			case 3:
				categoryStr = "sports"; break;
			case 4:
				categoryStr = "science"; break;
			case 5:
				categoryStr = "movies"; break;
			case 6:
				categoryStr = "General"; break;
			default:
				categoryStr = "General";
	
		}
			
				Cursor cursor=myDataBase.query(categoryStr, FROM, "_id==" + questionId, null, null, null, null);//build the query, pass null for default filtering
				cursor.moveToFirst();//move the cursor to the first index location in the result column
				String result=cursor.getString(0);//return the first result column (index 0)
				return result;	//returns third wrong answer

	}

	@Override
	public void onUpgrade(SQLiteDatabase arg0, int arg1, int arg2) {
		// TODO Auto-generated method stub
		
	} 
}

