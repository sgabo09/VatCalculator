# VatCalculatorApi

# Project Structure
Backend:
```markdown
├── VatCalculator.Api.Client  # API Client generator
├── VatCalculator.Api         # API layer
├── VatCalculator.Core        # Domain layer
├── VatCalculator.Application # Application layer
├── VatCalculator.Api.Tests   # Unit tests
```
Frontend:
```markdown
├── VatCalculator.WebApp      # Angular app
```

## For frontend instructions check inside VatCalculator.WebApp project

## Prerequisites

Before you begin, ensure you have the following installed:

1. **.NET SDK 8.0**:
   - Download and install the .NET 8 SDK from [here](https://dotnet.microsoft.com/download/dotnet/8.0).

## Getting Started

Inside the VatCalculator.Api project run:
```markdown
  dotnet restore
  dotnet build
  dotnet run
```

HTTP: [http://localhost:5174](http://localhost:5174)

HTTPS: [https://localhost:7082](https://localhost:7082)
