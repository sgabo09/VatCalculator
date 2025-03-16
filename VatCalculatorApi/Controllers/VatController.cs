using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
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

    public VatController(IVatCalculationService calculationService)
    {
        _calculationService = calculationService;
    }


    [HttpPost("calculate")]
    [ProducesResponseType(typeof(VatCalculationResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
    [ProducesResponseType(typeof(List<int>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetVatRates()
    {
        var rates = _calculationService.GetVatRates();
        return Ok(rates);
    }
}
