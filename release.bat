@echo off
dotnet build src/Limbo.Umbraco.BorgerDk --configuration Release /t:rebuild /t:pack -p:PackageOutputPath=../../releases/nuget