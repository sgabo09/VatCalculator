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

            decimal netAmount, grossAmount, vatAmount;

            if (request.NetAmount.HasValue)
            {
                netAmount = request.NetAmount.Value;
                vatAmount = netAmount * (request.VatRate / 100);
                grossAmount = netAmount + vatAmount;
            }
            else if (request.GrossAmount.HasValue)
            {
                grossAmount = request.GrossAmount.Value;
                netAmount = grossAmount / (1 + (request.VatRate / 100));
                vatAmount = grossAmount - netAmount;
            }
            else if (request.VatAmount.HasValue)
            {
                vatAmount = request.VatAmount.Value;
                netAmount = vatAmount / (request.VatRate / 100);
                grossAmount = netAmount + vatAmount;
            }
            else
            {
                throw new ArgumentException("Invalid input. Please provide one of NetAmount, GrossAmount, or VatAmount.");
            }

            return new VatCalculationResponse
            {
                NetAmount = netAmount,
                GrossAmount = grossAmount,
                VatAmount = vatAmount
            };
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
    }
}
