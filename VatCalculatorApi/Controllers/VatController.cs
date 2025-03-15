using Microsoft.AspNetCore.Mvc;
using VatCalculator.Application.Services;
using VatCalculator.Core.Config;
using VatCalculator.Core.Models;
using VatCalculator.Core.Services;

namespace VatCalculator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VatController : ControllerBase
{
    private readonly IVatCalculationService _calculationService;
    private readonly VatRatesConfig _vatRatesConfig;

    public VatController(IVatCalculationService calculationService, VatRatesConfig vatRatesConfig)
    {
        _calculationService = calculationService;
        _vatRatesConfig = vatRatesConfig;
    }

    [HttpPost("calculate")]
    public IActionResult CalculateVat([FromBody] VatCalculationRequest request)
    {
        try
        {
            var result = _calculationService.Calculate(request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("rates")]
    public IActionResult GetVatRates()
    {
        return Ok(_vatRatesConfig.VatRates);
    }
}
