import { useState } from "react";
import { DataTable, ColumnDef } from "./DataTable";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  error?: any;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  sorting?: {
    sortBy: string;
    sortOrder: "asc" | "desc";
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  };
  selection?: {
    selectedRows: string[];
    onSelectionChange: (selectedRows: string[]) => void;
  };
  bulkActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: (selectedIds: string[]) => void;
    variant?: "default" | "destructive";
  }>;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  getRowId?: (row: T) => string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
}

export function ResponsiveDataTable<T>({
  data,
  columns,
  loading = false,
  error,
  onRowClick,
  pagination,
  sorting,
  selection,
  bulkActions,
  emptyMessage = "No data available",
  emptyIcon,
  getRowId = (row: T) => (row as any).id,
  onEdit,
  onDelete,
  onView,
}: ResponsiveDataTableProps<T>) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  });

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              {emptyIcon}
              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                {emptyMessage}
              </h3>
            </CardContent>
          </Card>
        ) : (
          data.map((row, index) => (
            <Card
              key={getRowId(row)}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Main content based on first few columns */}
                  {columns.slice(0, 3).map((column, colIndex) => {
                    const value = (row as any)[column.accessor];
                    return (
                      <div key={colIndex}>
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          {column.header}
                        </div>
                        <div className="text-sm text-gray-900">
                          {column.cell ? column.cell(value, row) : value}
                        </div>
                      </div>
                    );
                  })}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(row)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(row)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(row)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(row)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  // Desktop view - use regular DataTable
  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      error={error}
      onRowClick={onRowClick}
      pagination={pagination}
      sorting={sorting}
      selection={selection}
      bulkActions={bulkActions}
      emptyMessage={emptyMessage}
      emptyIcon={emptyIcon}
    />
  );
}
