import { useEffect, useState } from "react";
import { fetchVendorReviews, submitVendorReview } from "../api";

const DEFAULT_PAGE_SIZE = 10;

export function useVendorReviews(vendorSlug) {
  const [reviews, setReviews] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!vendorSlug) {
      setReviews([]);
      setIsLoading(false);
      return undefined;
    }

    const loadInitialReviews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchVendorReviews(vendorSlug, {
          first: DEFAULT_PAGE_SIZE,
        });

        if (!isMounted) {
          return;
        }

        setReviews(response.reviews);
        setTotalCount(response.totalCount);
        setPageInfo(response.pageInfo);
      } catch (loadError) {
        if (isMounted) {
          setReviews([]);
          setTotalCount(0);
          setPageInfo({ hasNextPage: false, endCursor: null });
          setError(loadError.message || "Failed to load reviews.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialReviews();

    return () => {
      isMounted = false;
    };
  }, [vendorSlug]);

  const loadMore = async () => {
    if (!vendorSlug || !pageInfo.hasNextPage || !pageInfo.endCursor) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const response = await fetchVendorReviews(vendorSlug, {
        first: DEFAULT_PAGE_SIZE,
        after: pageInfo.endCursor,
      });

      setReviews((current) => [...current, ...response.reviews]);
      setTotalCount(response.totalCount);
      setPageInfo(response.pageInfo);
    } catch (loadError) {
      setError(loadError.message || "Failed to load more reviews.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const createReview = async (input) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitVendorReview(input);

      if (response.review) {
        setReviews((current) => [response.review, ...current]);
      }

      if (typeof totalCount === "number") {
        setTotalCount((current) => current + 1);
      }

      return response;
    } catch (submitError) {
      setError(submitError.message || "Failed to submit review.");
      throw submitError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    reviews,
    totalCount,
    pageInfo,
    isLoading,
    isLoadingMore,
    isSubmitting,
    error,
    loadMore,
    createReview,
  };
}
