#!/usr/bin/env bash

source ./tools/tests/FoodSaver.Import.Tests/test-utils.sh

echo "
********** 5 - Import into API **********"

echo "
***** 5 - 1/1 - must pass - import valid foods *****"

# FoodSaver.Api must already be running
# dotnet run src/FoodSaver.Api

output=$(./tools/FoodSaver.Import.cs \
  ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.valid.csv \
  2>&1)

exit_code=$?

if [ "$exit_code" -eq 0 ] \
   && echo "$output" | grep -q "Import started" \
   && echo "$output" | grep -q "Summary" \
   && echo "$output" | grep -q "Imported: 2"; then

   passed "API import test:

      FoodSaver.Import.cs foods.valid.csv ok
      Expected exit_code=0, got $exit_code

      Output must contain Import started, Summary and Imported: 2,
      got $output"
else
   failed "API import test:

      FoodSaver.Import.cs foods.valid.csv ko
      Expected exit_code=0, got $exit_code

      Output: $output"
fi