using VatCalculator.Application.Services;
using VatCalculator.Core.Config;
using VatCalculator.Core.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.Configure<VatRatesConfig>(builder.Configuration.GetSection("VatRates"));
builder.Services.AddTransient<IVatCalculationService, VatCalculationService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
