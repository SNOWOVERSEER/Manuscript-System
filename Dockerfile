FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5266

ENV ASPNETCORE_URLS=http://+:5266
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["src/back_end/SiLA-Backend/SiLA-Backend/SiLA-Backend.csproj", "src/back_end/SiLA-Backend/SiLA-Backend/"]
RUN dotnet restore "src/back_end/SiLA-Backend/SiLA-Backend/SiLA-Backend.csproj"
COPY . .
WORKDIR "/src/src/back_end/SiLA-Backend/SiLA-Backend"
RUN dotnet build "SiLA-Backend.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "SiLA-Backend.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SiLA-Backend.dll"]
