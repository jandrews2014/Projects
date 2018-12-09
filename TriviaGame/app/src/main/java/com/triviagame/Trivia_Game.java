package com.triviagame;



import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;

//Called when app is launched
public class Trivia_Game extends Activity implements OnClickListener {
	
	static int  categoryIdInMainMenu;		//category selected by player in main menu
	static int finalScore;					//final score for the session
    
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        //Sets buttons for different categories and their listeners
        View geography_button = findViewById(R.id.geography_button);
        geography_button.setOnClickListener(this);
        View politics_button = findViewById(R.id.politics_button);
        politics_button.setOnClickListener(this);
        View history_button = findViewById(R.id.history_button);
        history_button.setOnClickListener(this);
        View sports_button = findViewById(R.id.sports_button);
        sports_button.setOnClickListener(this);        
        View science_button = findViewById(R.id.science_button);
        science_button.setOnClickListener(this);      
        View movies_button = findViewById(R.id.movies_button);
        movies_button.setOnClickListener(this);           
        View general_button = findViewById(R.id.general_button);
        general_button.setOnClickListener(this);        
        
    }
    
    //Returns the categoryId selected in the main menu
    public static int getCategoryIdInMainMenu (){
    	return categoryIdInMainMenu;
    }
    
    
    //Listeners for the buttons with all the categories
    public void onClick(View v) {
    	
        switch (v.getId()) {
                
        //Geography category was selected
        case R.id.geography_button:
        	categoryIdInMainMenu = 0;
        	finalScore = 0;
            Intent a = new Intent(this, game.class);
            startActivity(a);
            break;
        
        //Politics category was selected
        case R.id.politics_button:
        	categoryIdInMainMenu = 1;
        	finalScore = 0;
            Intent b = new Intent(this, game.class);
            startActivity(b);
            break;

        //History category was selected
        case R.id.history_button:
        	categoryIdInMainMenu = 2;
        	finalScore = 0;
            Intent c = new Intent(this, game.class);
            startActivity(c);
            break;
        
        //Sports category was selected
        case R.id.sports_button:
        	categoryIdInMainMenu = 3;
        	finalScore = 0;
            Intent d = new Intent(this, game.class);
            startActivity(d);
            break;    
 
        //Science category was selected
        case R.id.science_button:
        	categoryIdInMainMenu = 4;
        	finalScore = 0;
            Intent e = new Intent(this, game.class);
            startActivity(e);
            break;   
            
        //Movies category was selected
        case R.id.movies_button:
        	categoryIdInMainMenu = 5;
        	finalScore = 0;
            Intent f = new Intent(this, game.class);
            startActivity(f);
            break;    
            
        //General category was selected
        case R.id.general_button:
        	categoryIdInMainMenu = 6;
        	finalScore = 0;
            Intent g = new Intent(this, game.class);
            startActivity(g);
            break;    
   
        }
     }
    
    @Override
    protected void onResume(){
    	super.onResume();
    	music.play(this, R.raw.musicbackground);		//Play background music
    }
    
    @Override
    protected void onPause(){
    	super.onPause();
    	music.stop(this);								//stop background music
    }
    
  
   
}