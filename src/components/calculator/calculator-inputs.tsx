"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ROIInput } from "@/lib/calculator/compute-roi";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculatorInputsProps {
  defaultValues: ROIInput;
  onCalculate: (input: ROIInput) => void;
  compact?: boolean;
  hideGrantInput?: boolean;
}

export function CalculatorInputs({
  defaultValues,
  onCalculate,
  compact,
  hideGrantInput,
}: CalculatorInputsProps) {
  const [input, setInput] = useState<ROIInput>(defaultValues);

  function update(partial: Partial<ROIInput>) {
    setInput((prev) => ({ ...prev, ...partial }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCalculate(input);
  }

  return (
    <Card>
      <CardHeader className={compact ? "pb-2" : "pb-3"}>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="size-4 text-ev-green" />
          {compact ? "Quick ROI Estimate" : "Calculator Inputs"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className={cn("space-y-4", compact && "space-y-3")}>
          {/* Infrastructure */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Number of Ports</label>
              <input
                type="number"
                min={1}
                max={100}
                value={input.numPorts}
                onChange={(e) => update({ numPorts: parseInt(e.target.value) || 1 })}
                className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Charging Level</label>
              <select
                value={input.chargingLevel}
                onChange={(e) => update({ chargingLevel: e.target.value as ROIInput["chargingLevel"] })}
                className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green"
              >
                <option value="dcfc">DC Fast Charger</option>
                <option value="level2">Level 2</option>
              </select>
            </div>
          </div>

          {/* Funding */}
          {!hideGrantInput && (
            <div>
              <label className="mb-1 block text-xs font-medium">Grant/Subsidy Amount ($)</label>
              <input
                type="number"
                min={0}
                value={input.grantSubsidy}
                onChange={(e) => update({ grantSubsidy: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green"
              />
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={input.taxCredit30C}
                onChange={(e) => update({ taxCredit30C: e.target.checked })}
                className="size-4 rounded border-gray-300"
              />
              Apply 30C Tax Credit (30%, max $100K)
            </label>
          </div>

          {/* Revenue */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Daily Sessions / Port</label>
              <input
                type="number"
                min={1}
                max={50}
                value={input.dailySessions}
                onChange={(e) => update({ dailySessions: parseInt(e.target.value) || 1 })}
                className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Fee / Session ($)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={input.feePerSession}
                onChange={(e) => update({ feePerSession: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green"
              />
            </div>
          </div>

          {/* Operating Costs */}
          {!compact && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Electricity Rate ($/kWh)</label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={input.electricityRate}
                  onChange={(e) => update({ electricityRate: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Demand Charge ($/kW-mo)</label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={input.demandCharge}
                  onChange={(e) => update({ demandCharge: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-ev-green"
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-ev-green text-white hover:bg-ev-green/90">
            Calculate ROI
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
