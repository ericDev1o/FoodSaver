#!/usr/bin/env bash
#
# Check and if needed make the tool executable
# Choose your DX 1, 2, 3 or 4:
#
# 1
# if [ ! test -x tools/FoodSaver.Import.cs ]; then
#  chmod +x tools/FoodSaver.Import.cs
# fi
#
# 2
# if [ ! -x tools/FoodSaver.Import.cs ]; then
#  chmod +x tools/FoodSaver.Import.cs
# fi
#
# 3
# chmod +x tools/FoodSaver.Import.cs 2>/dev/null || true
#
# 4
[ -x tools/FoodSaver.Import.cs ] || chmod +x ./tools/FoodSaver.Import.cs