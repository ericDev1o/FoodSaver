#!/usr/bin/env bash

source ./tools/tests/FoodSaver.Import.Tests/test-utils.sh

echo "
********** 3 - Validate imported data **********"

echo "
***** 3 - 1/3 - must pass - valid data *****"
output=$(./tools/FoodSaver.Import.cs ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.valid.csv 2>&1)

if echo "$output" | grep -q "Data is 100% valid"; then
   
   passed "validate data test:

      FoodSaver.Import.cs foods.valid.csv ok
      Expected output contains Data is 100% valid,

      got $output"
else
   failed "validate data test: 

      FoodSaver.Import.cs foods.valid.csv ko
      Expected output contains Data is 100% valid,
    
      got Output: $output"
fi

echo "
***** 3 - 2/3 - must fail - invalid data *****"
output=$(./tools/FoodSaver.Import.cs ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.invalid.csv 2>&1)
exit_code=$?

if [ "$exit_code" -eq 1 ] \
   && echo "$output" | grep -q "4 data validation errors detected" \
   && echo "$output" | grep -q "No valid row to import."; then
   passed "invalid data test: 

      FoodSaver.Import.cs foods.invalid.csv ok
      Expected exit_code=1, got $exit_code

      Output must contain data validation errors detected and 
      No valid row to import.,
      got $output"
else
   failed "invalid data test: 

      FoodSaver.Import.cs foods.invalid.csv ko
      Expected exit_code=1, got $exit_code
    
      Output: $output"
fi

echo "
***** 3 - 3/3 - must pass - mixed valid and invalid data *****"

output=$(
  ./tools/FoodSaver.Import.cs \
    ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.mixed.csv \
    2>&1
)
exit_code=$?

if [ "$exit_code" -eq 0 ] \
   && echo "$output" | grep -q "3 data validation errors detected" \
   && echo "$output" | grep -q "Line 2: quantity must be a valid integer." \
   && echo "$output" | grep -q "Line 3: quantity must be positive." \
   && echo "$output" | grep -q "Line 4: expiryDate must be a valid date."; then

   passed "mixed data validation test:

      FoodSaver.Import.cs foods.mixed.csv ok
      Expected exit_code=0, got $exit_code

      Output must contain data validation errors detected and

      Line 3: expiryDate must be a valid date.,
      got $output"
else
   failed "mixed data validation test:

      FoodSaver.Import.cs foods.mixed.csv ko
      Expected exit_code=0, got $exit_code

      Output: $output"
fi