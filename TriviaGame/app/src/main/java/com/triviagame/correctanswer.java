package com.triviagame;

import android.app.Activity;
import android.os.Bundle;


public class correctanswer extends Activity  {
	
	//This activity is launched when the player selects the correct answer
	
	@Override
	 protected void onCreate(Bundle savedInstanceState) {
	    
		super.onCreate(savedInstanceState);
	        setContentView(R.layout.correctansweractivity);
	      
	}

	 @Override
	 protected void onResume(){
	    	super.onResume();
	    	music.play(this, R.raw.right_answer_selected);  //play music when right answer is selected
	 }
	    
	 @Override
	 protected void onPause(){
	    	super.onPause();
	    	music.stop(this);  //stop music playing for selecting the right answer
	 
	 }
}