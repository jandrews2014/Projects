//code by Jamie Andrews
#include<iostream>
#include<vector>
#include<chrono>

using namespace std;
using namespace std::chrono;

//Insertion Sort: Algorithm 1
void insertSort(vector<int>&A)
{

	int i, key, j;

	for (i = 0; i < A.size(); i++)
	{
		key = A[i];
		j = i - 1;

		while (j >= 0 && A[j] > key)
		{
			A[j + 1] = A[j];
			j = j - 1;
		}
		A[j + 1] = key;
	}
}



//First subarray is A[p..q]
//Second subarray is A[q+1..r]
void merge(vector<int>&A, int a, int b, int c)
{
	int i;
	int j;
	int k;

	int n1 = b - a + 1;
	int n2 = c - b;

	//setup two temp arrays
	vector<int>L;
	vector<int>R;

	for (i = 0; i < n1; i++)
	{
		L.push_back(A[a + i]);
	}
	for (j = 0; j < n2; j++)
	{
		R.push_back(A[b + j + 1]);
	}

	L.push_back(INT_MAX);
	R.push_back(INT_MAX);
	i = j = 0;

	for (k = a; k <= c; k++)
	{
		if (L[i] <= R[j])
		{
			A[k] = L[i];
			i = i + 1;
		}
		else
		{
			A[k] = R[j];
			j = j + 1;
		}
	}
}

// Merge Sort: Algorithm 2
void mergeSort(vector<int>&A, int a, int c)
{
	if (a < c)
	{
		int b = (a + c) / 2;

		mergeSort(A, a, b);
		mergeSort(A, b + 1, c);
		merge(A, a, b, c);
	}
}

//the exchange function
void swap(int* x, int* y)
{
	int i = *x;
	*x = *y;
	*y = i;
}

//the partition function
int partition(vector<int>&A, int a, int c)
{
	int i;

	//pivot between both sides
	int pivot = A[c];

	//index of smallest elem
	i = (a - 1);

	for (int j = a; j <= c - 1; j++)
	{
		if (A[j] <= pivot)
		{
			i++;
			swap(A[i], A[j]);
		}
	}
	swap(A[i + 1], A[c]);
	return (i + 1);
}

//p = starting index, left side
//r = ending index, right side
//Quick Sort: Algorithm 3
void quickSort(vector<int>&A, int a, int c)
{
	if (a < c)
	{
		//q is the pivoting index
		int b = partition(A, a, c);

		quickSort(A, a, b - 1);
		quickSort(A, b + 1, c);
	}
}


//fill vector array with random elements
vector<int>fillArray(int n)
{
	vector<int>A;
	srand(time(NULL));

	for (int i = 0; i < n; i++)
	{
		A.push_back(rand() % RAND_MAX);
	}
	return A;
}

int main()
{
	vector<vector<int>>vectArr;

	duration<double, milli> clock; // total time in milliseconds
	high_resolution_clock::time_point tick; // start timer
	high_resolution_clock::time_point tock; //end timer


	for (int i = 5000; i <= 100000; i += 5000)
	{
		vectArr.push_back(fillArray(i));
	}


	for (int i = 0; i < vectArr.size(); i++)
	{
		tick = high_resolution_clock::now();
		//start timer

		//insertSort(vectArr[i]);
		mergeSort(vectArr[i], 0, vectArr[i].size() - 1);
		//quickSort(vectArr[i], 0, vectArr[i].size() - 1);

		tock = high_resolution_clock::now();
		//end timer
		clock = tock - tick;

		cout << "Run Time: " << clock.count() << " ms" << "  | Cycle " << i + 1 << endl;
	}
	return 0;
}
