#!/usr/bin/env bash

source ./tools/tests/FoodSaver.Import.Tests/test-utils.sh

echo "
********** 2 - Parse file **********"

echo "
***** 2 - 1/2 - must pass - valid file parsed *****"
output=$(./tools/FoodSaver.Import.cs ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.valid.csv 2>&1)
exit_code=$?
if [ "$exit_code" -eq 0 ] \
   && echo "$output" | grep -q "Parsed file:"; then
   
   passed "parse valid file test:

      FoodSaver.Import.cs foods.valid.csv ok
      Expected exit_code=0, got $exit_code

      Output contains Parsed file"
else
   failed "parse valid file test: 

      FoodSaver.Import.cs foods.valid.csv ko
      Expected exit_code=0, got $exit_code
    
      Output: $output"
fi

echo "
***** 2 - 2/2 - must fail - invalid file parse error *****"
output=$(./tools/FoodSaver.Import.cs ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.invalid.csv 2>&1)
exit_code=$?
if [ "$exit_code" -eq 1 ] \
   && echo "$output" | grep -q "Parse error: invalid file"; then
   passed "parse invalid file test: 

      FoodSaver.Import.cs foods.invalid.csv ok
      Expected exit_code=1, got $exit_code

      Output contains Parse error: invalid file"
else
   failed "parse invalid file test: 

      FoodSaver.Import.cs foods.invalid.csv ko
      Expected exit_code=1, got $exit_code
    
      Output: $output"
fi