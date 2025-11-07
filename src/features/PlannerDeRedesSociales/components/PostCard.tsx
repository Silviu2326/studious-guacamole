import React from 'react';
import { SocialPost, getPlatformIcon, getStatusColor, getStatusLabel } from '../api/social';
import { Clock } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

interface PostCardProps {
  post: SocialPost;
  onClick?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const platformIcon = getPlatformIcon(post.platform);
  const statusLabel = getStatusLabel(post.status);
  const statusColor = getStatusColor(post.status);

  return (
    <Card
      variant="hover"
      padding="sm"
      onClick={onClick}
      className="h-full flex flex-col transition-shadow overflow-hidden cursor-pointer"
    >
      {/* Preview Image */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="relative w-full h-48 mb-2 rounded overflow-hidden bg-gray-100">
          <img
            src={post.mediaUrls[0]}
            alt="Post preview"
            className="w-full h-full object-cover"
          />
          {post.mediaUrls.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              +{post.mediaUrls.length}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        {/* Platform & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-lg">{platformIcon}</span>
            <span className="text-xs font-medium text-gray-700">
              {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
            </span>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        {/* Content Preview */}
        <p className="text-xs text-gray-700 line-clamp-2">
          {post.content.substring(0, 80)}{post.content.length > 80 ? '...' : ''}
        </p>

        {/* Scheduled Time */}
        {post.scheduledAt && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {new Date(post.scheduledAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

