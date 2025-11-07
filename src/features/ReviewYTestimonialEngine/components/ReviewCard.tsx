import React from 'react';
import {
  Review,
  getSourceLabel,
  getStatusLabel,
  getStatusColor,
  getRatingColor
} from '../api/reviews';
import { Star, Share2, Award, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';

interface ReviewCardProps {
  review: Review;
  onFeature: (reviewId: string) => void;
  onCreatePost: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onFeature, onCreatePost }) => {
  const statusColor = getStatusColor(review.status);
  const statusLabel = getStatusLabel(review.status);
  const ratingColor = getRatingColor(review.rating);

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {review.authorPhoto ? (
              <img
                src={review.authorPhoto}
                alt={review.authorName}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {review.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{review.authorName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">{getSourceLabel(review.source)}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-600">
                  {new Date(review.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className={`text-lg font-bold ${ratingColor}`}>
            {review.rating}.0
          </span>
        </div>

        {/* Content */}
        <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {review.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Response */}
        {review.response && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Tu respuesta:</span>
            </div>
            <p className="text-sm text-gray-700">{review.response}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100 px-4 pb-4">
        <Button
          variant={review.status === 'featured' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onFeature(review.id)}
          leftIcon={<Award size={16} />}
        >
          {review.status === 'featured' ? 'Destacada' : 'Destacar'}
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onCreatePost(review.id)}
          leftIcon={<Share2 size={16} />}
        >
          Crear Publicación
        </Button>

        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ExternalLink size={16} />}
        >
          Responder
        </Button>
      </div>
    </Card>
  );
};

