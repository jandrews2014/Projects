//Jamie Andrews, 18 April 2015, Lab 09
#ifndef  MAG_H
#define  MAG_H

#include    "audiobook.h"
#include    "libmat.h"
#include    "book.h"

using namespace std;
//class 
class Magazine : public LibMat {
public:
	Magazine(const string &title, const string &editor);
	virtual ~Magazine(); 
	virtual void print() const;

	friend ostream &operator <<(ostream & output, const Magazine & Org);
	
	const string &title() const; 
	const string &editor() const;

private: //not protected
	string _title;  
	string _editor;

};
inline Magazine:: Magazine(const string &title,
	const string &editor)
	: _title(title), _editor(editor) // print out constructor
{
	cout << "Magazine::Magazine(" << _title << ", "
		<< _editor << ") constructor\n";
}
//Destructor
inline Magazine::~Magazine()
{
	cout << "Magazine::~Magazine() destructor\n";
}
//Print Commannd
inline void Magazine::print() const
{
	cout << "Magazine::print() -- Magazine object\n"
		<< "\ttitle:\t" << _title << '\n' 
		<< "\teditor:\t" << _editor << '\n';
}
inline const string &Magazine::title() const
{
	return _title;
}

inline const string &Magazine::editor() const
{
	return _editor;
}
ostream &operator <<(ostream &out, const Magazine &magazine) //left shift operator
{
	out << magazine._title << '\t' << magazine._editor << '\n';
	out << "Magazine::print() -- Magazine object\n"
		<< "\ttitle:\t" << magazine._title << '\n' 
		<< "\teditor:\t" << magazine._editor << '\n';

	return out;
}
#endif