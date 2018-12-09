//Jamie Andrews, 22 November 2014, Programming Assignment #4

//preprosessor directives
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <string.h>

/*Algorithm
*/

//put struct here
typedef struct{
	int quantity;//number wanted to purchase
	int serial;//item number
	double cost;//amount paid for item
	double price;//price of item
	char title[20]; //name of item
	char rating;//item rating
} games;

//prototypes
//present menu choices & get choice
void DisplayMenu(char *choicePtr);
//Hardcode 5 & G entries
void Hardcodefive(games myStore[], int *num);
//print file onto screen
void printCatalog(int num, games myStore[]);
//save to file
void saveToFile(games myStore[],int num);
//clear the catalog
void clearList(int *num);
//add to file
void addItem(games myStore[], int *num);
//delete the file
void Delete(games myStore[], int *num);
//subtract hundred from item price
void SubtractFromHuna(games myStore[], int *num);
//unrecognized
void Unrecognized();


//main function
int main()
{
	
	games myStore[20];
	int num = 0;
	char choice;

	//present menu & get choice
	DisplayMenu(&choice);
	//hardcode 5
	Hardcodefive(myStore, &num);

	//while loop
	while (choice != 'Q' && choice != 'q')
	{
		//if A
		if (choice == 'A' || choice == 'a')
		{
			//print call add
			addItem(myStore, &num);
		}

		//if else P
		if (choice == 'P' || choice == 'p')
		{
			//print call print
			printCatalog(num,myStore);
		}
		//if else S
		if (choice == 'S' || choice == 's')
		{
			//print call save
			saveToFile(myStore, num);
		}
		//If else C
		if (choice == 'C' || choice == 'c')
		{
			//clear file
			clearList(&num);
		}
		//if else D
		if (choice == 'D' || choice == 'd')
		{
			//delete file
			Delete(myStore, &num);
		}
		//if else F
		if (choice == 'M' || choice == 'm')
		{
			//update the item
			SubtractFromHuna(myStore, &num);
			
		}
		//else unrecognized
		else
		{
			Unrecognized();

		}

		DisplayMenu(&choice);
	}
	return 0;
}
void DisplayMenu(char *choicePtr)
{
		//prompts
		printf("Please select from the options below: \n");
		printf("A - ADD a new entry \n");
		printf("D - DELETE an entry \n");
		printf("P - PRINT entire catalog \n");
		printf("S - SAVE the current catalog \n");
		printf("C - CLEAR the entire catalog \n");
		printf("M - MINUS hundred from item \n");
		printf("Q - QUIT\n");
		printf("Please select an item:\n");

		//2. Get the letter
		scanf(" %c", choicePtr);
}
void Hardcodefive(games myStore[], int *num)
{
	strcpy(myStore[0].title, "Assassins Creed"),
		myStore[0].rating = 'M',
		myStore[0].serial = 201,
		myStore[0].quantity = 10,
		myStore[0].cost = 25.99,
		myStore[0].price = 49.99,
		*num = (*num) + 1;

	strcpy(myStore[1].title, "Mario"),
		myStore[1].rating = 'E',
		myStore[1].serial = 199,
		myStore[1].quantity = 43,
		myStore[1].cost = 19.99,
		myStore[1].price = 39.99,

		*num = (*num) + 1;

	strcpy(myStore[2].title, "Clock Tower"),
		myStore[2].rating = 'M',
		myStore[2].serial = 101,
		myStore[2].quantity = 5,
		myStore[2].cost = 29.99,
		myStore[2].price = 59.99,

		*num = (*num) + 1;

	strcpy(myStore[3].title, "Final Fantasy"),
		myStore[3].rating = 'T',
		myStore[3].serial = 177,
		myStore[3].quantity = 15,
		myStore[3].cost = 29.99,
		myStore[3].price = 69.99,

		*num = (*num) + 1;

	strcpy(myStore[4].title, "Duck Hunt Xtreme"),
		myStore[4].rating = 'T',
		myStore[4].serial = 89,
		myStore[4].quantity = 18,
		myStore[4].cost = 19.99,
		myStore[4].price = 49.99,

		*num = (*num) + 1;
}
void printCatalog(int num, games myStore[])
{
	if (num == 0)
	{
		printf("\n***Catagory is Empty*** \n ");
	}
	else
	{
		for (int i = 0; i < num; i++)
		{
			printf("\n ---Catalog entry %d---\n", i + 1);
			printf("\n Title: %s \n", myStore[i].title);
			printf("\n Rating: %c \n", myStore[i].rating);
			printf("\n Serial #: %d \n", myStore[i].serial);
			printf("\n Quantity: %d \n", myStore[i].quantity);
			printf("\n Cost: $ %.2f\n", myStore[i].cost);
			printf("\n Price: $ %.2f\n", myStore[i].price);
		}

	}
}
void saveToFile(games myStore[], int num)
{
	FILE *outptr;
	int i;
	//outptr = fopen..."w"
	outptr = fopen("Z:\\IntrotoC\\Scotties Store\\readme.txt", "w");

	//for loop
	for (i = 0; i < num; i++)
	{
		fprintf(outptr,"catalog entry %d\n", i + 1);
		fprintf(outptr, "%s\n", myStore[i].title);
		fprintf(outptr, "The rating is %c\n", myStore[i].rating);
		fprintf(outptr, "The quantity is %d\n", myStore[i].quantity);
		fprintf(outptr, "The price is $%.2f\n\n", myStore[i].price);
	}

	//exit out of outptr
	fclose(outptr);

}
void clearList(int *num)
{
	//clearList
	*num = 0;
}
void addItem(games myStore[], int *num)
{
	//enter title
	scanf("%s", myStore[*num].title);

	//prompt
	scanf(" %c", &myStore[*num].rating);
	scanf("%d", &myStore[*num].serial);
	scanf("%d", &myStore[*num].quantity);
	scanf(" %lf", &myStore[*num].cost);
	scanf(" %lf", &myStore[*num].price);

	*num = (*num) + 1;
}
void Delete(games myStore[], int *num)
{
	//present the serial's
	int i;
	int choice;

	for (i = 0; i < *num; i++)
	{
		printf("\n%d\n", myStore[i].serial);
	}

	printf("\n Enter Serial: \n");
	scanf("%d", &choice);

	if (choice == myStore[i].serial)
	{
		choice = i;
	}
	else
	{
		choice = -1;
	}

	//delete it
	*num = *num - 1;
}
void SubtractFromHuna(games myStore[], int *num)
{
	double subtract;
	double choice;
	int i;

	//select item
	for (i = 0; i < *num; i++)
	{
		printf("\n $ %.2f\n", myStore[i].price);
	}

	printf("\n Enter Price: $ \n");
	scanf(" %lf", &choice);

	subtract = 100.00 - choice;

	printf("\nThe difference is $ %.2f\n", subtract);
}
void Unrecognized()
{
	printf("\n System does not recognize. \n");
}