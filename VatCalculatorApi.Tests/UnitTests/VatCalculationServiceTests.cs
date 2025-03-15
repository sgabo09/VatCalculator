using Microsoft.Extensions.Options;
using VatCalculator.Application.Services;
using VatCalculator.Core.Config;
using VatCalculator.Core.Models;

namespace VatCalculator.Tests.Services
{
    public class VatCalculatorServiceTests
    {
        private readonly VatCalculationService _calculationService;

        public VatCalculatorServiceTests()
        {
            var vatRatesConfig = new VatRatesConfig { VatRates = new List<int> { 10, 13, 20 } };
            var options = Options.Create(vatRatesConfig);
            _calculationService = new VatCalculationService(options);
        }

        [Fact]
        public void CalculateVat_WithNetAmount_ReturnsCorrectValues()
        {
            // Arrange
            var request = new VatCalculationRequest
            {
                NetAmount = 100,
                VatRate = 20
            };

            // Act
            var result = _calculationService.Calculate(request);

            // Assert
            Assert.Equal(100, result.NetAmount);
            Assert.Equal(120, result.GrossAmount);
            Assert.Equal(20, result.VatAmount);
        }

        [Fact]
        public void CalculateVat_WithGrossAmount_ReturnsCorrectValues()
        {
            // Arrange
            var request = new VatCalculationRequest
            {
                GrossAmount = 120,
                VatRate = 20
            };

            // Act
            var result = _calculationService.Calculate(request);

            // Assert
            Assert.Equal(100, result.NetAmount);
            Assert.Equal(120, result.GrossAmount);
            Assert.Equal(20, result.VatAmount);
        }

        [Fact]
        public void CalculateVat_WithVatAmount_ReturnsCorrectValues()
        {
            // Arrange
            var request = new VatCalculationRequest
            {
                VatAmount = 20,
                VatRate = 20
            };

            // Act
            var result = _calculationService.Calculate(request);

            // Assert
            Assert.Equal(100, result.NetAmount);
            Assert.Equal(120, result.GrossAmount);
            Assert.Equal(20, result.VatAmount);
        }

        [Fact]
        public void CalculateVat_WithInvalidVatRate_ThrowsArgumentException()
        {
            // Arrange
            var request = new VatCalculationRequest
            {
                NetAmount = 100,
                VatRate = 25
            };

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => _calculationService.Calculate(request));
            Assert.Equal("Invalid VAT rate. Valid rates are: 10, 13, 20.", exception.Message);
        }

        [Fact]
        public void CalculateVat_WithMultipleInputs_ThrowsArgumentException()
        {
            // Arrange
            var request = new VatCalculationRequest
            {
                NetAmount = 100,
                GrossAmount = 120,
                VatRate = 20
            };

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => _calculationService.Calculate(request));
            Assert.Equal("Invalid input. Please provide exactly one of NetAmount, GrossAmount, or VatAmount.", exception.Message);
        }

        [Fact]
        public void CalculateVat_WithNoInput_ThrowsArgumentException()
        {
            // Arrange
            var request = new VatCalculationRequest
            {
                VatRate = 20
            };

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => _calculationService.Calculate(request));
            Assert.Equal("Invalid input. Please provide exactly one of NetAmount, GrossAmount, or VatAmount.", exception.Message);
        }
    }
}