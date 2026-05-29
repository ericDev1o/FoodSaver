#!/usr/bin/dotnet run

Console.WriteLine("FoodSaver import tool");

/**
 * 0 - Parse arg
 */
if (args.Length != 1)
{
    Console.WriteLine("Usage: ./tools/FoodSaver.Import.cs <file-path>");
    Environment.Exit(-1);
}

string filePath = args[0];

Console.WriteLine($"Importing {filePath}...");

/**
 * feat(import): validate input file existence
 */
/*if(File.Exists(filePath)){
    // Importing foods.csv... 
} else {
    // Input file not found: missing.csv
    // Usage: FoodSaver.Import <file-path>
    // exit(-1)
}*/

/**
 * feat(import): add csv parsing
 * implementation:
 *  open file
 *  skip header
 *  parse lines
 *  build temorary DTO
 * fixture: foods.valid.csv 
 */
/*
record FoodImport(
    string Name,
    int Quantity,
    DateOnly ExpiryDate);
    */
// Parsed 2 food items

/**
 * feat(import): validate imported food data
 * rules:
 *  name required
 *  quantity > 0
 *  expiryDate valide
 * fixture: foods.invalid.csv
 */
// 3 invalid rows detected
/* 
Line 2: quantity must be positive
Line 3: name is required
Line 4: invalid expiry date
*/

/**
 * feat(import): add --dry-run mode
 * behavior:
 *  parse
 *  validate
 *  display what would've been created
 * no POST
 */
 /*
 Dry run enabled

✔ Milk (2) -> 2026-06-01
✔ Eggs (12) -> 2026-06-05

2 items ready for import
*/

/**
 * feat(import): add api food import integration
 * implementation:
 *  HttpClient
 *  loop on foods
 *  POST /foods
 */
/*
✔ Milk imported
✔ Eggs imported
*/
// dotnet run --project src/FoodSaver.Api
// ./tools/FoodSaver.Import.cs ./tools/tests/FoodSaver.Import.Tests/fixtures/foods.valid.csv
// curl http://localhost:xxxx/foods

/**
 * feat(import): add configurable api base url
 */
// Usage: ./tools/FoodSaver.Import.cs foods.csv \
// --base-url https://foodsaver-api.onrender.com // http://localhost:5050
// FOODSAVER_API_URL=http://localhost:5050 ./tools/FoodSaver.Import.cs foods.csv

/**
 * chore(import): improve import logging and summary output
 */
/*
Import started

✔ Milk imported
✔ Eggs imported
✖ Cheese skipped: invalid expiry date

Summary
-------
Imported: 2
Skipped: 1
Failed: 0
*/

/**
 * docs(import): add usage examples for file-based import tool
 * README ou /docs/import.md
 * # Run

 * ./tools/FoodSaver.Import.cs foods.csv
 
 * # Dry run

 * ./tools/FoodSaver.Import.cs foods.csv --dry-run 

 * # Custom API

 * ./tools/FoodSaver.Import.cs foods.csv \
 *  --base-url http://localhost:5050
 */