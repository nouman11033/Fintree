"use client";
import * as React from 'react';
import Script from 'next/script';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { ChatHeader } from '@/components/chat-header';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { BarChartIcon, AlertTriangleIcon, LinkIcon, UserCheckIcon } from '@/components/ui/lms-icons';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useSession, SessionProvider } from 'next-auth/react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

function PageClientInner({ id, modelIdFromCookie, isCollapsed }: { id: string; modelIdFromCookie: string; isCollapsed: boolean }) {
  const [currentTab, setCurrentTab] = React.useState<'chat' | 'dashboard' | 'studyplan'>('chat');
  const { data: session } = useSession();

  // Dummy data for charts - adhering to color scheme
  const subjectProgressData = {
    labels: ['Ethics', 'Quant', 'Econ', 'FRA', 'Corp Fin', 'Equity', 'Fixed Income'],
    datasets: [
      {
        label: 'Progress %',
        data: [80, 60, 90, 45, 55, 88, 65],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(239, 68, 68, 0.8)',   // red for weak
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(239, 68, 68, 0.8)',   // red for weak
          'rgba(239, 68, 68, 0.8)',   // red for weak
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(59, 130, 246, 0.8)', // blue
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const subjectProgressOptions = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: { color: 'rgba(100, 100, 100, 0.2)' },
        ticks: { color: 'rgba(200, 200, 200, 1)' },
      },
      y: {
        grid: { color: 'rgba(100, 100, 100, 0.2)' },
        ticks: { color: 'rgba(200, 200, 200, 1)' },
      },
    },
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const completionData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [72, 28],
        backgroundColor: ['#3b82f6', '#e5e7eb'], // blue, light gray
        borderColor: ['#3b82f6', '#e5e7eb'],
        borderWidth: 1,
      },
    ],
  };

  const completionOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true, titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const mockExamData = {
    labels: ['Mock 1', 'Mock 2', 'Mock 3', 'Mock 4', 'Mock 5', 'Mock 6', 'Mock 7'],
    datasets: [
      {
        label: 'Score %',
        data: [65, 72, 78, 80, 88, 75, 82],
        borderColor: '#3b82f6', // blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // light blue fill
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
      },
    ],
  };

  const mockExamOptions = {
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
      x: { grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
    },
    plugins: { legend: { display: false }, tooltip: { titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const studyHoursData = {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5'],
    datasets: [
      {
        label: 'Hours',
        data: [12, 15, 18, 14, 16],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue
        borderColor: '#3b82f6', // blue
        borderWidth: 1,
        borderRadius: 4,
      }
    ],
  };

  const studyHoursOptions = {
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
      x: { grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
    },
    plugins: { legend: { display: false }, tooltip: { titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' } },
    responsive: true,
    maintainAspectRatio: false,
  };

   const videoCompletionData = {
    labels: ['Ethics', 'Quant', 'Econ', 'FRA', 'Corp Fin', 'Equity', 'Fixed Income'],
    datasets: [
      {
        label: 'Completion %',
        data: [95, 40, 98, 80, 35, 92, 85],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(239, 68, 68, 0.8)',   // red for weak
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(239, 68, 68, 0.8)',   // red for weak
          'rgba(59, 130, 246, 0.8)', // blue
          'rgba(59, 130, 246, 0.8)', // blue
        ],
         borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const videoCompletionOptions = {
    indexAxis: 'y' as const,
    scales: {
      x: { beginAtZero: true, max: 100, grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
      y: { grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
    },
    plugins: { legend: { display: false }, tooltip: { titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' } },
    responsive: true,
    maintainAspectRatio: false,
  };

   const questionTypeData = {
    labels: ['Multiple Choice', 'Essay Questions', 'Case Studies'],
    datasets: [
      {
        label: 'Correct %',
        data: [85, 65, 78],
        backgroundColor: ['#3b82f6', '#ef4444', '#3b82f6'], // blue, red, blue
        borderColor: ['#3b82f6', '#ef4444', '#3b82f6'],
        borderWidth: 1,
      },
    ],
  };

  const questionTypeOptions = {
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: 'rgba(200, 200, 200, 1)' } },
      tooltip: { enabled: true, titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    },
     scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
      x: { grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

   const studyMaterialTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Downloads',
        data: [50, 70, 60, 80, 90],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue
        borderColor: '#3b82f6', // blue
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const studyMaterialTrendsOptions = {
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
      x: { grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
    },
    plugins: { legend: { display: false }, tooltip: { titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' } },
    responsive: true,
    maintainAspectRatio: false,
  };

  // --- New Dashboard Data and Configs ---

  // KPI Data
  const kpiData = {
    totalCourses: 5,
    completedCourses: 2,
    averageScore: 85,
    studyHoursThisWeek: 18,
  };

  // Course Completion Pie Chart Data
  const courseCompletionData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [kpiData.completedCourses, 2, kpiData.totalCourses - kpiData.completedCourses - 2],
        backgroundColor: ['#3b82f6', '#e5e7eb', '#d1d5db'], // blue, light gray, gray
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const courseCompletionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: 'rgba(200, 200, 200, 1)' } },
      tooltip: { enabled: true, titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    },
  };

  // Weekly Quiz Scores Line Chart Data
  const weeklyQuizScoresData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'Average Score',
        data: [75, 80, 78, 85, 88],
        borderColor: '#3b82f6', // blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // light blue fill
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
      },
    ],
  };

  const weeklyQuizScoresOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
      x: { grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
    },
    plugins: { legend: { display: false }, tooltip: { titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' } },
  };

  // Subject Performance Radar Chart Data
  const subjectPerformanceData = {
    labels: ['Ethics', 'Quant', 'Econ', 'FRA', 'Corp Fin', 'Equity'],
    datasets: [
      {
        label: 'Your Score %',
        data: [85, 60, 90, 50, 55, 80],
        backgroundColor: 'rgba(59, 130, 246, 0.3)', // light blue fill
        borderColor: '#3b82f6', // blue
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b82f6',
      },
      {
        label: 'Average Score %',
        data: [75, 70, 85, 60, 65, 70],
        backgroundColor: 'rgba(239, 68, 68, 0.3)', // light red fill
        borderColor: '#ef4444', // red
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ef4444',
      },
    ],
  };

  const subjectPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(100, 100, 100, 0.2)' }, // Dark gray angle lines
        grid: { color: 'rgba(100, 100, 100, 0.2)' }, // Dark gray grid lines
        pointLabels: { color: 'rgba(200, 200, 200, 1)' }, // Light gray point labels
        ticks: { backdropColor: 'rgba(0, 0, 0, 0.8)', color: 'rgba(200, 200, 200, 1)' }, // Dark ticks background
      },
    },
    plugins: {
      legend: { position: 'top' as const, labels: { color: 'rgba(200, 200, 200, 1)' } }, // Light gray legend text
      tooltip: { enabled: true, titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' }, // Dark tooltip
    },
  };

  // Study Hours Distribution Bar Chart Data
  const studyHoursDistributionData = {
    labels: ['Morning', 'Afternoon', 'Evening', 'Weekend'],
    datasets: [
      {
        label: 'Hours',
        data: [5, 8, 10, 15],
        backgroundColor: ['#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6'], // blue
        borderColor: ['#3b82f6', '#3b82f6', '#3b82f6', '#3b82f6'], // blue
        borderWidth: 1,
      },
    ],
  };

  const studyHoursDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
      x: { grid: { color: 'rgba(100, 100, 100, 0.2)' }, ticks: { color: 'rgba(200, 200, 200, 1)' } },
    },
    plugins: { legend: { display: false }, tooltip: { titleColor: '#fff', bodyColor: '#ccc', backgroundColor: 'rgba(0, 0, 0, 0.8)' } },
  };

  // Recent Activity Data (for list)
  const recentActivity = [
    { id: 1, text: 'Completed Module 3 Quiz' },
    { id: 2, text: 'Reviewed Corporate Finance Notes' },
    { id: 3, text: 'Attended Live Class: Equity Valuation' },
    { id: 4, text: 'Started Mock Exam 8' },
    { id: 5, text: 'Chatted with AI Assistant' },
  ];

  // Dummy data for study plan milestones - Added performance insights
  const studyPlanMilestones = [
    { id: 1, title: 'Module 1: Ethics', status: 'completed', plannedDate: '2023-01-15', isCurrent: false, timeSpent: '10h', efficiency: '85%', pace: 'Fast' },
    { id: 2, title: 'Module 2: Quant', status: 'completed', plannedDate: '2023-02-01', isCurrent: false, timeSpent: '15h', efficiency: '70%', pace: 'Average' },
    { id: 3, title: 'Module 3: Econ', status: 'in-progress', plannedDate: '2023-02-20', isCurrent: true, timeSpent: '8h', efficiency: '--', pace: '--' }, // Marked as current
    { id: 4, title: 'Module 4: FR', status: 'not-started', plannedDate: '2023-03-10', isCurrent: false, timeSpent: '--', efficiency: '--', pace: '--' },
    { id: 5, title: 'Module 5: Corp Fin', status: 'not-started', plannedDate: '2023-04-05', isCurrent: false, timeSpent: '--', efficiency: '--', pace: '--' },
    { id: 6, title: 'Module 6: Equity', status: 'not-started', plannedDate: '2023-04-25', isCurrent: false, timeSpent: '--', efficiency: '--', pace: '--' },
    { id: 7, title: 'Module 7: Fixed Income', status: 'not-started', plannedDate: '2023-05-15', isCurrent: false, timeSpent: '--', efficiency: '--', pace: '--' },
     { id: 8, title: 'Module 8: Derivatives', status: 'not-started', plannedDate: '2023-06-01', isCurrent: false, timeSpent: '--', efficiency: '--', pace: '--' },
     { id: 9, title: 'Module 9: Alt Investments', status: 'not-started', plannedDate: '2023-06-20', isCurrent: false, timeSpent: '--', efficiency: '--', pace: '--' },
     { id: 10, title: 'Module 10: Portfolio Mgmt', status: 'not-started', plannedDate: '2023-07-10', isCurrent: false, timeSpent: '--', efficiency: '--', pace: '--' },
  ];

  // Sort milestones by planned date (optional, but good practice for timeline)
  studyPlanMilestones.sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime());

   // Calculate overall progress percentage (dummy calculation based on completed/total)
   const completedCount = studyPlanMilestones.filter(m => m.status === 'completed').length;
   const overallProgress = Math.round((completedCount / studyPlanMilestones.length) * 100);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} />
        <SidebarInset>
          <div className="flex-1 flex flex-col p-4">
            <ChatHeader
              chatId={id}
              selectedModelId={modelIdFromCookie}
              selectedVisibilityType="private"
              isReadonly={false}
              onTabChange={setCurrentTab}
              currentTab={currentTab}
            />
            {currentTab === 'chat' && (
              <>
                <Chat
                  key={id}
                  id={id}
                  initialMessages={[]}
                  selectedChatModel={modelIdFromCookie}
                  selectedVisibilityType="private"
                  isReadonly={false}
                />
                <DataStreamHandler id={id} />
              </>
            )}
            {currentTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4"
              >

                {/* KPIs */}
                <Card title="Total Courses" className="col-span-1">
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{kpiData.totalCourses}</p>
                </Card>
                 <Card title="Completed Courses" className="col-span-1">
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{kpiData.completedCourses}</p>
                </Card>
                 <Card title="Average Score" className="col-span-1">
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{kpiData.averageScore}%</p>
                </Card>
                 <Card title="Study Hours This Week" className="col-span-1">
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{kpiData.studyHoursThisWeek}</p>
                </Card>


                {/* Course Completion Chart (takes 2 columns) */}
                <Card title="Course Completion" className="md:col-span-2">
                   <div className="h-64 w-full flex items-center justify-center">
                     <div className="w-48 h-48">
                      <Doughnut data={courseCompletionData} options={courseCompletionOptions} />
                     </div>
                   </div>
                </Card>

                {/* Weekly Quiz Scores Chart (takes 2 columns) */}
                 <Card title="Weekly Quiz Scores" className="md:col-span-2">
                   <div className="h-64 w-full">
                     <Line data={weeklyQuizScoresData} options={weeklyQuizScoresOptions} />
                   </div>
                 </Card>

                {/* Subject Performance Radar Chart (takes 2 columns) */}
                 <Card title="Subject Performance" className="md:col-span-2">
                   <div className="h-64 w-full">
                     <Line data={subjectPerformanceData} options={subjectPerformanceOptions} />
                   </div>
                 </Card>

                 {/* Study Hours Distribution Bar Chart */}
                 <Card title="Study Hours Distribution" className="col-span-1">
                   <div className="h-64 w-full">
                     <Line data={studyHoursDistributionData} options={studyHoursDistributionOptions} />
                   </div>
                 </Card>

                {/* Recent Activity Feed (takes 1 column) */}
                <Card title="Recent Activity" className="col-span-1">
                  <ul className="mt-2 text-sm space-y-2">
                    {recentActivity.map(activity => (
                       <li key={activity.id} className="border-b border-zinc-200 dark:border-zinc-700 pb-2 last:border-b-0">{activity.text}</li>
                    ))}
                  </ul>
                </Card>

                 {/* Example: Upcoming Deadlines (Text List) */}
                 <Card title="Upcoming Deadlines" className="col-span-1">
                  <ul className="mt-2 text-sm space-y-1">
                    <li>Module 4 Quiz (QM): <span className="font-bold text-red-600 dark:text-red-400">2 days</span></li>
                    <li>Mock Exam 3: <span className="font-bold text-red-600 dark:text-red-400">4 days</span></li>
                    <li>Live Q&A (FR): <span className="font-bold">1 week</span></li>
                  </ul>
                </Card>

                {/* Example: Personalized Recommendations (Text List) */}
                 <Card title="Recommendations" className="col-span-1">
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Focus on Corporate Finance Module 5</li>
                    <li>Review Practice Questions in QM</li>
                    <li>Attend next Live Q&A for Financial Reporting</li>
                  </ul>
                </Card>

              </motion.div>
            )}
            {currentTab === 'studyplan' && (
              <motion.div
                key="studyplan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto p-4"
              >
                <h2 className="text-2xl font-bold mb-6 text-center text-zinc-800 dark:text-zinc-100">My Study Journey</h2>

                  {/* Overall Progress Indicator - Horizontal Bar */}
                   <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3 mb-8">
                     <div
                       className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                       style={{ width: `${overallProgress}%` }}
                     ></div>
                   </div>

                 <div className="relative flex flex-col items-start md:items-center py-8">
                    {/* Vertical line - Base */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-zinc-300 dark:bg-zinc-700"></div>

                     {/* Removed Vertical line - Progress Fill */}

                     {/* Milestones */}
                     {studyPlanMilestones.map((milestone, index) => (
                       <div key={milestone.id} className="flex items-start md:items-center w-full mb-12 relative">
                         {/* Milestone point */}
                         <TooltipProvider>
                           <TooltipUI>
                             <TooltipTrigger asChild>
                               <div className={cn(
                                 'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ring-4',
                                 milestone.status === 'completed' ? 'bg-blue-600 text-white ring-blue-200' : milestone.status === 'in-progress' ? 'bg-yellow-500 text-black ring-yellow-200' : 'bg-gray-400 text-white ring-gray-200',
                                 milestone.isCurrent && 'relative animate-pulse ring-blue-400', // Animated ring for current milestone
                                 milestone.status === 'not-started' && 'opacity-50', // Dim future milestones
                                 'cursor-pointer' // Indicate interactivity
                               )}>
                                 {index + 1}
                                  {/* Optional: Animated dot for current */}
                                   {milestone.isCurrent && (
                                    <span className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 rounded-full bg-blue-500 animate-ping"></span>
                                   )}
                               </div>
                             </TooltipTrigger>
                             <TooltipContent>
                                <p>Status: {milestone.status === 'completed' ? 'Completed' : milestone.status === 'in-progress' ? 'In Progress' : 'Not Started'}</p>
                                 {milestone.plannedDate && <p>Planned: {milestone.plannedDate}</p>}
                             </TooltipContent>
                           </TooltipUI>
                         </TooltipProvider>


                       {/* Milestone Content - Smaller card with performance insights */}
                       <div className={cn(
                          'flex-1 ml-4 md:ml-8 rounded-xl p-3 border shadow-md transition-opacity', // Reduced padding
                          milestone.status === 'completed' ? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700' : milestone.status === 'in-progress' ? 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700' : 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700', // White/Dark background for active, dimmed for future
                          milestone.isCurrent && 'ring-2 ring-blue-400 border-blue-400 dark:ring-blue-600 dark:border-blue-600', // Highlight current card border
                          milestone.status === 'completed' && 'opacity-70', // Slightly dim completed milestones
                          milestone.status === 'not-started' && 'opacity-50' // Dim future milestones
                       )}
                       >
                          <h4 className="font-semibold text-sm mb-1 text-zinc-800 dark:text-zinc-100">{milestone.title}</h4> {/* Smaller title */}
                           {milestone.plannedDate && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">Planned: {milestone.plannedDate}</p>
                           )}
                            {milestone.status !== 'not-started' && (
                               <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                                  <p>Time Spent: <span className="font-medium">{milestone.timeSpent}</span></p>
                                   <p>Efficiency: <span className="font-medium">{milestone.efficiency}</span></p>
                                   <p>Pace: <span className="font-medium">{milestone.pace}</span></p>
                                </div>
                            )}
                       </div>
                     </div>
                   ))}
                 </div>
               </motion.div>
             )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default function PageClient(props: { id: string; modelIdFromCookie: string; isCollapsed: boolean }) {
  return (
    <SessionProvider>
      <PageClientInner {...props} />
    </SessionProvider>
  );
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
        {title}
      </h3>
      {children}
    </div>
  );
} 