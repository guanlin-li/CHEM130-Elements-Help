#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
#include <fstream>

using namespace std;

auto main() -> int {   
    vector<pair<string, string>> v;
    v.reserve(45);
    pair<string, string> t;
    fstream ifs;
    ifs.open("input.txt");
    while (ifs >> t.first >> t.second) {
        v.push_back(t);
    }
    auto rng = default_random_engine {};
    shuffle(v.begin(), v.end(), rng);
    vector<pair<string, string>> wrong;
    size_t numWrong = 0;
    cout << "Enter E to name abbreviation, N to name their names: ";
    char c;
    cin >> c;
    if (c == 'E') {
        for (size_t i = 0; i < v.size(); ++i) {
            cout << "\n" << v[i].second << ": ";
            string temp;
            cin >> temp;
            if (temp != v[i].first) {
                cout <<  "\nIncorrect (" << v[i].first << ")\n\n";
                ++numWrong;
                wrong.push_back(v[i]);
            }
        }
    }
    else {
        for (size_t i = 0; i < v.size(); ++i) {
            cout << "\n" << v[i].first << ": ";
            string temp;
            cin >> temp;
            if (temp != v[i].first) {
                cout <<  "\nIncorrect (" << v[i].second << ")\n";
                ++numWrong;
                wrong.push_back(v[i]);
            }
        }        
    }

    cout << "\nACCURACY: " << double(v.size() - numWrong) / double(v.size()) << endl;
    cout << "WRONG: " << endl;
    for (auto it = wrong.begin(); it != wrong.end(); ++it) {
        cout << (it->second) << " (" << it->first << ")" << endl;
    }
    return 0;
}