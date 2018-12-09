
#include    <iostream>
#include    <iomanip>
#include    <string>
using namespace std;

#include    "Node.h"
#include    "funcs.h"

int main( )
{
    struct Node *list = 0;      // list is a pointer to struct Node

    cout << "please enter a few words (xxx to terminate list):\n";

    string s;                   // s is a string object

    while( cin >> s )           // read a string into s
    {
        if( s == "xxx" )
        {
            break;              // terminate loop when string is equal to "xxx"
        }
                                // add s to list in alphabetical order
        list = add_node( list, s );

        cout << "\nlist:\n";
        print( list );
        cout << '\n';
    }

    cout << "\nhere is the list:\n";
    print( list );
    cout << '\n';

    cout << "please enter word words to delete from the list (xxx to terminate):\n";
    while( cin >> s )
    {
        if( s == "xxx" )
        {
            break;              // terminate loop when string is equal to "xxx"
        }
                                // delete first node containing string s
        list = del_node( list, s );

        cout << "\nlist:\n";
        print( list );
        cout << '\n';
    }

    cout << "\nthe final list:\n";
    print( list );
    cout << '\n';
                                // deallocate the linked list
    cout << "\ndeallocating the list:\n";
    deallocate( list );

    cout << "\nall done!\n";
    return 0;
}

