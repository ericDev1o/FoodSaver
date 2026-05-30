#!/usr/bin/env bash

source ./tools/tests/FoodSaver.Import.Tests/test-utils.sh

echo "
********** Testing FoodSaver.Import.cs... **********"

echo "
********** 0 - Parse **********"

echo "
***** 0 - 1/3 - must pass - exactly 1 argument *****"
output=$(./tools/FoodSaver.Import.cs foods.csv 2>&1)
exit_code=$?
if echo "$output" | grep -q "Importing foods.csv..."; then
   
   passed "1 arg test:

      FoodSaver.Import.cs foods.csv ok
      Expected output contains Importing ,
      
      got $output"
else
   failed "1 arg test: 

      FoodSaver.Import.cs foods.csv ko
      Expected output contains Importing,
    
      got $output"
fi

echo "
***** 0 - 2/3 - must fail - too many args *****"
output=$(./tools/FoodSaver.Import.cs foods.csv extra.csv 2>&1)
exit_code=$?
if [ "$exit_code" -eq 1 ] \
   && echo "$output" | grep -q "Usage: 
   ./tools/FoodSaver.Import.cs <file-path>"; then
   passed "too many args test: 

      FoodSaver.Import.cs foods.csv extra.csv ok
      Expected exit_code=1, got $exit_code

      Output contains Usage: ./tools/FoodSaver.Import.cs <file-path>"
else
   failed "too many args test: 

      FoodSaver.Import.cs foods.csv extra.csv ko
      Expected exit_code=1, got $exit_code
    
      Output: $output"
fi

echo "
***** 0 - 3/3 - must fail - no arg *****"
output=$(./tools/FoodSaver.Import.cs 2>&1)
exit_code=$?
if [ "$exit_code" -eq 1 ] \
   && echo "$output" | grep -q "Usage: 
   ./tools/FoodSaver.Import.cs <file-path>"; then
   passed "no arg test: 
   
      FoodSaver.Import.cs ok
      Expected exit_code=1, got $exit_code

      Output contains Usage: ./tools/FoodSaver.Import.cs <file-path>"
else
   failed "no arg test: 
   
      FoodSaver.Import.cs ko
      Expected exit_code=1, got $exit_code
    
      Output: $output"
fi