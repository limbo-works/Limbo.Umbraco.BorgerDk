@echo off
dotnet msbuild src/Client -t:RunBuild
dotnet build src/Limbo.Umbraco.BorgerDk --configuration Debug /t:rebuild /t:pack -p:PackageOutputPath=c:\nuget\Umbraco17