#include    <iostream>
#include    <iomanip>
#include    <string>
using namespace std;


class Node
{
public:
	// constructor
	Node(const string &, Node * const, Node * const);

	const string &get_word() const;// get a const reference to word

	Node    *get_next() const;     // get a pointer to next     node
	Node    *get_prev() const;     // get a pointer to previous node

	Node    *set_next(Node *);    // set next pointer
	Node    *set_prev(Node *);    // set prev pointer

private:
	string   word;
	Node    *next;                  // pointer to the next     node
	Node    *prev;                  // pointer to the previous node

	// do not generate defautl copy ctor
	Node(const Node &);
	// do not generate default copy assign. oper.
	const Node &operator =(const Node &);
};


class List
{
public:
	List();                        // constructor
	~List();                       // destructor

	// push a node to the back of list
	void push_back(const string &);
	// push a node to the front of list
	void push_front(const string &);

	void insert(const string &);  // insert a node in alphabetical order
	void remove(const string &);  // remove a node containing string

	// output a list object
	friend ostream &operator <<(ostream &, const List &);

private:
	Node    *head;
	Node    *tail;
	// do not generate a default copy ctor
	List(const Node &);
	// do not generate default copy assign. oper.
	const List &operator =(const List &);
};

