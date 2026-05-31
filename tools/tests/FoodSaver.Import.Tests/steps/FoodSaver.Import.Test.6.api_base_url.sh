#!/usr/bin/env bash

source ./tools/tests/FoodSaver.Import.Tests/test-utils.sh

echo "
********** 6 - Configurable API base URL **********"

echo "
***** 6 - 1/2 - must pass - custom base url *****"

output=$(
  ./tools/FoodSaver.Import.cs \
    ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.valid.csv \
    --dry-run \
    --base-url https://foodsaver-api-00tb.onrender.com 2>&1
)

exit_code=$?

if [ "$exit_code" -eq 0 ] \
   && echo "$output" | grep -q \
      "baseUrl: https://foodsaver-api-00tb.onrender.com"; then

   passed "custom base url test:

      --base-url overrides env/default

      Expected exit_code=0, got $exit_code

      Output must contain baseUrl: https://foodsaver-api-00tb.onrender.com,
      got $output"
else
   failed "custom base url test:

      Expected exit_code=0, got $exit_code

      Output: $output"
fi


echo "
***** 6 - 2/2 - must pass - fallback to env *****"

output=$(
  FOODSAVER_API_URL=http://localhost:8080 \
  ./tools/FoodSaver.Import.cs \
    ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.valid.csv \
    --dry-run 2>&1
)

exit_code=$?

if [ "$exit_code" -eq 0 ] \
   && echo "$output" | grep -q \
      "baseUrl: http://localhost:8080"; then

   passed "env base url test:

      FOODSAVER_API_URL used

      Expected exit_code=0, got $exit_code
      
      Output must contain baseUrl: http://localhost:8080,
      got $output"
else
   failed "env base url test:

      Expected exit_code=0, got $exit_code

      Output: $output"
fi