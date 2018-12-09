//Jamie Andrews, 18 April 2015, Lab 09
#ifndef     BOOK_H
#define     BOOK_H

#include    <iomanip>
#include    <iostream>
#include	<cstring>					
#include	<string>
#include    "libmat.h"

class Book : public LibMat {
public:
	Book(const string &title,
		const string &author);
	virtual ~Book();
	virtual void print() const;
	const string &title() const;
	const string &author() const;

protected:
	string _title;
	string _author;
};

inline Book::Book(const string &title,
	const string &author)
	: _title(title), _author(author)
{
	cout << "Book::Book(" << _title << ", "
		<< _author << ") constructor\n";
}

inline Book::~Book()
{
	cout << "Book::~Book() destructor\n";
}

inline void Book::print() const
{
	cout << "Book::print() -- Book object\n"
		<< "\ttitle:\t" << _title << '\n'
		<< "\tauthor:\t" << _author << '\n';
}

inline const string &Book::title() const
{
	return _title;
}

inline const string &Book::author() const
{
	return _author;
}

#endif