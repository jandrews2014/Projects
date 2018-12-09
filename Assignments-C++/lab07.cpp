#include    "List.h"

int main()
{
	List list;                  // create an object list of type List

	cout << "please enter a few words (xxx to terminate list):\n";

	string s;                   // s is a string object

	while (cin >> s)           // read a string into s
	{
		if (s == "xxx")
		{
			break;              // terminate loop when string is equal to "xxx"
		}

		list.insert(s);       // add s to list in alphabetical order

		cout << "\nlist:\n" << list << '\n';
	}

	cout << "\nhere is the list:\n" << list << '\n';

	cout << "please enter word words to delete from the list (xxx to terminate):\n";

	while (cin >> s)
	{
		if (s == "xxx")
		{
			break;              // terminate loop when string is equal to "xxx"
		}

		list.remove(s);       // remove first node containing string s, if any

		cout << "\nlist:\n" << list << '\n';
	}

	cout << "\nthe final list:\n" << list << '\n';

	return 0;
}
