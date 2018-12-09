package com.triviagame;

import android.app.Activity;
import android.os.Bundle;

//This activity is displayed when the player selects the wrong answer
public class wronganswer extends Activity {
	
	 public void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        setContentView(R.layout.wrongansweractivity);

	 }
	 
	 @Override
	    protected void onResume(){
	    	super.onResume();
	    	music.play(this, R.raw.wrong_answer_selected);		//play music for wrong answer
	    }
	    
	    @Override
	    protected void onPause(){
	    	super.onPause();
	    	music.stop(this);									//stop playing music for wrong answer
	 
	    }
}