#include    <iostream>
#include    <iomanip>
#include    <string>
using namespace std;

#include    "Node.h"


Node *add_node( Node *list, const string &s )
{
    struct Node *n = new struct Node;
    n->word = s;            // copy string s to word
    n->next = list;

	// add node n to the list 
	list = n;
	// the list should always be in ascending alphabetical order

	

    return list;            // returning pointer to beginning of the list
}


Node *del_node( Node *list, const string &s )
{
	// delete node in the list that contains s
	// the list should always be in ascending alphabetical order

	// if s does not appear in the list, there is nothing to do
	// if s appears multiple times in the list, delete the first occurrence

	Node *lastp = 0;
    Node *p = list;
    for (; p; p = p->next)
    {
        if (p->word == s)
        {
            lastp->next = p->next;
            delete p;
            break;
        }
        lastp = p;
	}

    return list;            // returning pointer to beginning of the list
}


void deallocate( Node *list )
{
    for( struct Node *p = list; p; )
    {
        struct Node *tmp = p;   // remember current pointer

        p = p->next;            // advance p to the next node

        delete tmp;             // deallocate tmp

                                // OK to print pointers tmp and p
        cout << "deallocated\t" << tmp << "\tnext is\t" << p << '\n';

                                // problem: accessing deleted area...
        cout << "deallocated\t" << tmp << "\tcontaining\t" << tmp->word
             << "\tnext is\t" << p << '\n';
    }
}


void print( Node *list )
{
    for( struct Node *p = list; p; p = p->next )
    {
        cout << p << '\t' << setw( 8 ) << p->word
             << '\t' << "next:" << '\t' << p->next << '\n';
    }
}

