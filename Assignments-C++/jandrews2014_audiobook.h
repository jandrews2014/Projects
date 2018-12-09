//Jamie Andrews, 18 April 2015, Lab 09
#ifndef  AUDIO_H
#define  AUDIO_H

#include    "book.h"
using namespace std;

class AudioBook : public Book {
public:
	AudioBook(const string &title,
		const string &author,
		const string &narrator);
	virtual ~AudioBook();
	virtual void print() const;
	const string &narrator() const;

protected:
	string _narrator;
};
inline AudioBook::AudioBook(const string &title,
	const string &author,
	const string &narrator)
	: Book(title, author),
	_narrator(narrator)
{
	cout << "AudioBook::AudioBook(" << _title << ", "
		<< _author << ", " << _narrator
		<< ") constructor\n";
}
inline AudioBook::~AudioBook()
{
	cout << "AudioBook::~AudioBook() destructor\n";
}

inline void AudioBook::print() const
{
	cout << "\tAudioBook::print() -- AudioBook object\n"
		<< "\t\ttitle:\t\t" << _title << '\n'
		<< "\t\tauthor:\t\t" << _author << '\n'
		<< "\t\tnarrator:\t" << _narrator << '\n';
}

inline const string &AudioBook::narrator() const
{
	return _narrator;
}

#endif