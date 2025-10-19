import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Reply,
  Trash2,
  CheckCircle,
  Clock,
  Phone,
} from "lucide-react";
import { GET_CONTACT } from "../../lib/graphql/queries";
import { UPDATE_CONTACT, DELETE_CONTACT } from "../../lib/graphql/mutations";
import { Contact } from "../../lib/graphql/types";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import { ConfirmDialog } from "../../components/admin/ConfirmDialog";

export function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { toast } = useToast();
  const { confirm, confirmDialog } = useConfirm();

  const { data, loading, error, refetch } = useQuery<{ contact: Contact }>(
    GET_CONTACT,
    {
      variables: { id: id! },
      skip: !id,
    }
  );

  const [updateContact, { loading: updateLoading }] = useMutation(
    UPDATE_CONTACT,
    {
      onCompleted: () => {
        toast.success("Contact status updated successfully");
        refetch();
      },
      onError: (error) => {
        toast.error("Failed to update contact status", {
          description: error.message,
        });
      },
    }
  );

  const [deleteContact, { loading: deleteLoading }] = useMutation(
    DELETE_CONTACT,
    {
      onCompleted: () => {
        toast.success("Contact message deleted successfully");
        navigate("/admin/contacts");
      },
      onError: (error) => {
        toast.error("Failed to delete contact message", {
          description: error.message,
        });
      },
    }
  );

  const contact = data?.contact;

  const handleMarkAsRead = () => {
    if (contact && !contact.isRead) {
      updateContact({
        variables: {
          id: contact.id,
          input: { isRead: true },
        },
      });
    }
  };

  const handleMarkAsUnread = () => {
    if (contact && contact.isRead) {
      updateContact({
        variables: {
          id: contact.id,
          input: { isRead: false },
        },
      });
    }
  };

  const handleReply = () => {
    if (!contact) return;

    const subject = `Re: ${contact.subject}`;
    const body = `\n\n--- Original Message ---\nFrom: ${contact.name} <${contact.email}>\nSubject: ${contact.subject}\n\n${contact.message}`;
    const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleDelete = async () => {
    if (!contact) return;

    const confirmed = await confirm({
      title: "Delete Contact Message",
      description:
        "Are you sure you want to delete this contact message? This action cannot be undone.",
      variant: "destructive",
      confirmLabel: "Delete",
    });

    if (confirmed) {
      deleteContact({ variables: { id: contact.id } });
    }
  };

  if (loading) {
    return <LoadingState showSpinner message="Loading contact message..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!contact) {
    return (
      <ErrorState
        error="Contact message not found"
        onRetry={() => navigate("/admin/contacts")}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/contacts")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contacts
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Contact Message
            </h1>
            <p className="text-gray-600">
              Received on {new Date(contact.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReply}>
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          {contact.isRead ? (
            <Button
              variant="outline"
              onClick={handleMarkAsUnread}
              disabled={updateLoading}
            >
              <Clock className="w-4 h-4 mr-2" />
              Mark Unread
            </Button>
          ) : (
            <Button onClick={handleMarkAsRead} disabled={updateLoading}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Read
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Message Details
                </CardTitle>
                <Badge variant={contact.isRead ? "default" : "secondary"}>
                  {contact.isRead ? "Read" : "Unread"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {contact.subject}
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {contact.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {contact.name}
                </p>
                <p className="text-sm text-gray-500">{contact.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Message Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Message Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Message Received
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {contact.isRead && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Marked as Read
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(contact.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleReply}
              >
                <Reply className="w-4 h-4 mr-2" />
                Reply via Email
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`mailto:${contact.email}`)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send New Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
