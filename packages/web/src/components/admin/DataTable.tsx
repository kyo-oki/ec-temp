import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string;
  cell?: (value: any, row: T) => React.ReactNode;
}

export interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  onClick: (selectedIds: string[]) => void | Promise<void>;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: Error;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
  sorting?: {
    sortBy: string;
    sortOrder: "asc" | "desc";
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  };
  selection?: {
    selectedRows: string[];
    onSelectionChange: (ids: string[]) => void;
  };
  bulkActions?: BulkAction[];
  getRowId?: (row: T) => string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  error,
  onRowClick,
  pagination,
  sorting,
  selection,
  bulkActions = [],
  getRowId = (row: T) => (row as any).id,
  emptyMessage = "No data available",
  emptyIcon,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (columnId: string) => {
    if (!sorting) return;

    const isAsc =
      sortConfig?.key === columnId && sortConfig?.direction === "asc";
    const newDirection = isAsc ? "desc" : "asc";

    setSortConfig({ key: columnId, direction: newDirection });
    sorting.onSortChange(columnId, newDirection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selection) return;

    if (checked) {
      selection.onSelectionChange(data.map(getRowId));
    } else {
      selection.onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!selection) return;

    const newSelection = checked
      ? [...selection.selectedRows, rowId]
      : selection.selectedRows.filter((id) => id !== rowId);

    selection.onSelectionChange(newSelection);
  };

  const isAllSelected =
    selection &&
    data.length > 0 &&
    selection.selectedRows.length === data.length;
  const isIndeterminate =
    selection &&
    selection.selectedRows.length > 0 &&
    selection.selectedRows.length < data.length;

  const renderCell = (column: ColumnDef<T>, row: T) => {
    const value =
      typeof column.accessor === "function"
        ? column.accessor(row)
        : row[column.accessor];

    if (column.cell) {
      return column.cell(value, row);
    }

    return value;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">Error loading data</div>
          <div className="text-sm text-gray-600">{error.message}</div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
          <div className="text-lg font-medium text-gray-900 mb-2">
            No data found
          </div>
          <div className="text-gray-600">{emptyMessage}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selection &&
        selection.selectedRows.length > 0 &&
        bulkActions.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selection.selectedRows.length} item(s) selected
                </div>
                <div className="flex space-x-2">
                  {bulkActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={() => action.onClick(selection.selectedRows)}
                    >
                      {action.icon && (
                        <span className="mr-2">{action.icon}</span>
                      )}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {selection && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        ref={(el) => {
                          if (el) el.indeterminate = isIndeterminate;
                        }}
                      />
                    </TableHead>
                  )}
                  {columns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={
                        column.sortable ? "cursor-pointer hover:bg-gray-50" : ""
                      }
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{column.header}</span>
                        {column.sortable && (
                          <div className="flex flex-col">
                            <ChevronUp
                              className={`h-3 w-3 ${
                                sortConfig?.key === column.id &&
                                sortConfig?.direction === "asc"
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            />
                            <ChevronDown
                              className={`h-3 w-3 -mt-1 ${
                                sortConfig?.key === column.id &&
                                sortConfig?.direction === "desc"
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => {
                  const rowId = getRowId(row);
                  const isSelected =
                    selection?.selectedRows.includes(rowId) || false;

                  return (
                    <TableRow
                      key={rowId}
                      className={
                        onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                      }
                      onClick={() => onRowClick?.(row)}
                    >
                      {selection && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectRow(rowId, checked as boolean)
                            }
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {renderCell(column, row)}
                        </TableCell>
                      ))}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) =>
                    pagination.onPageSizeChange(Number(e.target.value))
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {Math.min(
                    (pagination.page - 1) * pagination.pageSize + 1,
                    pagination.total
                  )}{" "}
                  -{" "}
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total
                  )}{" "}
                  of {pagination.total}
                </span>

                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.onPageChange(pagination.page + 1)}
                    disabled={
                      pagination.page * pagination.pageSize >= pagination.total
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
