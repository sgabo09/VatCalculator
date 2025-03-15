using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VatCalculator.Core.Models
{
    public class VatCalculationRequest
    {
        public decimal? NetAmount { get; set; }
        public decimal? GrossAmount { get; set; }
        public decimal? VatAmount { get; set; }
        public decimal VatRate { get; set; }
    }
}
