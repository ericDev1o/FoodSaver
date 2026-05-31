#!/usr/bin/env bash

source ./tools/tests/FoodSaver.Import.Tests/test-utils.sh

echo "
********** 4 - Dry run **********"

echo "
***** 4 - 1/1 - must pass - preview imported foods *****"

output=$(./tools/FoodSaver.Import.cs ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.valid.csv --dry-run 2>&1)

if echo "$output" | grep -q "Dry run: no data imported" \
   && echo "$output" | grep -q "Would import"; then

   passed "dry run test:

      FoodSaver.Import.cs foods.valid.csv --dry-run ok
      Expected output contains dry run preview and Would import,

      got $output"
else

   failed "dry run test:

      FoodSaver.Import.cs foods.valid.csv --dry-run ko
      Expected output contains dry run preview and Would import,
      
      got output: $output"

fi