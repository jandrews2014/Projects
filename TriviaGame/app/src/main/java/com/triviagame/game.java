package com.triviagame;


import java.io.IOException;
import java.sql.SQLException;
import java.util.Random;



import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

// This activity is called when the player selects a category in the main menu
public class game extends Activity implements OnClickListener {
	
	//int[] anArray;
	int[] anArray2 = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0};	//array that stores the question ID's already displayed
	int numberOfQuestionsDisplayedCounter = 0;			//counter of questions displayed
	 
	int nextOrFinishValue = 0;   						// 0 for Next, 1 for Finish - refers to label of button
	int randomValueZeroToThree = 0;						//Random number between 1 and 4 for displaying the different answers on the screen
	int randomValue0to29 = 0;							//Random number between 1 and 30 for question ID's
	boolean alreadyDisplayQuestion = false;				//If True, the questionId can't be displayed again
	boolean validQuestionNumber = false;				//If True, the questionId can be displayed 
	boolean rightButton1 = false;						//If True, button1 is displaying the correct answer
	boolean rightButton2 = false;						//If True, button2 is displaying the correct answer
	boolean rightButton3 = false;						//If True, button3 is displaying the correct answer
	boolean rightButton4 = false;						//If True, button4 is displaying the correct answer
	
	String questionFromDatabase;						//question as retrieved from the database
	String answer1FromDatabase;							//correct answer as retrieved from the database
	String answer2FromDatabase;							//wrong answer1 as retrieved from the database		
	String answer3FromDatabase;							//wrong answer2 as retrieved from the database
	String answer4FromDatabase;							//wrong answer3 as retrieved from the database
	String displayedQuestionFromDatabase = "question ";	//question to be displayed
	String displayedAnswer1FromDatabase = "answer1a ";	//answer1 to be displayed
	String displayedAnswer2FromDatabase = "answer2a ";	//answer2 to be displayed
	String displayedAnswer3FromDatabase = "answer3a ";	//answer3 to be displayed
	String displayedAnswer4FromDatabase = "answer4a ";	//answer4 to be displayed
	
	int categoryId = 0;									//Id that identifies the category the player selected in main menu
	int questionId = 0;									//Id that identifies the question to be displayed
	//int button1 = 1;
	//int button2 = 2;
	//int button3 = 3;
	//int button4 = 4;
	int currentScore = 0;

	 public void onCreate(Bundle savedInstanceState) {
	        int randomInt = 1;
	        
	        super.onCreate(savedInstanceState);
	        categoryId = com.triviagame.Trivia_Game.categoryIdInMainMenu;
	        //System.out.println("categoryID =" + categoryId);

	        setContentView(R.layout.displayquestion);
	        
	        //gathers question and answers from database
	        gatherInfoBeforePopulating ();  //includes genetating random number between getting info from database 1 to 30
	        
	        //displays question, answers, score
	        populateWithQuestionInfo(displayedQuestionFromDatabase, displayedAnswer1FromDatabase, displayedAnswer2FromDatabase, displayedAnswer3FromDatabase, displayedAnswer4FromDatabase, nextOrFinishValue);
	       
	        //Sets buttons and listers for the buttons with the 4 possible answers
	        View answer1button = findViewById(R.id.answer1button);
	        answer1button.setOnClickListener(this);
	        View answer2button = findViewById(R.id.answer2button);
	        answer2button.setOnClickListener(this);
	        View answer3button = findViewById(R.id.answer3button);
	        answer3button.setOnClickListener(this);
	        View answer4button = findViewById(R.id.answer4button);
	        answer4button.setOnClickListener(this);
	        View nextQuestion = findViewById(R.id.nextquestion);
	        nextQuestion.setOnClickListener(this);
	     


}
	 
	 //Displays question, answers, score
	 public void populateWithQuestionInfo(String question, String answer1, String answer2,String answer3,String answer4, int nextQuestionOrFinish){
	        //populate the question label
		 	TextView questionLabel = (TextView) findViewById (R.id.question); 
	        questionLabel.setText(question);	
	        
	       //populate answer1
	        Button buttonAnswer1 = (Button) findViewById (R.id.answer1button);
	        buttonAnswer1.setText(answer1);
	        
	        //populate answer2
	        Button buttonAnswer2 = (Button) findViewById (R.id.answer2button);
	        buttonAnswer2.setText(answer2);
	        
	        //populate answer3
	        Button buttonAnswer3 = (Button) findViewById (R.id.answer3button);
	        buttonAnswer3.setText(answer3);
	        
	        //populate answer4
	        Button buttonAnswer4 = (Button) findViewById (R.id.answer4button);
	        buttonAnswer4.setText(answer4);
	        
	        Button buttonNextQuestion = (Button) findViewById (R.id.nextquestion);
	        if (nextQuestionOrFinish == 0){
	        	buttonNextQuestion.setText("Next");
	        }
	        else {
	        	buttonNextQuestion.setText("Finish");
	        }
	        
	        numberOfQuestionsDisplayedCounter++;

	 }

	 //Generates a random number between 0 and 3 to be used to display the possible answers randomly
	 int RandomGeneratorZeroToThree (){
		 int randomInt = 0;
		 Random randomGenerator = new Random();
		 for (int idx = 1; idx <= 10; ++idx) {
			 randomInt = randomGenerator.nextInt(4);

		 }
		 return randomInt;
	 }
	 
	 //Generates a random number between 0 and 29 to be used to select the question to be displayed
	 int RandomGenerator0To29 (){
		 int randomInt2 = 0;
		 Random randomGenerator2 = new Random();
		 for (int idx2 = 1; idx2 <= 10; ++idx2) {
			 randomInt2 = randomGenerator2.nextInt(30);
		 }
		 return randomInt2;
	 }	 
	
	 //returns true if the question has already been displayed
	 //returns false if the question has not been already displayed
	 boolean questionsAlreadyDisplayed (int randomValue0to29){
		 for (int i = 0 ; i < 10 ; i++){
			 if (anArray2 [i] == randomValue0to29){
				 return true;	//question already displayed
			 }
			
		 }
		 anArray2 [numberOfQuestionsDisplayedCounter] = randomValue0to29; // questionId added to array of displayed questions
		 return false;	//random number can be used as it has been used already
	 }
		 
	//Connects to the database to gather the question and 4 possible answers.  Uses DataBaseHelper class
	 void getInfoFromDatabase(int categoryId, int questionId){

			DataBaseHelper myDbHelper = new DataBaseHelper(this
					.getApplicationContext());
			myDbHelper = new DataBaseHelper(this);

			try {

				myDbHelper.createDataBase();

			} catch (IOException ioe) {

				throw new Error("Unable to create database");

			}

			try {

				myDbHelper.openDataBase();
				questionFromDatabase = myDbHelper.getQuestion(categoryId, questionId);
			 
				displayedQuestionFromDatabase = questionFromDatabase;
				System.out.println("questionFromDatabase = " + questionFromDatabase);
				answer1FromDatabase =  myDbHelper.getCorrectAnswer(categoryId, questionId);  //correct answer from database
				System.out.println("correct answer from db = " + answer1FromDatabase );
				answer2FromDatabase =  myDbHelper.getWrongAnswer1(categoryId, questionId);
				answer3FromDatabase =  myDbHelper.getWrongAnswer2(categoryId, questionId);
				answer4FromDatabase =  myDbHelper.getWrongAnswer3(categoryId, questionId);
			
				myDbHelper.close();
			
			} catch (SQLException sqle) {
				System.out.println("Errored out");
				try {
					throw sqle;
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
	   
	 }
	 
	 //If the player selects the right answer this method is called to increase the score by 10 points
	 void increaseScore(){
		 currentScore = currentScore + 10;
		 com.triviagame.Trivia_Game.finalScore = currentScore;
	 }
	 
	 //If the player selects the wrong answer this method is called to decrease the score by 10 points
	void decreaseScore(){
		currentScore = currentScore - 10;
		com.triviagame.Trivia_Game.finalScore = currentScore;
	}
	
	//Displays the current scores on the activity
	void displayScore(){
		TextView yourScore = (TextView) findViewById (R.id.yourscore); 
        String currentScoreText;
        currentScoreText = Integer.toString(currentScore);
		yourScore.setText(currentScoreText);
		
	}
	
	 //gathers question and answers from database
	void gatherInfoBeforePopulating (){
		
		categoryId = Trivia_Game.getCategoryIdInMainMenu();

	        	   //Loop until a valid questionId that hasn't been used is obtained
	        		while (validQuestionNumber == false){
	        			randomValue0to29 = RandomGenerator0To29();
	        			System.out.println("random30 in onClick = " + randomValue0to29);

	        		   alreadyDisplayQuestion = questionsAlreadyDisplayed (randomValue0to29);
	        		   if (alreadyDisplayQuestion == true){
	        			   System.out.println("question number already displayed looking for a non displayed question");
	        		   }
	        		   if (alreadyDisplayQuestion == false){
	        			   System.out.println("question not displayed yet");
	        			   validQuestionNumber = true;
	        		   }
	        	   }
	        	   
	        	   validQuestionNumber = false;
	        	   alreadyDisplayQuestion = false;
	        	   questionId = randomValue0to29;	//sets the valid random generated number to the questionID
	        	   
	        	   //connect to database to gather the question and answers
	        	   getInfoFromDatabase(categoryId, questionId);
     	
	        	   //Calls random number from 0 to 3 to determine which button will display the correct answer
	        	   randomValueZeroToThree = RandomGeneratorZeroToThree();
	        	   System.out.println("random4 in onClick = " + randomValueZeroToThree);
	        	   
	        	   //Sets the order according to the button that is to display the correct answer
	        	   switch (randomValueZeroToThree){
	        	   	case 0:
	        	   		displayedAnswer1FromDatabase = answer1FromDatabase;	//correct answer
	        	   		displayedAnswer2FromDatabase = answer2FromDatabase;
	        	   		displayedAnswer3FromDatabase = answer3FromDatabase;
	        	   		displayedAnswer4FromDatabase = answer4FromDatabase;
	        	   		rightButton1 = true;
	        	   		rightButton2 = false;
	        	   		rightButton3 = false;
	        	   		rightButton4 = false;
	        	   		break;
	        	   		
	        	   	case 1:
	        	   		displayedAnswer2FromDatabase = answer1FromDatabase;	//correct answer
	        	   		displayedAnswer1FromDatabase = answer2FromDatabase;
	        	   		displayedAnswer3FromDatabase = answer3FromDatabase;
	        	   		displayedAnswer4FromDatabase = answer4FromDatabase;
	        	   		rightButton1 = false;
	        	   		rightButton2 = true;
	        	   		rightButton3 = false;
	        	   		rightButton4 = false;
	        	   		break;
	        	   	
	        	   	case 2:
	        	   		displayedAnswer3FromDatabase = answer1FromDatabase;	//correct answer
	        	   		displayedAnswer1FromDatabase = answer2FromDatabase;
	        	   		displayedAnswer2FromDatabase = answer3FromDatabase;
	        	   		displayedAnswer4FromDatabase = answer4FromDatabase;
	        	   		rightButton1 = false;
	        	   		rightButton2 = false;
	        	   		rightButton3 = true;
	        	   		rightButton4 = false;
	        	   		break;
	        	   		
	        	   	case 3:
	        	   		displayedAnswer4FromDatabase = answer1FromDatabase;	//correct answer
	        	   		displayedAnswer1FromDatabase = answer2FromDatabase;
	        	   		displayedAnswer3FromDatabase = answer3FromDatabase;
	        	   		displayedAnswer2FromDatabase = answer4FromDatabase;
	        	   		rightButton1 = false;
	        	   		rightButton2 = false;
	        	   		rightButton3 = false;
	        	   		rightButton4 = true;
	        	   		break;
	        	   	
	        	   	default: 
	        	   		displayedAnswer1FromDatabase = answer4FromDatabase;	//no correct answer
	        	   		displayedAnswer2FromDatabase = answer2FromDatabase;
	        	   		displayedAnswer3FromDatabase = answer3FromDatabase;
	        	   		displayedAnswer4FromDatabase = answer1FromDatabase;	
	        	   		rightButton1 = false;
	        	   		rightButton2 = false;
	        	   		rightButton3 = false;
	        	   		rightButton4 = false;
	        	   		
        	   }
	        
	           // After the 9th question is displayed, the nextOfFinishValue should be set to 1 so the button displayes Finish instead of Next
        	   if (numberOfQuestionsDisplayedCounter < 9){
	        			nextOrFinishValue = 0;
	        		}
	        		else{
	        			nextOrFinishValue = 1;
	        		}
		
	}

	//Listeners for the 4 buttons with answers and the Next or Finish buttons
	 public void onClick(View v) {
	        switch (v.getId()) {
	 	           
	        case R.id.answer1button:
	        	if (rightButton1 == true){
	        		increaseScore();
	        		Intent a1 = new Intent(this, correctanswer.class);		//right answer, call the correct answer activity
	        		startActivity(a1);
	        		
	        	}
	        	else{
	        		decreaseScore();
	        		Intent a2 = new Intent(this, wronganswer.class);		//wrong answer, call the correct answer activity
			        startActivity(a2);
	        	}
	        break;
	           
	           
	           
	        case R.id.answer2button:
	        	if (rightButton2 == true){
	        		increaseScore();
	        		Intent b1 = new Intent(this, correctanswer.class);		//right answer, call the correct answer activity
	        		startActivity(b1);
	        	}
	        	else{
	        		decreaseScore();
	        		Intent b2 = new Intent(this, wronganswer.class);		//wrong answer, call the correct answer activity
			        startActivity(b2);
	        	}
	        break;
	        

	        case R.id.answer3button:
	        	if (rightButton3 == true){
	        		increaseScore();
	        		Intent c1 = new Intent(this, correctanswer.class);		//right answer, call the correct answer activity
	        		startActivity(c1);
	        	}
	        	else{
	        		decreaseScore();
	        		Intent c2 = new Intent(this, wronganswer.class);		//wrong answer, call the correct answer activity
			        startActivity(c2);
	        	}
	        break;
	        
	        case R.id.answer4button:
	        	if (rightButton4 == true){
	        		increaseScore();
	        		Intent d1 = new Intent(this, correctanswer.class);		//right answer, call the correct answer activity
	        		startActivity(d1);
	        	}
	        	else{
	        		decreaseScore();
	        		Intent d2 = new Intent(this, wronganswer.class);		//wrong answer, call the correct answer activity
			        startActivity(d2);
	        	}
	        break;
	        
	        case R.id.nextquestion:
		    
	        		if (nextOrFinishValue == 1){
	        			Intent e = new Intent(this, finalscore.class );		//if 10 questions have been displayed, call final score activity
		        		startActivity(e);
	        			
	        			
	        		}
	        		if (nextOrFinishValue == 0){							//If 10 questions have not been displayed yet, display the next question
	        		gatherInfoBeforePopulating ();
	        	    displayScore();
	        		populateWithQuestionInfo(displayedQuestionFromDatabase, displayedAnswer1FromDatabase, displayedAnswer2FromDatabase, displayedAnswer3FromDatabase, displayedAnswer4FromDatabase, nextOrFinishValue);
	        		}
	        		break;       

	        }
	     }
	 
	 
	    @Override
	    protected void onResume(){
	    	super.onResume();
	    	music.play(this, R.raw.musicbackground);			//play background music
	    }
	    
	    @Override
	    protected void onPause(){
	    	super.onPause();
	    	music.stop(this);									//stop playing background music
	 
	    }
}
