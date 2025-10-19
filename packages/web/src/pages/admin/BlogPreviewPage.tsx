import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, Edit, Calendar, User, Eye } from "lucide-react";
import { GET_BLOG_POST } from "../../lib/graphql/queries";
import { BlogPost } from "../../lib/graphql/types";
import { ErrorState } from "../../components/admin/ErrorState";
import { LoadingState } from "../../components/admin/LoadingState";

export function BlogPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<{ blogPost: BlogPost }>(
    GET_BLOG_POST,
    {
      variables: { id: id! },
      skip: !id,
    }
  );

  const blogPost = data?.blogPost;

  if (loading) {
    return <LoadingState showSpinner message="Loading blog post preview..." />;
  }

  if (error) {
    return (
      <ErrorState error={error} onRetry={() => window.location.reload()} />
    );
  }

  if (!blogPost) {
    return (
      <ErrorState
        error="Blog post not found"
        onRetry={() => navigate("/admin/blog")}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/blog/${id}/edit`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Blog Post Preview
            </h1>
            <p className="text-gray-600">
              Preview how your blog post will appear to readers
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/blog/${id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Post
          </Button>
          <Button onClick={() => window.open(`/blog/${id}`, "_blank")}>
            <Eye className="w-4 h-4 mr-2" />
            View Live
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <Card>
        <CardContent className="p-0">
          {/* Blog Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={blogPost.isPublished ? "default" : "secondary"}>
                {blogPost.isPublished ? "Published" : "Draft"}
              </Badge>
              <Badge variant="outline">{blogPost.category}</Badge>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blogPost.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6">{blogPost.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Admin</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blogPost.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Thumbnail Image */}
          {blogPost.thumbnailUrl && (
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={blogPost.thumbnailUrl}
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Preview Mode</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            This is how your blog post will appear to readers. Make sure to
            check the formatting and content before publishing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
