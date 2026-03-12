"use client";

import { useState } from "react";
import { computeROI, type ROIInput, type ROIOutput } from "@/lib/calculator/compute-roi";
import { CalculatorInputs } from "./calculator-inputs";
import { CalculatorResults } from "./calculator-results";

interface ROICalculatorProps {
  compact?: boolean;
  defaultGrantAmount?: number;
}

export function ROICalculator({ compact, defaultGrantAmount }: ROICalculatorProps) {
  const [result, setResult] = useState<ROIOutput | null>(null);

  const defaultInput: ROIInput = {
    numPorts: 4,
    chargingLevel: "dcfc",
    grantSubsidy: defaultGrantAmount ?? 0,
    taxCredit30C: true,
    dailySessions: 8,
    feePerSession: 25,
    electricityRate: 0.12,
    demandCharge: 15,
  };

  function handleCalculate(input: ROIInput) {
    const output = computeROI(input);
    setResult(output);
  }

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <CalculatorInputs
        defaultValues={defaultInput}
        onCalculate={handleCalculate}
        compact={compact}
        hideGrantInput={compact && defaultGrantAmount !== undefined}
      />
      {result && <CalculatorResults result={result} compact={compact} />}
    </div>
  );
}
