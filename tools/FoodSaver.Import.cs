#!/usr/bin/env -S dotnet run

Console.WriteLine("FoodSaver import tool");

/**
 * 0 - Parse arg
 */
if (args.Length != 1)
{
    Console.WriteLine("Usage: ./tools/FoodSaver.Import.cs <file-path>");
    Environment.Exit(1);
}

string filePath = args[0];
Console.WriteLine($"Importing {filePath}...");

/**
 * 1 - Validate input file existence
 */
if(File.Exists(filePath))
    Console.WriteLine($"Found file: {filePath}");
else {
    Console.WriteLine($"Error: Input file not found: {filePath}");
    Console.WriteLine("Usage: ./tools/FoodSaver.Import.cs <file-path>");
    Environment.Exit(1);
}

/**
 * 2 - Parse file
 */
List<(
    string Name,
    string RawQuantity,
    string RawExpiryDate,
    int LineNumber
)> foods = [];
try
{
    foods = 
    [
        .. File
        .ReadLines(filePath)
        .Skip(1)
        .Select((line, index) =>
        {
            string[] columns = line.Split(',');

            if(columns.Length != 3)
                throw new FormatException("A food must have 3 informations: name, quantity and expiry date.");

            int lineNumber = index + 2; // +1 header +1 index base 0

            return (
                Name: columns[0].Trim(),
                Quantity: columns[1].Trim(),
                RawExpiryDate: columns[2].Trim(),
                LineNumber: index + 2
            );
        })
    ];
   
    string suffix = foods.Count == 1 ? string.Empty : "s";
    Console.WriteLine($"Parsed file: {filePath}");
    Console.WriteLine($"Parsed {foods.Count} food item{suffix}");
} catch (Exception ex)
{
    Console.WriteLine("Parse error: invalid file");
    Console.WriteLine(ex.Message);
    Environment.Exit(1);
}

/**
 * 3 - Validate imported food data
 */
List<string> errors = [];

foreach (var (Name, RawQuantity, RawExpiryDate, LineNumber) in foods)
{
    if(string.IsNullOrWhiteSpace(Name))
        errors.Add($"Line {LineNumber}: name is required");

    if(! int.TryParse(RawQuantity, out int quantity))
        errors.Add($"Line {LineNumber}: Quantity must be a valid integer.");
    else if(quantity <= 0)
        errors.Add($"Line {LineNumber}: quantity must be positive");

    if(! DateOnly.TryParse(RawExpiryDate, out DateOnly expiryDate))
        errors.Add($"Line {LineNumber}: expiryDate must be a valid date.");
    else if(expiryDate <= DateOnly.FromDateTime(DateTime.Today))
        errors.Add($"Line {LineNumber}: expiry date must'nt be in the past");
}

if(errors.Count == 0)
    Console.WriteLine("Data is valid");
else
{
    Console.WriteLine($"{errors.Count} invalid rows detected");

    foreach (string error in errors)
        Console.WriteLine(error);

    Environment.Exit(1);
}

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