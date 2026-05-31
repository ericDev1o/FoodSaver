#!/usr/bin/env -S dotnet run

using System.Net.Http.Json;
using System.Text.Json.Serialization;

LoadDotEnv(
    Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT")
    == "Production"
        ? "./tools/.env.production"
        : "./tools/.env");

Console.WriteLine();
Console.WriteLine();
Console.WriteLine("FoodSaver import tool");
Console.WriteLine();
/**
 * 0 - Parse args
 */
bool dryRun = args.Contains("--dry-run");

string? baseUrlArg = null;

for (int i = 0; i < args.Length; i++)
{
    if (
        args[i] == "--base-url"
        && i + 1 < args.Length)
    {
        baseUrlArg = args[i + 1];
    }
}

string[] positionalArgs =
[
    .. args.Where(arg => 
        arg != "--dry-run"
        && arg != "--base-url"
        && arg != baseUrlArg)
];

if (positionalArgs.Length != 1)
{
    Console.WriteLine(
        "Usage: ./tools/FoodSaver.Import.cs <file-path> [--dry-run] [--base-url <url>]");
    Environment.Exit(1);
}

/**
 * 6 - Configurable API base URL
 */
string baseUrl =
    baseUrlArg
    ?? Environment.GetEnvironmentVariable("FOODSAVER_API_URL")
    ?? "http://localhost:8080";
Console.WriteLine($"baseUrl: {baseUrl}");


string filePath = positionalArgs[0];


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
    string RawExpiryDate,
    string RawQuantity,
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
                throw new FormatException("A food must have 3 informations: name, quantity, expiry date and consumed status.");

            int lineNumber = index + 2; // +1 header +1 index base 0

            return (
                Name: columns[0].Trim(),
                RawExpiryDate: columns[1].Trim(),
                Quantity: columns[2].Trim(),
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

List<FoodCreateRequest> validFoods = [];

foreach (var (Name, RawExpiryDate, RawQuantity, LineNumber) in foods)
{
    bool isValid = true;

    if(string.IsNullOrWhiteSpace(Name)) {
        errors.Add($"✖ Line {LineNumber}: name is required");

        isValid = false;
    }

    if(! DateOnly.TryParse(RawExpiryDate, out DateOnly expiryDate)){
        errors.Add($"✖ Line {LineNumber}: expiryDate must be a valid date.");

        isValid = false;
    }
    else if(expiryDate <= DateOnly.FromDateTime(DateTime.Today)) {
        errors.Add($"✖ Line {LineNumber}: expiry date must'nt be in the past.");

        isValid = false;
    }

    if(! int.TryParse(RawQuantity, out int quantity)) {
        errors.Add($"✖ Line {LineNumber}: quantity must be a valid integer.");

        isValid = false;
    }
    else if(quantity <= 0) {
        errors.Add($"✖ Line {LineNumber}: quantity must be positive.");

        isValid = false;
    }

    if(isValid) {
        validFoods.Add(
            new FoodCreateRequest(
                Name,
                expiryDate,
                quantity));
    }
}

if(errors.Count == 0)
    Console.WriteLine("Data is 100% valid");
else
{
    string suffix = errors.Count == 1 ? string.Empty : "s";
    Console.WriteLine($"{errors.Count} data validation error{suffix} detected");

    foreach (string error in errors)
        Console.WriteLine(error);
}

if (validFoods.Count == 0)
{
    Console.WriteLine(
        "No valid row to import.");

    Environment.Exit(1);
}

/**
 * 4 Dry run
 */
if (dryRun)
{
    Console.WriteLine("Dry run: no data imported");

    foreach (var (Name, RawExpiryDate, RawQuantity, LineNumber) in foods)
    {
        Console.WriteLine(
            $"Would import: {Name} x{RawQuantity} ({RawExpiryDate})");
    }

    Environment.Exit(0);
}

/**
 * 5 - Import previously validated foods into FoodSaver.Api
 */
Console.WriteLine("Import started");

using HttpClient httpClient = new()
{
    BaseAddress = new Uri(baseUrl)
};

int imported = 0;
int failed = 0;

foreach (FoodCreateRequest request in validFoods)
{
    HttpResponseMessage response =
        await httpClient.PostAsJsonAsync(
            "/foods", 
            request,
            FoodSaverJsonContext.Default.FoodCreateRequest);

    if (response.IsSuccessStatusCode)
    {
        Console.WriteLine($"✔ {request.Name} x{request.Quantity} imported");
        imported++;
    }
    else
    {
        Console.WriteLine(
            $"✖ {request.Name} x{request.Quantity} failed: {(int)response.StatusCode}");

        failed++;
    }
}

Console.WriteLine();
Console.WriteLine("Summary");
Console.WriteLine("-------");
Console.WriteLine($"Imported: {imported}");
Console.WriteLine($"Skipped: {foods.Count - validFoods.Count}");
Console.WriteLine($"Failed: {failed}");

static void LoadDotEnv(string path)
{
    if (!File.Exists(path))
        return;

    foreach (string line in File.ReadLines(path))
    {
        if (
            string.IsNullOrWhiteSpace(line)
            || line.StartsWith('#')
            || !line.Contains('='))
            continue;

        string[] parts = line.Split('=', 2);

        Environment.SetEnvironmentVariable(
            parts[0].Trim(),
            parts[1].Trim());
    }
}

record FoodCreateRequest(
    string Name,
    DateOnly ExpiryDate,
    int Quantity);

[JsonSerializable(typeof(FoodCreateRequest))]
internal partial class FoodSaverJsonContext : JsonSerializerContext{}

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