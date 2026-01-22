-- Tax calculation function for different African countries
-- This function calculates tax amounts based on country-specific VAT rates

CREATE OR REPLACE FUNCTION calculate_tax(
  input_amount DECIMAL,
  input_country_code TEXT
)
RETURNS TABLE (
  gross_amount DECIMAL,
  tax_amount DECIMAL,
  net_amount DECIMAL,
  tax_rate DECIMAL,
  country_code TEXT
) AS $$
DECLARE
  tax_rate_value DECIMAL;
BEGIN
  -- Set tax rates based on country
  CASE 
    WHEN input_country_code = 'KE' THEN
      tax_rate_value := 0.16; -- Kenya VAT: 16%
    WHEN input_country_code = 'ZA' THEN
      tax_rate_value := 0.15; -- South Africa VAT: 15%
    WHEN input_country_code = 'NG' THEN
      tax_rate_value := 0.075; -- Nigeria VAT: 7.5%
    ELSE
      tax_rate_value := 0.15; -- Default: 15%
  END CASE;

  -- Calculate tax amounts
  RETURN QUERY
  SELECT 
    input_amount AS gross_amount,
    input_amount * tax_rate_value AS tax_amount,
    input_amount * (1 - tax_rate_value) AS net_amount,
    tax_rate_value AS tax_rate,
    input_country_code AS country_code;
END;
$$ LANGUAGE plpgsql;

-- Comment on function for documentation
COMMENT ON FUNCTION calculate_tax IS 'Calculates tax amounts based on country-specific VAT rates for African markets';
