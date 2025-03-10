using Microsoft.Extensions.Configuration;
using RestSharp;
using System;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using DotNetEnv; 

public class GoogleMapsService
{
    private readonly string apiKey;
    private const string RoutesApiUrl = "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";

    // load API KEY
    public GoogleMapsService()
    {
        // Load .env file
        Env.Load();
        apiKey = Environment.GetEnvironmentVariable("GOOGLE_MAPS_API_KEY") 
                 ?? throw new Exception("API key not found in .env file!");
    }

    // API call to get a the distance matrix, which is suppossed to be used by the TSP SOLVER
    public async Task<string> MakeSimpleApiCall()
    {
        var client = new RestClient();
        var request = new RestRequest(RoutesApiUrl, Method.Post);

        // Set headers
        request.AddHeader("Content-Type", "application/json");
        request.AddHeader("X-Goog-Api-Key", apiKey);
        request.AddHeader("X-Goog-FieldMask", "duration,distanceMeters,originIndex,destinationIndex");

        // Define points for TSP (use the same points as both origins and destinations), its hard coded for now
        var jsonPayload = @"
        {
            ""origins"": [
                { ""waypoint"": { ""location"": { ""latLng"": { ""latitude"": 37.7749, ""longitude"": -122.4194 } } } },
                { ""waypoint"": { ""location"": { ""latLng"": { ""latitude"": 34.0522, ""longitude"": -118.2437 } } } },
                { ""waypoint"": { ""location"": { ""latLng"": { ""latitude"": 36.7783, ""longitude"": -119.4179 } } } },
                { ""waypoint"": { ""location"": { ""latLng"": { ""latitude"": 40.7128, ""longitude"": -74.0060 } } } }
            ],
            ""destinations"": [
                { ""waypoint"": { ""location"": { ""latLng"": { ""latitude"": 37.7749, ""longitude"": -122.4194 } } } },
                { ""waypoint"": { ""location"": { ""latLng"": { ""latitude"": 34.0522, ""longitude"": -118.2437 } } } },
                { ""waypoint"": { ""location"": { ""latLng"": { ""latitude"": 36.7783, ""longitude"": -119.4179 } } } },
                { ""waypoint"": { ""location"": { ""latLng"": { ""latitude"": 40.7128, ""longitude"": -74.0060 } } } }
            ],
            ""travelMode"": ""DRIVE""
        }";

        request.AddParameter("application/json", jsonPayload, ParameterType.RequestBody);

        try
        {
            var response = await client.ExecuteAsync(request);

            // Log the response status and content for debugging
            Console.WriteLine("HTTP Status Code: " + response.StatusCode);
            Console.WriteLine("Response Content: " + (response.Content ?? "No content"));

            if (response.IsSuccessful && response.Content != null)
            {
                var jsonResponse = JArray.Parse(response.Content);
                int pointCount = 4;  // Adjust based on the number of points
                var distanceMatrix = new int[pointCount, pointCount];

                // Populate the distance matrix
                foreach (var element in jsonResponse)
                {
                    int originIndex = element["originIndex"]?.Value<int>() ?? -1;
                    int destinationIndex = element["destinationIndex"]?.Value<int>() ?? -1;
                    int distance = element["distanceMeters"]?.Value<int>() ?? 0;

                    if (originIndex >= 0 && destinationIndex >= 0)
                    {
                        distanceMatrix[originIndex, destinationIndex] = distance;
                    }
                    else
                    {
                        Console.WriteLine("Invalid indices or missing data!");
                    }
                }

                // Format the matrix as a string for TSP
                var result = "Distance Matrix (meters):\n";
                for (int i = 0; i < pointCount; i++)
                {
                    for (int j = 0; j < pointCount; j++)
                    {
                        result += distanceMatrix[i, j] + "\t";
                    }
                    result += "\n";
                }

                return result;
            }
            else
            {
                return $"Error: {response.ErrorMessage}\nResponse: {response.Content ?? "No content"}";
            }
        }
        catch (Exception ex)
        {
            return "Exception: " + ex.Message + "\nStackTrace: " + ex.StackTrace;
        }
    }
}
