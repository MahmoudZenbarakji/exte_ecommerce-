import { useQuery } from '@tanstack/react-query'
import { dashboardAPI } from '../services/api'

// Query keys for dashboard
export const dashboardKeys = {
  all: ['dashboard'],
  statistics: () => [...dashboardKeys.all, 'statistics'],
  revenue: () => [...dashboardKeys.all, 'revenue'],
}

// Custom hook for fetching dashboard statistics
export function useDashboardStatistics() {
  return useQuery({
    queryKey: dashboardKeys.statistics(),
    queryFn: dashboardAPI.getStatistics,
    staleTime: 2 * 60 * 1000, // 2 minutes - dashboard data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

// Custom hook for fetching revenue statistics
export function useRevenueStatistics() {
  return useQuery({
    queryKey: dashboardKeys.revenue(),
    queryFn: dashboardAPI.getRevenueStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
}
