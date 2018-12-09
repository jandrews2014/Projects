
#include    "List.h"


// methods for Node

// constructor: init. a Node
Node::Node(const string &s, Node * const n, Node * const p)
{
	word = s;               // init. word with a copy of s
	next = n;               // next points to next     node n
	prev = p;               // prev points to previous node p

	if (n)                 // is there a next node?
	{
		n->prev = this;
	}

	if (p)                 // is there a previous node?
	{
		p->next = this;
	}
}

// return a const ref to word
const string &Node::get_word() const
{
	return word;
}

// return a pointer to next node
Node *Node::get_next() const
{
	return next;
}

// return a pointer to previous node
Node *Node::get_prev() const
{
	return prev;
}

// set and return a pointer to next node
Node *Node::set_next(Node *n)
{
	next = n;
	return next;
}

// set and return a pointer to previous node
Node *Node::set_prev(Node *p)
{
	prev = p;
	return prev;
}






// methods for List

List::List()               // constructor: init. head and tail
{
	cout << "List::List( )\n";

	head = tail = 0;
}


List::~List()              // destructor: deallocate the list
{
	cout << "List::~List( )\n";

	for (Node *p = head; p;)
	{
		Node *tmp = p;      // remember current pointer
		p = p->get_next(); // advance p to the next Node
		delete tmp;         // deallocate tmp
		cout << "deallocated\t" << tmp << "\tnext is\t" << p << '\n';
	}
}


void List::insert(const string &s)
{
	// replace the call to push_back( s ) with your code to insert
	// s in the doubly-linked list in alphabetical order

	//push_back(s);
	Node *p;

	Node *n = new Node(s,0,0);

	{
		if(tail == 0 && head == 0)
		{
			head = tail = n;
		}
	
	}

	for(Node *p = head; p; p->get_next())
	{
		if(n->get_word() > p->get_word()&& p->get_next()== NULL)
		{
			n->set_next(p);
			n->set_prev(p);
			tail = n;
			n->set_next(NULL);
		}
		if(n->get_word() > p->get_word()&& p->get_prev()== NULL)
		{
			n->set_prev(p);
			n->set_next(p);
			head = n;
			n->set_prev(NULL);
		}
		if(n->get_word() < p->get_word())
		{
			n->set_prev(p);
			n->set_next(n);
			//p->set_next(p->get_word());
			n->set_next(p);
			n->set_prev(n);
		}
	}

}


void List::push_back(const string &s)
{
	// n points to a new node
	Node *n = new Node(s, 0, tail);

	if (tail == 0)         // tail not pointing to a node yet?
	{
		head = tail = n;    // head and tail point to new node in the list
	}
	else
	{                       // tail->next points to new node
		tail->set_next(n);
		tail = n;           // tail points to last node in the list
	}
}


void List::push_front(const string &s)
{
	// n points to a new node
	Node *n = new Node(s, head, 0);

	if (head == 0)         // head not pointing to a node yet?
	{
		head = tail = n;    // head and tail point to new node in the list
	}
	else
	{                       // head->prev points to new node
		head->set_prev(n);
		head = n;           // head points to first node in the list
	}
}


void List::remove(const string &s)
{

	for (Node *p = head; p; p = p->get_next())
	{
		if (p->get_word() == s)
		{
			Node *tmp;
			tmp = p->get_prev();

			if (tmp)       // is there a prev node?
			{
				tmp->set_next(p->get_next());
			}
			else            // at the beginning of the list
			{
				head = p->get_next();
			}

			tmp = p->get_next();
			if (tmp)       // is there a next node?
			{
				tmp->set_prev(p->get_prev());
			}
			else            // at the end of the list
			{
				tail = p->get_prev();
			}

			delete p;       // deallocate the node containing s

			break;          // terminate loop after finding first occurrence of s
		}
	}
}


ostream &operator <<(ostream &out, const List &list)
{
	for (Node *p = list.head; p; p = p->get_next())
	{
		cout << p << '\t' << setw(8) << p->get_word()
			<< '\t' << "next:" << '\t' << p->get_next() << '\n';
	}

	return out;
}
