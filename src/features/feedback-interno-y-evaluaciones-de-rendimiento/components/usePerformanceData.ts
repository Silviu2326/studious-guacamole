import { useState, useEffect } from 'react';
import { getPerformanceReviews, getFeedbackSummary } from '../api';
import { PerformanceReview, TrainerPerformanceSummary, PerformanceFilters } from '../types';
import { useAuth } from '../../../context/AuthContext';

export interface UsePerformanceDataReturn {
  data: {
    reviews: PerformanceReview[];
    summary: TrainerPerformanceSummary[];
  };
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePerformanceData = (
  gymId: string,
  filters: PerformanceFilters
): UsePerformanceDataReturn => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [summary, setSummary] = useState<TrainerPerformanceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!gymId || !user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // Fetch reviews
      const reviewsResponse = await getPerformanceReviews({
        gymId,
        staffMemberId: filters.staffMemberId || undefined,
        startDate: filters.dateRange?.[0]?.toISOString(),
        endDate: filters.dateRange?.[1]?.toISOString(),
        page: filters.page || 1,
        limit: filters.limit || 10,
      });

      // Fetch summary
      const summaryData = await getFeedbackSummary(gymId, 'last_90_days');

      // Transform reviews data
      const transformedReviews: PerformanceReview[] = reviewsResponse.data.map(review => ({
        id: review.id,
        staffMemberId: review.staffMemberId,
        staffMemberName: review.staffMemberName,
        reviewerName: review.reviewerName,
        reviewDate: review.reviewDate,
        status: review.status,
        overallScore: review.overallScore,
        templateId: review.templateId,
        scores: review.scores,
        createdAt: review.createdAt,
        completedAt: review.completedAt,
      }));

      // Transform summary data
      const transformedSummary: TrainerPerformanceSummary[] = summaryData.map(item => ({
        staffMemberId: item.staffMemberId,
        name: item.name,
        avatarUrl: item.avatarUrl,
        avgClientRating: item.avgClientRating,
        clientRetentionRate: item.clientRetentionRate,
        goalCompletionRate: 0, // This would need to come from a different endpoint
        pendingReviews: 0, // This would need to come from a different endpoint
        completedReviews: 0, // This would need to be calculated from reviews
        lastReviewDate: item.lastReviewDate,
      }));

      setReviews(transformedReviews);
      setSummary(transformedSummary);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Error al cargar los datos de rendimiento');
      console.error('Error fetching performance data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [gymId, filters.staffMemberId, filters.dateRange, filters.page, filters.limit]);

  return {
    data: {
      reviews,
      summary,
    },
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
};

