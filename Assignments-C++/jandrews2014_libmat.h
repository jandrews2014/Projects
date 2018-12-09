// Jamie Andrews, 18 April 2015, Lab 09
#ifndef  LIBMAT_H
#define  LIBMAT_H


#include    <iostream>
using namespace std;

class LibMat {
public:
	LibMat();
	virtual ~LibMat();
	virtual void print() const;
};

inline LibMat::LibMat()
{
	cout << "\nLibMat::LibMat() default constructor\n";
}

inline LibMat::~LibMat()
{
	cout << "LibMat::~LibMat() destructor\n";
}

inline void LibMat::print() const
{
	cout << "LibMat::print() -- LibMat object\n";
}
#endif