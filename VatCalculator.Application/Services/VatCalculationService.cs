using Microsoft.Extensions.Options;
using VatCalculator.Core;
using VatCalculator.Core.Config;
using VatCalculator.Core.Models;
using VatCalculator.Core.Services;

namespace VatCalculator.Application.Services
{
    public class VatCalculationService : IVatCalculationService
    {
        private readonly VatRatesConfig _vatRatesConfig;

        public VatCalculationService(IOptions<VatRatesConfig> vatRatesConfig)
        {
            _vatRatesConfig = vatRatesConfig.Value;
        }

        public VatCalculationResponse Calculate(VatCalculationRequest request)
        {
            ValidateInput(request);

            if (request.NetAmount.HasValue)
                return CalculateFromNetAmount(request.NetAmount.Value, request.VatRate);
            if (request.GrossAmount.HasValue)
                return CalculateFromGrossAmount(request.GrossAmount.Value, request.VatRate);
            if (request.VatAmount.HasValue)
                return CalculateFromVatAmount(request.VatAmount.Value, request.VatRate);

            throw new ArgumentException("Invalid input. Please provide exactly one of NetAmount, GrossAmount, or VatAmount.");
        }

        public List<int> GetVatRates()
        {
            return _vatRatesConfig.VatRates;
        }

        private void ValidateInput(VatCalculationRequest request)
        {
            if (!_vatRatesConfig.VatRates.Contains((int)request.VatRate))
            {
                throw new ArgumentException($"Invalid VAT rate. Valid rates are: {string.Join(", ", _vatRatesConfig.VatRates)}.");
            }

            // Validate that only one input is provided
            var inputCount = new[] { request.NetAmount, request.GrossAmount, request.VatAmount }
                .Count(x => x.HasValue);

            if (inputCount != 1)
            {
                throw new ArgumentException("Invalid input. Please provide exactly one of NetAmount, GrossAmount, or VatAmount.");
            }
        }

        private VatCalculationResponse CalculateFromNetAmount(decimal netAmount, decimal vatRate)
        {
            var vatAmount = netAmount * (vatRate / 100);
            var grossAmount = netAmount + vatAmount;
            return new VatCalculationResponse { NetAmount = netAmount, GrossAmount = grossAmount, VatAmount = vatAmount };
        }

        private VatCalculationResponse CalculateFromGrossAmount(decimal grossAmount, decimal vatRate)
        {
            var netAmount = grossAmount / (1 + (vatRate / 100));
            var vatAmount = grossAmount - netAmount;
            return new VatCalculationResponse { NetAmount = netAmount, GrossAmount = grossAmount, VatAmount = vatAmount };
        }

        private VatCalculationResponse CalculateFromVatAmount(decimal vatAmount, decimal vatRate)
        {
            var netAmount = vatAmount / (vatRate / 100);
            var grossAmount = netAmount + vatAmount;
            return new VatCalculationResponse { NetAmount = netAmount, GrossAmount = grossAmount, VatAmount = vatAmount };
        }
    }
}
