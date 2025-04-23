// Author(s): Dor Darmon, Yuval Anteby
#ifndef INPUT_VALIDATION_H
#define INPUT_VALIDATION_H

bool processLine(const std::string& line);
bool isValidURL(const std::string& url);
bool containsOnlyDigitsAndWhitespace(const std::string& line);
bool hasValidCommandStructure(const std::string& line);
bool isValidLine(const std::string& line);

#endif