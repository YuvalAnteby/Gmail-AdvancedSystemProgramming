#pragma once
#include <string>

bool isValidURL(const std::string& url);
bool processLine(const std::string& line);
bool isValidLine(const std::string& line);
void handleUserChoice(const std::string& line);
#pragma once  
#include <string> 
// This function checks if the given URL is valid using a regular expression.
bool isValidURL(const std::string& url);

// This function processes a line and checks if it only contains digits.
bool processLine(const std::string& line);

// This function checks if the line contains only "1" or "2" after the first token.
bool isValidLine(const std::string& line);

// This function handles the user's choice. It validates the URL and either adds it to the system
// or checks if the URL is already present based on the user's command.
void handleUserChoice(const std::string& line);
