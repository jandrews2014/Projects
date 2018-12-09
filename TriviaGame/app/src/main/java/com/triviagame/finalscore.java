package com.triviagame;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.TextView;

//This activity is called after displaying 10 questions
public class finalscore extends Activity implements OnClickListener {
	
	int finalScoreValue = 0;		
	int categoryIdInFinalActivity = 0;	
	String finalScoreValueString;
	
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.finalscore);
       
        finalScoreValue = com.triviagame.Trivia_Game.finalScore;
        categoryIdInFinalActivity = com.triviagame.Trivia_Game.categoryIdInMainMenu;
        
        //Displays final score
        TextView finalScore = (TextView) findViewById(R.id.finalscore);
		finalScoreValueString = Integer.toString(finalScoreValue);
        finalScore.setText(finalScoreValueString);
        
        
        TextView finalScoreImage = (TextView) findViewById(R.id.finalscoreimage);
        
        //Display and listener for New Game button
        View newGameButton =  findViewById (R.id.buttonnewgame);
        newGameButton.setOnClickListener(this);

        //Sets final image and message according to the category and the final score
        switch (categoryIdInFinalActivity){
        	//geography
        	case 0:
        		if (finalScoreValue  <= 60){
        			TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
        			finalMessageLabel.setText("You are not in sink with the planet!");
        			finalScoreImage.setBackgroundResource(R.drawable.geographybadoverallscore);
        		}
        			else
        				if (finalScoreValue > 60 ){
        					TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
                			finalMessageLabel.setText("Good job, the planet is proud of you!");
                			finalScoreImage.setBackgroundResource(R.drawable.geographygoodoverallscore);
        					
        				}
        		break;
        		
        	//politics
        	case 1:
        		if (finalScoreValue  <= 60){
        			TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
        			finalMessageLabel.setText("Go back to read the constitution!");
        			finalScoreImage.setBackgroundResource(R.drawable.politicsbadscoreoverall);
        		}
        			else
        				if (finalScoreValue > 60 ){
        					TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
                			finalMessageLabel.setText("Good job, Abraham gives you thumbs up!");
                			finalScoreImage.setBackgroundResource(R.drawable.politicsgoodscore3);
        					
        				}
        		break;
        	
        	//history
        	case 2:	if (finalScoreValue  <= 60){
        			TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
        			finalMessageLabel.setText("Go back to your history books!");
        			finalScoreImage.setBackgroundResource(R.drawable.historybadscoreoverall);
        		}
        			else
        				if (finalScoreValue > 60 ){
        					TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
                			finalMessageLabel.setText("Good job, Julius Caesar would be proud of you!");
                			finalScoreImage.setBackgroundResource(R.drawable.historygoodscoreoverall);
        					
        				}
        		break;
        		
        	//sports
        	case 3:	if (finalScoreValue  <= 60){
    			TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
    			finalMessageLabel.setText("You should watch ESPN more often!");
    			finalScoreImage.setBackgroundResource(R.drawable.sportsbadscoreoverall);
    		}
    			else
    				if (finalScoreValue > 60 ){
    					TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
            			finalMessageLabel.setText("Good job, you DO watch ESPN!");
            			finalScoreImage.setBackgroundResource(R.drawable.sportsgoodoveroverall);
    					
    				}
    		break;
    		
    		//science
        	case 4:	if (finalScoreValue  <= 60){
    			TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
    			finalMessageLabel.setText("You did not pay attention to your science teacher!");
    			finalScoreImage.setBackgroundResource(R.drawable.sciencebadscore4);
    		}
    			else
    				if (finalScoreValue > 60 ){
    					TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
            			finalMessageLabel.setText("Good job, Einstein just smiled for you!");
            			finalScoreImage.setBackgroundResource(R.drawable.sciencegoodscoreoverall);
    					
    				}
    		break;
    		
    		//movies
        	case 5:	if (finalScoreValue  <= 60){
    			TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
    			finalMessageLabel.setText("You should go to the movies more often!");
    			finalScoreImage.setBackgroundResource(R.drawable.moviesbadscore2);
    		}
    			else
    				if (finalScoreValue > 60 ){
    					TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
            			finalMessageLabel.setText("Good job, you DO follow the Academy!");
            			finalScoreImage.setBackgroundResource(R.drawable.moviesgoodoverallscore);
    					
    				}
    		break;
    		
    		//general
        	case 6:	if (finalScoreValue  <= 60){
    			TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
    			finalMessageLabel.setText("Read, learn or travel more often.  There is a lot for you to learn!");
    			finalScoreImage.setBackgroundResource(R.drawable.generalbadoverallscore);
    		}
    			else
    				if (finalScoreValue > 60 ){
    					TextView finalMessageLabel = (TextView) findViewById(R.id.finalmessage);
            			finalMessageLabel.setText("Good job overall, keep it up!");
            			finalScoreImage.setBackgroundResource(R.drawable.generalgoodoverallscore);
    					
    				}
    		break;
    
        }
	}

	
	//Listeners for button(s)
	@Override
	public void onClick(View v) {
		
		switch (v.getId()) {
		
		case R.id.buttonnewgame:
			Intent g = new Intent(this,Trivia_Game.class);
            startActivity(g);

		}
	}
	
	
    @Override
    protected void onResume(){
    	super.onResume();
    	music.play(this, R.raw.musicbackground);	//start playing background music
    }
    
    @Override
    protected void onPause(){
    	super.onPause();
    	music.stop(this);		//stop playing background music
    }
	
}
