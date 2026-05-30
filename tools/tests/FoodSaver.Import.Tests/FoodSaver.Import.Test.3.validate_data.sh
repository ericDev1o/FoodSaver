#!/usr/bin/env bash

source ./tools/tests/FoodSaver.Import.Tests/test-utils.sh

echo "
********** 3 - Validate imported data **********"

echo "
***** 3 - 1/2 - must pass - valid data *****"
output=$(./tools/FoodSaver.Import.cs ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.valid.csv 2>&1)
exit_code=$?
if [ "$exit_code" -eq 0 ] \
   && echo "$output" | grep -q "Data is valid"; then
   
   passed "validate data test:

      FoodSaver.Import.cs foods.valid.csv ok
      Expected exit_code=0, got $exit_code

      Output contains Data is valid"
else
   failed "validate data test: 

      FoodSaver.Import.cs foods.valid.csv ko
      Expected exit_code=0, got $exit_code
    
      Output: $output"
fi

echo "
***** 3 - 2/2 - must fail - invalid data *****"
output=$(./tools/FoodSaver.Import.cs ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.invalid.csv 2>&1)
exit_code=$?
if [ "$exit_code" -eq 1 ] \
   && echo "$output" | grep -q "invalid rows detected"; then
   passed "invalid data test: 

      FoodSaver.Import.cs foods.invalid.csv ok
      Expected exit_code=1, got $exit_code

      Output contains invalid rows detected,
      got $output"
else
   failed "invalid data test: 

      FoodSaver.Import.cs foods.invalid.csv ko
      Expected exit_code=1, got $exit_code
    
      Output: $output"
fi