import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, TrendingUp, Activity, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsSummary {
  totalRequests: number;
  avgRequestsPerDay: number;
  totalDevelopers: number;
  uptime: number;
  successRate: number;
}

interface UsageData {
  date: string;
  requests: number;
  accounts: number;
  payments: number;
  kyc: number;
}

interface ApiDistribution {
  name: string;
  value: number;
  color: string;
}

interface TopDeveloper {
  id: string;
  name: string;
  company: string;
  requests: number;
  growth: string;
}

interface RecentActivity {
  id: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  developerName?: string;
  endpointName?: string;
}

export default function Analytics() {
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("all");
  const [timeRange, setTimeRange] = useState("7d");

  // Get analytics summary
  const { data: analyticsSummary, isLoading: summaryLoading } = useQuery<{ success: boolean; data: AnalyticsSummary }>({
    queryKey: ["/api/analytics/summary", timeRange],
    queryParams: { environment: "sandbox" },
  });

  // Get usage over time
  const { data: usageData, isLoading: usageLoading } = useQuery<{ success: boolean; data: UsageData[] }>({
    queryKey: ["/api/analytics/usage", timeRange],
    queryParams: { 
      days: timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90",
      environment: "sandbox" 
    },
  });

  // Get API distribution
  const { data: apiDistribution, isLoading: distributionLoading } = useQuery<{ success: boolean; data: ApiDistribution[] }>({
    queryKey: ["/api/analytics/distribution"],
    queryParams: { environment: "sandbox" },
  });

  // Get top developers
  const { data: topDevelopers, isLoading: developersLoading } = useQuery<{ success: boolean; data: TopDeveloper[] }>({
    queryKey: ["/api/analytics/developers"],
    queryParams: { limit: "5", environment: "sandbox" },
  });

  // Get recent activity
  const { data: recentActivity, isLoading: activityLoading } = useQuery<{ success: boolean; data: RecentActivity[] }>({
    queryKey: ["/api/analytics/activity"],
    queryParams: { limit: "5", environment: "sandbox" },
  });

  const summary = analyticsSummary?.data;
  const usage = usageData?.data || [];
  const distribution = apiDistribution?.data || [];
  const developers = topDevelopers?.data || [];
  const activity = recentActivity?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header-bg w-full h-20 flex items-center justify-between px-6 lg:px-24">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-white text-2xl font-semibold" data-testid="page-title">
            Analytics Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white" data-testid="select-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-24 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card data-testid="stat-total-requests">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold text-[var(--au-primary)]" data-testid="value-total-requests">
                  {summary?.totalRequests?.toLocaleString() || "0"}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                +12% from last period
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-avg-requests">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Requests/Day</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-[var(--au-accent)]" data-testid="value-avg-requests">
                  {summary?.avgRequestsPerDay || "0"}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                +5% from last period
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-active-developers">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Developers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold text-purple-600" data-testid="value-active-developers">
                  {summary?.totalDevelopers || "0"}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                +3 new this week
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-uptime">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Uptime</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-green-600" data-testid="value-uptime">
                  {summary?.uptime || 99.9}%
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Usage Over Time */}
          <Card className="lg:col-span-2" data-testid="chart-usage-over-time">
            <CardHeader>
              <CardTitle>API Usage Over Time</CardTitle>
              <CardDescription>
                Request volume by day for the last {timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90"} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usageLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [value, `${String(name).charAt(0).toUpperCase() + String(name).slice(1)} Requests`]}
                    />
                    <Bar dataKey="accounts" stackId="a" fill="#3B82F6" name="accounts" />
                    <Bar dataKey="payments" stackId="a" fill="#10B981" name="payments" />
                    <Bar dataKey="kyc" stackId="a" fill="#8B5CF6" name="kyc" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* API Distribution */}
          <Card data-testid="chart-api-distribution">
            <CardHeader>
              <CardTitle>API Usage Distribution</CardTitle>
              <CardDescription>
                Breakdown of requests by API category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {distributionLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top Developers */}
          <Card data-testid="top-developers">
            <CardHeader>
              <CardTitle>Top Developers</CardTitle>
              <CardDescription>
                Most active API users this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {developersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {developers.map((developer, index) => (
                    <div key={developer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-testid={`top-developer-${developer.id}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-blue text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900" data-testid={`developer-name-${developer.id}`}>
                            {developer.name}
                          </p>
                          <p className="text-sm text-gray-600" data-testid={`developer-company-${developer.id}`}>
                            {developer.company}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900" data-testid={`developer-requests-${developer.id}`}>
                          {developer.requests.toLocaleString()}
                        </p>
                        <Badge variant="secondary" className="text-green-700 bg-green-100" data-testid={`developer-growth-${developer.id}`}>
                          {developer.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {developers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No developer activity data available yet.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8" data-testid="recent-activity">
          <CardHeader>
            <CardTitle>Recent API Activity</CardTitle>
            <CardDescription>
              Latest API calls and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-6 w-12" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activity.map((activityItem, index) => {
                  const timeAgo = new Date(activityItem.timestamp).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  });
                  return (
                    <div key={activityItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white" data-testid={`activity-${index}`}>
                      <div className="flex items-center space-x-4">
                        <Badge variant={activityItem.statusCode < 400 ? "default" : "destructive"} data-testid={`activity-status-${index}`}>
                          {activityItem.statusCode}
                        </Badge>
                        <div>
                          <p className="font-medium text-gray-900" data-testid={`activity-endpoint-${index}`}>
                            {activityItem.method} {activityItem.path}
                          </p>
                          <p className="text-sm text-gray-600" data-testid={`activity-developer-${index}`}>
                            {activityItem.developerName || 'Unknown Developer'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900" data-testid={`activity-duration-${index}`}>
                          {activityItem.responseTime}ms
                        </p>
                        <p className="text-xs text-gray-500" data-testid={`activity-time-${index}`}>
                          {timeAgo}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {activity.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No recent API activity data available yet.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}