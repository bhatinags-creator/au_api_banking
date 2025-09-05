import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft, TrendingUp, Activity, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import { Developer } from "@shared/schema";

const mockUsageData = [
  { date: "2024-01-01", requests: 120, accounts: 45, payments: 30, kyc: 45 },
  { date: "2024-01-02", requests: 150, accounts: 60, payments: 40, kyc: 50 },
  { date: "2024-01-03", requests: 180, accounts: 70, payments: 55, kyc: 55 },
  { date: "2024-01-04", requests: 200, accounts: 80, payments: 65, kyc: 55 },
  { date: "2024-01-05", requests: 170, accounts: 65, payments: 50, kyc: 55 },
  { date: "2024-01-06", requests: 220, accounts: 90, payments: 70, kyc: 60 },
  { date: "2024-01-07", requests: 250, accounts: 100, payments: 80, kyc: 70 },
];

const mockApiDistribution = [
  { name: "Accounts API", value: 45, color: "#603078" },
  { name: "Payments API", value: 35, color: "#4d2661" },
  { name: "KYC API", value: 20, color: "#3a1d49" },
];

const mockTopDevelopers = [
  { id: "1", name: "Alice Johnson", company: "FinTech Solutions", requests: 1250, growth: "+15%" },
  { id: "2", name: "Bob Smith", company: "Banking Corp", requests: 980, growth: "+8%" },
  { id: "3", name: "Carol Davis", company: "Startup Bank", requests: 750, growth: "+22%" },
  { id: "4", name: "David Wilson", company: "Neo Finance", requests: 620, growth: "+5%" },
];

export default function Analytics() {
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("all");
  const [timeRange, setTimeRange] = useState("7d");

  const { data: developers = [] } = useQuery<Developer[]>({
    queryKey: ["/api/developers"],
  });

  const totalRequests = mockUsageData.reduce((sum, day) => sum + day.requests, 0);
  const avgRequestsPerDay = Math.round(totalRequests / mockUsageData.length);
  const totalDevelopers = developers.length + mockTopDevelopers.length;

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
              <div className="text-2xl font-bold text-[var(--au-primary)]" data-testid="value-total-requests">
                {totalRequests.toLocaleString()}
              </div>
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
              <div className="text-2xl font-bold text-[var(--au-accent)]" data-testid="value-avg-requests">
                {avgRequestsPerDay}
              </div>
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
              <div className="text-2xl font-bold text-purple-600" data-testid="value-active-developers">
                {totalDevelopers}
              </div>
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
              <div className="text-2xl font-bold text-green-600" data-testid="value-uptime">
                99.9%
              </div>
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
                Request volume by day for the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockUsageData}>
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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockApiDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockApiDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
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
              <div className="space-y-4">
                {mockTopDevelopers.map((developer, index) => (
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
              </div>
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
            <div className="space-y-4">
              {[
                { time: "2 minutes ago", endpoint: "GET /accounts/acc_123/balance", status: "200", developer: "Alice Johnson", duration: "245ms" },
                { time: "5 minutes ago", endpoint: "POST /payments", status: "201", developer: "Bob Smith", duration: "180ms" },
                { time: "8 minutes ago", endpoint: "POST /kyc/verify", status: "200", developer: "Carol Davis", duration: "320ms" },
                { time: "12 minutes ago", endpoint: "GET /accounts/acc_456/transactions", status: "200", developer: "David Wilson", duration: "156ms" },
                { time: "15 minutes ago", endpoint: "POST /accounts", status: "201", developer: "Alice Johnson", duration: "290ms" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white" data-testid={`activity-${index}`}>
                  <div className="flex items-center space-x-4">
                    <Badge variant={activity.status.startsWith("2") ? "default" : "destructive"} data-testid={`activity-status-${index}`}>
                      {activity.status}
                    </Badge>
                    <div>
                      <p className="font-medium text-gray-900" data-testid={`activity-endpoint-${index}`}>
                        {activity.endpoint}
                      </p>
                      <p className="text-sm text-gray-600" data-testid={`activity-developer-${index}`}>
                        {activity.developer}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900" data-testid={`activity-duration-${index}`}>
                      {activity.duration}
                    </p>
                    <p className="text-xs text-gray-500" data-testid={`activity-time-${index}`}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}