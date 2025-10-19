import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Plus,
  Mail,
  Eye,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { GET_CONTACTS } from "../../lib/graphql/queries";
import { DELETE_CONTACT, UPDATE_CONTACT } from "../../lib/graphql/mutations";
import {
  Contact,
  ContactFilterInput,
  PaginationInput,
} from "../../lib/graphql/types";
import {
  DataTable,
  ColumnDef,
  BulkAction,
} from "../../components/admin/DataTable";
import { FilterBar, FilterConfig } from "../../components/admin/FilterBar";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

export function ContactListPage() {
  const [filters, setFilters] = useState<ContactFilterInput>({});
  const [pagination, setPagination] = useState<PaginationInput>({
    page: 1,
    pageSize: 20,
  });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const { data, loading, error, refetch } = useQuery<{
    contacts: {
      items: Contact[];
      total: number;
      page: number;
      pageSize: number;
    };
  }>(GET_CONTACTS, {
    variables: {
      filter: filters,
      pagination,
      sortBy,
      sortOrder,
    },
  });

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    onCompleted: () => {
      toast.success("Contact message deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete contact message", {
        description: error.message,
      });
    },
  });

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    onCompleted: () => {
      toast.success("Contact status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to update contact status", {
        description: error.message,
      });
    },
  });

  const contacts = data?.contacts?.items || [];
  const total = data?.contacts?.total || 0;

  const filterConfigs: FilterConfig[] = [
    {
      id: "search",
      label: "Search",
      type: "search",
      placeholder: "Search contacts, names, emails...",
    },
    {
      id: "isRead",
      label: "Status",
      type: "select",
      options: [
        { label: "Unread", value: "false" },
        { label: "Read", value: "true" },
      ],
    },
    {
      id: "dateRange",
      label: "Date Range",
      type: "date-range",
    },
  ];

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination({ page: 1, pageSize });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  };

  const handleMarkAsRead = async (contactId: string) => {
    updateContact({
      variables: {
        id: contactId,
        input: { isRead: true },
      },
    });
  };

  const handleMarkAsUnread = async (contactId: string) => {
    updateContact({
      variables: {
        id: contactId,
        input: { isRead: false },
      },
    });
  };

  const handleDeleteContact = async (contactId: string) => {
    const confirmed = await confirm({
      title: "Delete Contact Message",
      description:
        "Are you sure you want to delete this contact message? This action cannot be undone.",
      variant: "destructive",
      confirmLabel: "Delete",
    });

    if (confirmed) {
      deleteContact({ variables: { id: contactId } });
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    switch (action) {
      case "markRead":
        for (const id of selectedIds) {
          await updateContact({
            variables: {
              id,
              input: { isRead: true },
            },
          });
        }
        break;
      case "markUnread":
        for (const id of selectedIds) {
          await updateContact({
            variables: {
              id,
              input: { isRead: false },
            },
          });
        }
        break;
      case "delete":
        const confirmed = await confirm({
          title: "Delete Contact Messages",
          description: `Are you sure you want to delete ${selectedIds.length} contact messages? This action cannot be undone.`,
          variant: "destructive",
          confirmLabel: "Delete",
        });
        if (confirmed) {
          for (const id of selectedIds) {
            await deleteContact({ variables: { id } });
          }
        }
        break;
    }
  };

  const handleReply = (contact: Contact) => {
    const subject = `Re: ${contact.subject}`;
    const body = `\n\n--- Original Message ---\nFrom: ${contact.name} <${contact.email}>\nSubject: ${contact.subject}\n\n${contact.message}`;
    const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    toast.info("Export functionality coming soon");
  };

  const bulkActions: BulkAction[] = [
    {
      label: "Mark as Read",
      icon: <CheckCircle className="w-4 h-4" />,
      onClick: (ids) => handleBulkAction("markRead", ids),
    },
    {
      label: "Mark as Unread",
      icon: <Clock className="w-4 h-4" />,
      onClick: (ids) => handleBulkAction("markUnread", ids),
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
      onClick: (ids) => handleBulkAction("delete", ids),
    },
  ];

  const columns: ColumnDef<Contact>[] = [
    {
      id: "status",
      header: "Status",
      accessor: "isRead",
      width: "80px",
      cell: (isRead: boolean) => (
        <div className="flex items-center justify-center">
          {isRead ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          )}
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      accessor: "name",
      sortable: true,
      cell: (name: string, contact: Contact) => (
        <div>
          <div className="font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{contact.email}</div>
        </div>
      ),
    },
    {
      id: "subject",
      header: "Subject",
      accessor: "subject",
      sortable: true,
      cell: (subject: string) => (
        <div className="font-medium text-gray-900 line-clamp-2">{subject}</div>
      ),
    },
    {
      id: "message",
      header: "Message",
      accessor: "message",
      cell: (message: string) => (
        <div className="text-sm text-gray-600 line-clamp-2">{message}</div>
      ),
    },
    {
      id: "createdAt",
      header: "Received",
      accessor: "createdAt",
      sortable: true,
      cell: (date: string) => (
        <div className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingState rows={5} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">
            Manage customer inquiries and support requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filterConfigs}
        values={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters({})}
      />

      {/* Data Table */}
      <DataTable
        data={contacts}
        columns={columns}
        loading={loading}
        error={error}
        onRowClick={(contact) => {
          // Navigate to contact detail page
          window.location.href = `/admin/contacts/${contact.id}`;
        }}
        pagination={{
          page: pagination.page,
          pageSize: pagination.pageSize,
          total: total,
          onPageChange: handlePageChange,
          onPageSizeChange: handlePageSizeChange,
        }}
        sorting={{
          sortBy,
          sortOrder,
          onSortChange: handleSortChange,
        }}
        selection={{
          selectedRows: selectedContacts,
          onSelectionChange: setSelectedContacts,
        }}
        bulkActions={bulkActions}
        emptyMessage="No contact messages found. Customer inquiries will appear here."
        emptyIcon={<Mail className="w-12 h-12 text-gray-400" />}
      />

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          open={confirmDialog.isOpen}
          onOpenChange={() => {}}
          title={confirmDialog.options.title}
          description={confirmDialog.options.description}
          confirmLabel={confirmDialog.options.confirmLabel}
          cancelLabel={confirmDialog.options.cancelLabel}
          variant={confirmDialog.options.variant}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}
    </div>
  );
}
