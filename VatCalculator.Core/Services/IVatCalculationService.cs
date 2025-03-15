using VatCalculator.Core.Models;

namespace VatCalculator.Core.Services
{
    public interface IVatCalculationService
    {
        VatCalculationResponse Calculate(VatCalculationRequest request);
    }
}
