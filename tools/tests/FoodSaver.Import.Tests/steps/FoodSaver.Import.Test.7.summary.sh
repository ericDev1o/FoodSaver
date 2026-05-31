#!/usr/bin/env bash

source ./tools/tests/FoodSaver.Import.Tests/test-utils.sh

echo "
********** 7 - Import summary skipped output **********"

echo "
***** 7 - 1/1 - must pass - import summary skipped *****"

output=$(
  ./tools/FoodSaver.Import.cs \
    ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.mixed.csv \
    2>&1
)

exit_code=$?

if [ "$exit_code" -eq 0 ] \
   && echo "$output" | grep -q "✖ Line 2: quantity must be a valid integer." \
   && echo "$output" | grep -q "✖ Line 3: quantity must be positive." \
   && echo "$output" | grep -q "✖ Line 4: expiryDate must be a valid date" \
   && echo "$output" | grep -q "Import started" \
   && echo "$output" | grep -q "✔ Cheese x4 imported" \
   && echo "$output" | grep -q "Summary" \
   && echo "$output" | grep -q "Imported: 1" \
   && echo "$output" | grep -q "Skipped: 3"; then

   passed "summary output test:

      FoodSaver.Import.cs foods.invalid.csv ok
      Expected exit_code=0, got $exit_code

      Output must contain :
         ✖ Line 2: quantity must be a valid integer.
         ✖ Line 3: quantity must be positive.
         ✖ Line 4: expiryDate must be a valid date.
         Import started
         ✔ Cheese x4 imported

         Summary
         -------
         Imported: 1
         Skipped: 3,
      got $output"
else
   failed "summary output test:

      FoodSaver.Import.cs foods.invalid.csv ko
      Expected exit_code=0, got $exit_code

      Output: $output"
fi