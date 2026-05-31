#!/usr/bin/env bash

set -eu

./tools/tests/FoodSaver.Import.Tests/steps/FoodSaver.Import.Test.0.parse_arg
./tools/tests/FoodSaver.Import.Tests/steps/FoodSaver.Import.Test.1.file_exists.sh
./tools/tests/FoodSaver.Import.Tests/steps/FoodSaver.Import.Test.2.parse_file.sh
./tools/tests/FoodSaver.Import.Tests/steps/FoodSaver.Import.Test.3.validate_data.sh
./tools/tests/FoodSaver.Import.Tests/steps/FoodSaver.Import.Test.4.dry_run.sh
./tools/tests/FoodSaver.Import.Tests/steps/FoodSaver.Import.Test.5.api_import.sh
./tools/tests/FoodSaver.Import.Tests/steps/FoodSaver.Import.Test.6.api_base_url.sh
./tools/tests/FoodSaver.Import.Tests/steps/FoodSaver.Import.Test.7.summary.sh