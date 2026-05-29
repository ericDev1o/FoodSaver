#!/usr/bin/env bash

# 0 - Parse

# pass exactly 1 argument
 output=$(./tools/FoodSaver.Import.cs foods.csv 2>&1)
 exit_code=$?
 if [ "$exit_code" -eq 0 ] \
    && echo "$output" | grep -q "Importing foods.csv..."; then
    echo "Passed 1 arg test: 
    FoodSaver.Import.cs foods.csv returned 0 (ok) 
    Output contains Importing foods.csv"
 else
    echo "Failed 1 arg test: 
    FoodSaver.Import.cs foods.csv must return 0 (ok), 
    got $exit_code
    
    Output: $output"
fi

# fail - too many args
#./tools/FoodSaver.Import.cs foods.csv extra.csv 2>&1
# expected
# -1
# Usage: ./tools/FoodSaver.Import.cs <file-path>

# fail - no arg
# ./tools/FoodSaver.Import.cs 2>&1
# expected
# -1
# Usage: ./tools/FoodSaver.Import.cs <file-path>