#!/usr/bin/env bash

source ./tools/tests/FoodSaver.Import.Tests/test-utils.sh

echo "
********** 1 - Validate file existence **********"

echo "
***** 1 - 1/2 - must pass - file exists *****"
output=$(./tools/FoodSaver.Import.cs ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.valid.csv 2>&1)
exit_code=$?
if [ "$exit_code" -eq 0 ] \
   && echo "$output" | grep -q "Found file:"; then
   
   passed "file exists test:

      FoodSaver.Import.cs foods.csv ok
      expected exit_code=0, got $exit_code

      Output contains Found file"
else
   failed "file exists test: 

      FoodSaver.Import.cs foods.csv ko
      expected exit_code=0, got $exit_code
    
      Output: $output"
fi

echo "
***** 1 - 2/2 - must fail - no file *****"
output=$(./tools/FoodSaver.Import.cs ./missing.csv 2>&1)
exit_code=$?
if [ "$exit_code" -eq 1 ] \
   && echo "$output" | grep -q "Input file not found: ./missing.csv"; then
   passed "no file test: 

      FoodSaver.Import.cs missing.csv ok
      expected exit_code=1, got $exit_code

      Output contains Input file not found"
else
   failed "no file test: 

      FoodSaver.Import.cs missing.csv ko
      expected exit_code=1, got $exit_code
    
      Output: $output"
fi