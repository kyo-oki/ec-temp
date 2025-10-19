import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { X, Search, Filter, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../ui/utils";

export interface FilterConfig {
  id: string;
  label: string;
  type: "search" | "select" | "date-range" | "multi-select";
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset?: () => void;
  className?: string;
}

export function FilterBar({
  filters,
  values,
  onChange,
  onReset,
  className,
}: FilterBarProps) {
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: values.dateFrom ? new Date(values.dateFrom) : undefined,
    to: values.dateTo ? new Date(values.dateTo) : undefined,
  });

  const handleFilterChange = (filterId: string, value: any) => {
    onChange({
      ...values,
      [filterId]: value,
    });
  };

  const handleDateRangeChange = (
    from: Date | undefined,
    to: Date | undefined
  ) => {
    setDateRange({ from, to });
    onChange({
      ...values,
      dateFrom: from?.toISOString(),
      dateTo: to?.toISOString(),
    });
  };

  const handleMultiSelectChange = (
    filterId: string,
    optionValue: string,
    checked: boolean
  ) => {
    const currentValues = values[filterId] || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v: string) => v !== optionValue);

    handleFilterChange(filterId, newValues);
  };

  const clearFilter = (filterId: string) => {
    const newValues = { ...values };
    delete newValues[filterId];
    onChange(newValues);
  };

  const hasActiveFilters = Object.values(values).some(
    (value) =>
      value !== undefined &&
      value !== "" &&
      (Array.isArray(value) ? value.length > 0 : true)
  );

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case "search":
        return (
          <div key={filter.id} className="space-y-2">
            <Label htmlFor={filter.id}>{filter.label}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id={filter.id}
                placeholder={
                  filter.placeholder ||
                  `Search ${filter.label.toLowerCase()}...`
                }
                value={values[filter.id] || ""}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="pl-10"
              />
              {values[filter.id] && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearFilter(filter.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        );

      case "select":
        return (
          <div key={filter.id} className="space-y-2">
            <Label>{filter.label}</Label>
            <Select
              value={values[filter.id] || ""}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    filter.placeholder || `Select ${filter.label.toLowerCase()}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All {filter.label}</SelectItem>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "multi-select":
        return (
          <div key={filter.id} className="space-y-2">
            <Label>{filter.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {values[filter.id]?.length > 0
                    ? `${values[filter.id].length} selected`
                    : filter.placeholder ||
                      `Select ${filter.label.toLowerCase()}`}
                  <Filter className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <div className="p-3 space-y-2">
                  {filter.options?.map((option) => {
                    const isSelected =
                      values[filter.id]?.includes(option.value) || false;
                    return (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() =>
                          handleMultiSelectChange(
                            filter.id,
                            option.value,
                            !isSelected
                          )
                        }
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded"
                        />
                        <span className="text-sm">{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
            {values[filter.id]?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {values[filter.id].map((value: string) => {
                  const option = filter.options?.find(
                    (opt) => opt.value === value
                  );
                  return (
                    <Badge key={value} variant="secondary" className="text-xs">
                      {option?.label || value}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() =>
                          handleMultiSelectChange(filter.id, value, false)
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        );

      case "date-range":
        return (
          <div key={filter.id} className="space-y-2">
            <Label>{filter.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) =>
                    handleDateRangeChange(range?.from, range?.to)
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filters.map(renderFilter)}
        </div>
      </CardContent>
    </Card>
  );
}
