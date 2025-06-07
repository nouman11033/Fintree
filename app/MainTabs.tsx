"use client";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';

type MainTabsProps = {
  id: string;
  modelIdFromCookie: string;
  currentTab: 'chat' | 'dashboard' | 'studyplan';
  onTabChange: (tab: 'chat' | 'dashboard' | 'studyplan') => void;
};

export default function MainTabs({ id, modelIdFromCookie, currentTab }: MainTabsProps) {
  return (
    <div className="flex-1 flex flex-col p-4">
      <AnimatePresence mode="wait">
        {currentTab === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Chat
              key={id}
              id={id}
              initialMessages={[]}
              selectedChatModel={modelIdFromCookie}
              selectedVisibilityType="private"
              isReadonly={false}
            />
            <DataStreamHandler id={id} />
          </motion.div>
        )}
        {currentTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
          >
            <Card title="Subject Progress">
              <ul className="mt-2 text-sm space-y-1">
                <li>Ethics: <span className="font-bold text-indigo-400">80%</span></li>
                <li>Quantitative Methods: <span className="font-bold text-fuchsia-400">60% (Weak Area)</span></li>
                <li>Economics: <span className="font-bold text-indigo-300">90%</span></li>
                <li>Financial Reporting: <span className="font-bold text-indigo-400">75%</span></li>
                <li>Corporate Finance: <span className="font-bold text-fuchsia-400">55% (Weak Area)</span></li>
                <li>Equity Investments: <span className="font-bold text-indigo-300">88%</span></li>
              </ul>
            </Card>
            <Card title="Overall Analytics">
              <p className="text-lg font-bold text-fuchsia-300">Overall Progress: 72%</p>
              <p className="text-sm mt-2">Videos watched: <span className="text-indigo-300">54%</span></p>
              <p className="text-sm">Notes downloaded: <span className="text-indigo-300">67%</span></p>
              <p className="text-sm">Live class attendance: <span className="text-indigo-300">80%</span></p>
              <p className="text-sm">Practice Questions Completed: <span className="text-indigo-300">70%</span></p>
              <p className="text-sm">Study Hours Logged (Weekly): <span className="text-indigo-300">15 hours</span></p>
            </Card>
            <Card title="Next Steps">
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Finish Module 4: Quantitative Methods</li>
                <li>Review Analytics for Corporate Finance</li>
                <li>Chat with your assistant about Ethics case studies</li>
                <li>Attempt Mock Exam 3</li>
              </ul>
            </Card>

            <Card title="Mock Exam Performance (Last 3)">
              <ul className="mt-2 text-sm space-y-1">
                <li>Mock Exam 7: <span className="font-bold text-indigo-400">82%</span></li>
                <li>Mock Exam 6: <span className="font-bold text-fuchsia-400">75%</span></li>
                <li>Mock Exam 5: <span className="font-bold text-indigo-300">88%</span></li>
              </ul>
            </Card>

            <Card title="Weekly Study Hours Trend">
              <div className="mt-2 text-xs flex justify-between items-end h-16">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-indigo-400 rounded-t" style={{ height: '80%' }}></div>
                  <span className="mt-1">Wk 1</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-indigo-400 rounded-t" style={{ height: '60%' }}></div>
                  <span className="mt-1">Wk 2</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-indigo-400 rounded-t" style={{ height: '90%' }}></div>
                  <span className="mt-1">Wk 3</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-fuchsia-400 rounded-t" style={{ height: '70%' }}></div>
                  <span className="mt-1">Wk 4</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-indigo-400 rounded-t" style={{ height: '85%' }}></div>
                  <span className="mt-1">Wk 5</span>
                </div>
              </div>
              <p className="mt-2 text-center text-xs italic">Last 5 weeks</p>
            </Card>

            <Card title="Video Completion by Subject">
              <ul className="mt-2 text-sm space-y-1">
                <li>Ethics: <span className="font-bold">95%</span></li>
                <li>Quantitative Methods: <span className="font-bold text-fuchsia-400">40%</span></li>
                <li>Economics: <span className="font-bold">98%</span></li>
                <li>Financial Reporting: <span className="font-bold">80%</span></li>
                <li>Corporate Finance: <span className="font-bold text-fuchsia-400">35%</span></li>
                <li>Equity Investments: <span className="font-bold">92%</span></li>
              </ul>
            </Card>

            <Card title="Recent Activity Feed">
              <ul className="mt-2 text-sm space-y-2">
                <li>Completed quiz: Module 3 Ethics</li>
                <li>Downloaded notes: Corporate Finance Formulas</li>
                <li>Attended Live Class: QM Problem Solving</li>
                <li>Started Mock Exam 7</li>
                <li>Reviewed solution: Equity Valuation</li>
              </ul>
            </Card>

            <Card title="Upcoming Deadlines">
              <ul className="mt-2 text-sm space-y-1">
                <li>Module 4 Quiz (QM): <span className="font-bold text-fuchsia-400">2 days</span></li>
                <li>Mock Exam 3: <span className="font-bold text-fuchsia-400">4 days</span></li>
                <li>Live Q&A (FR): <span className="font-bold">1 week</span></li>
              </ul>
            </Card>

            <Card title="Most Active Study Hours">
              <p className="mt-2 text-sm"><span className="font-bold">Evenings (7 PM - 10 PM):</span> 60% of study time</p>
              <p className="mt-1 text-sm"><span className="font-bold">Weekends:</span> 30% of study time</p>
              <p className="mt-1 text-sm"><span className="font-bold">Mornings:</span> 10% of study time</p>
            </Card>

            <Card title="Resource Engagement">
              <ul className="mt-2 text-sm space-y-1">
                <li>Practice Questions Attempted: <span className="font-bold">500+</span></li>
                <li>Forum Posts Read: <span className="font-bold">120+</span></li>
                <li>Assistant Chats Initiated: <span className="font-bold">35+</span></li>
              </ul>
            </Card>

            <Card title="Performance by Question Type">
              <ul className="mt-2 text-sm space-y-1">
                <li>Multiple Choice: <span className="font-bold text-indigo-400">85% Correct</span></li>
                <li>Essay Questions: <span className="font-bold text-fuchsia-400">65% Correct</span></li>
                <li>Case Studies: <span className="font-bold text-indigo-300">78% Correct</span></li>
              </ul>
            </Card>

            <Card title="Topics for Review">
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Time Value of Money (QM)</li>
                <li>Bond Valuation (Fixed Income)</li>
                <li>Cost of Capital (Corporate Finance)</li>
              </ul>
            </Card>

             <Card title="Module Completion Status">
              <ul className="mt-2 text-sm space-y-1">
                <li>Module 1 (Ethics): <span className="font-bold">Completed</span></li>
                <li>Module 2 (QM): <span className="font-bold">Completed</span></li>
                <li>Module 3 (Economics): <span className="font-bold">Completed</span></li>
                <li>Module 4 (QM): <span className="font-bold text-fuchsia-400">In Progress (60%)</span></li>
                <li>Module 5 (FR): <span className="font-bold">In Progress (80%)</span></li>
              </ul>
            </Card>

            <Card title="Study Material Download Trends">
              <div className="mt-2 text-xs flex justify-between items-end h-16">
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-indigo-400 rounded-t" style={{ height: '50%' }}></div>
                  <span className="mt-1">Jan</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-indigo-400 rounded-t" style={{ height: '70%' }}></div>
                  <span className="mt-1">Feb</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-fuchsia-400 rounded-t" style={{ height: '60%' }}></div>
                  <span className="mt-1">Mar</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-indigo-400 rounded-t" style={{ height: '80%' }}></div>
                  <span className="mt-1">Apr</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-4 bg-indigo-400 rounded-t" style={{ height: '90%' }}></div>
                  <span className="mt-1">May</span>
                </div>
              </div>
               <p className="mt-2 text-center text-xs italic">Last 5 months</p>
            </Card>

             <Card title="Live Class Attendance Rate">
              <p className="mt-2 text-lg font-bold text-indigo-400">80% Attendance</p>
               <ul className="mt-2 text-sm space-y-1">
                <li>Last 5 Classes Attended: 4/5</li>
                <li>Upcoming: 2 in the next week</li>
               </ul>
            </Card>

             <Card title="Assistant Interaction Insights">
              <ul className="mt-2 text-sm space-y-1">
                <li>Most Asked Topics: QM, Corporate Finance</li>
                <li>Average Session Duration: 10 minutes</li>
                <li>Questions Answered: 150+</li>
              </ul>
            </Card>

             <Card title="Personalized Recommendations">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
          >
            <Card title="Test Performance">
              <p className="text-sm">Weekly Tests: <span className="font-bold text-indigo-400">8/10 passed</span></p>
              <p className="text-sm">Mock Exams: <span className="font-bold text-indigo-400">6/7 completed</span></p>
              <p className="text-sm">Average Score: <span className="font-bold text-fuchsia-400">78%</span></p>
            </Card>
            <Card title="Content Usage">
              <p className="text-sm">Videos watched: <span className="text-indigo-300">54%</span></p>
              <p className="text-sm">Notes downloaded: <span className="text-indigo-300">67%</span></p>
              <p className="text-sm">Crash Course: <span className="text-indigo-300">2/5 completed</span></p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-zinc-900/80 via-indigo-900/60 to-fuchsia-900/40 shadow-xl border border-indigo-800/30 backdrop-blur-md">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-indigo-200">
        {title}
      </h3>
      {children}
    </div>
  );
} 