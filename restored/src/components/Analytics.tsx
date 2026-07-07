/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, PieChart, LineChart as LineIcon, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';
import { Category, TransactionModel } from '../types';

interface AnalyticsProps {
  categories: Category[];
  transactions: TransactionModel[];
}

export default function Analytics({ categories, transactions }: AnalyticsProps) {
  const [chartType, setChartType] = useState<'line' | 'pie'>('line');
  const [selectedDay, setSelectedDay] = useState<{ day: number; amount: number } | null>(null);
  const [selectedPieSlice, setSelectedPieSlice] = useState<string | null>(null);

  // Group transactions for analytics
  // Standard days of current month: July 1 to July 7
  const dailySpending = [
    { day: 1, amount: 1500 },
    { day: 2, amount: 1200 },
    { day: 3, amount: 180 },
    { day: 4, amount: 450 },
    { day: 5, amount: 950 },
    { day: 6, amount: 1200 },
    { day: 7, amount: 1385 },
  ];

  // Expenses grouped by Category
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpenseAmount = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const amount = expenseTransactions
        .filter(t => t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = totalExpenseAmount > 0 ? Math.round((amount / totalExpenseAmount) * 100) : 0;
      return {
        ...cat,
        amount,
        percentage,
      };
    })
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Math helper for Donut Pie Chart Slices
  let accumulatedPercent = 0;
  const donutRadius = 55;
  const donutCircumference = 2 * Math.PI * donutRadius;

  const donutSlices = categoryBreakdown.map(cat => {
    const strokeDash = (cat.percentage / 100) * donutCircumference;
    const strokeOffset = donutCircumference - ((cat.percentage / 100) * donutCircumference) + (accumulatedPercent / 100) * donutCircumference;
    
    // Calculate mid-angle for placing icons around the border
    const sliceAngle = (cat.percentage / 100) * 360;
    const midAngle = (accumulatedPercent + cat.percentage / 2) * 3.6 - 90; // Convert to radians offset
    const rad = (midAngle * Math.PI) / 180;
    
    // Position slightly outside the donut ring (radius 55 + some buffer = 75)
    const iconX = 100 + 75 * Math.cos(rad);
    const iconY = 100 + 75 * Math.sin(rad);

    accumulatedPercent += cat.percentage;

    return {
      ...cat,
      strokeDash,
      strokeOffset: -strokeOffset, // Offset needs to be rotated
      iconX,
      iconY,
      angle: midAngle,
    };
  });

  // Line Chart Helper Calculations (Daily)
  const maxSpend = Math.max(...dailySpending.map(d => d.amount), 1);
  const chartHeight = 120;
  const chartWidth = 320;
  const paddingX = 40;
  const paddingY = 20;

  // Map daily points to SVG coordinates
  const points = dailySpending.map((d, index) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (dailySpending.length - 1);
    // Invert Y because SVG coordinates start from top-left (0,0)
    const y = chartHeight - paddingY - (d.amount / maxSpend) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate smooth cubic bezier path for Line Chart
  let linePath = '';
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  // Shadow path goes under the line to bottom of graph
  const fillPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="flex-1 overflow-y-auto pb-24 p-4 max-w-md mx-auto">
      
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-display font-bold text-kawaii-pink-600 flex items-center gap-1.5">
          📊 Phân Tích Chi Tiêu
        </h2>
        <p className="text-xs text-gray-400">Xem xu hướng và phân phối tài chính của bạn nhen! ✨</p>
      </div>

      {/* Chart Switcher tabs */}
      <div className="flex bg-white/80 p-1 rounded-2xl border-2 border-kawaii-pink-200 mb-4 shadow-sm">
        <button
          id="btn-chart-line"
          onClick={() => setChartType('line')}
          className={`flex-1 py-2 rounded-xl font-display text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            chartType === 'line'
              ? 'bg-kawaii-pink-400 text-white shadow-sm'
              : 'text-gray-500 hover:text-kawaii-pink-400'
          }`}
        >
          <LineIcon size={14} />
          Xu hướng (Line)
        </button>
        <button
          id="btn-chart-pie"
          onClick={() => setChartType('pie')}
          className={`flex-1 py-2 rounded-xl font-display text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            chartType === 'pie'
              ? 'bg-kawaii-pink-400 text-white shadow-sm'
              : 'text-gray-500 hover:text-kawaii-pink-400'
          }`}
        >
          <PieChart size={14} />
          Cơ cấu (Donut)
        </button>
      </div>

      {/* CHART CONTENT */}
      {chartType === 'line' ? (
        /* KIỂU 1: BIỂU ĐỒ ĐƯỜNG - XU HƯỚNG (NỀN HỒNG) */
        <motion.div
          key="line-chart"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="kawaii-card bg-gradient-to-br from-kawaii-pink-100 to-kawaii-pink-50 border-kawaii-pink-300 p-4 shadow-md relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-3 relative z-10">
            <div>
              <span className="text-[10px] font-display font-bold text-kawaii-pink-500 bg-white/80 px-2 py-0.5 rounded-full border border-kawaii-pink-200">
                THU/CHI HẰNG NGÀY
              </span>
              <h3 className="text-sm font-display font-semibold text-gray-700 mt-1">Xu hướng chi tiêu Tháng 7</h3>
            </div>
            <TrendingUp size={16} className="text-kawaii-pink-500 animate-pulse" />
          </div>

          {/* SVG Line Chart */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2 border border-white/60 relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Gradients */}
              <defs>
                <linearGradient id="lineFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2EFA73" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2EFA73" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFCAD4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFCAD4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0.25, 0.5, 0.75].map((yPct, idx) => {
                const gridY = paddingY + yPct * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={gridY}
                    x2={chartWidth - paddingX}
                    y2={gridY}
                    stroke="url(#gridGrad)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* Shaded area under wave */}
              {fillPath && (
                <path d={fillPath} fill="url(#lineFillGrad)" />
              )}

              {/* The bright neon green bezier line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#2EFA73"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="drop-shadow(0px 3px 4px rgba(46,250,115,0.3))"
                />
              )}

              {/* Nodes / Intersections */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="8"
                    fill="white"
                    stroke="#2EFA73"
                    strokeWidth="3"
                    className="cursor-pointer hover:r-10 transition-all"
                    onClick={() => setSelectedDay(p)}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="3"
                    fill="#2EFA73"
                  />
                  {/* Axis Label */}
                  <text
                    x={p.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fill="#FF708C"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="Comfortaa"
                  >
                    N.{p.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Tooltip Overlay inside chart card */}
          <div className="mt-3 flex items-center justify-between text-xs font-display font-medium text-gray-500 bg-white/70 p-2.5 rounded-xl border border-kawaii-pink-200">
            {selectedDay ? (
              <>
                <span>📅 Ngày {selectedDay.day} tháng 7:</span>
                <span className="font-bold text-kawaii-pink-500 text-sm">¥{selectedDay.amount.toLocaleString()}</span>
              </>
            ) : (
              <span className="italic text-gray-400">Click vào các nút chấm tròn xanh để xem chi tiết chi tiêu nhen! 🥰👉</span>
            )}
          </div>

          {/* Trend stats info */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-white/80 p-2.5 rounded-xl border border-kawaii-pink-200 text-center">
              <span className="text-[9px] text-gray-400 uppercase font-bold">Ngày tiêu cao nhất</span>
              <p className="font-display font-bold text-sm text-rose-400">N.1 (¥1,500)</p>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-kawaii-pink-200 text-center">
              <span className="text-[9px] text-gray-400 uppercase font-bold">Ngày tiết kiệm nhất</span>
              <p className="font-display font-bold text-sm text-emerald-500">N.3 (¥180)</p>
            </div>
          </div>
        </motion.div>
      ) : (
        /* KIỂU 2: BIỂU ĐỒ TRÒN - THEO THỂ LOẠI (NỀN TRẮNG) */
        <motion.div
          key="pie-chart"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="kawaii-card bg-white p-4 shadow-md flex flex-col items-center"
        >
          <div className="w-full flex justify-between items-center mb-1">
            <span className="text-[10px] font-display font-bold text-kawaii-pink-500 bg-kawaii-pink-50 px-2 py-0.5 rounded-full border border-kawaii-pink-100">
              PHÂN BỔ CHI TIÊU
            </span>
            <span className="text-[10px] font-mono text-gray-400">Tỷ lệ % danh mục</span>
          </div>

          {/* Donut SVG Rendering */}
          <div className="relative w-64 h-64 flex items-center justify-center mt-3">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              <circle
                cx="100"
                cy="100"
                r={donutRadius}
                fill="none"
                stroke="#FDFD96"
                strokeWidth="18"
                opacity="0.1"
              />
              
              {donutSlices.map((slice, idx) => (
                <circle
                  id={`slice-${slice.id}`}
                  key={slice.id}
                  cx="100"
                  cy="100"
                  r={donutRadius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="22"
                  strokeDasharray={`${slice.strokeDash} ${donutCircumference}`}
                  strokeDashoffset={slice.strokeOffset}
                  strokeLinecap="round"
                  className="cursor-pointer hover:stroke-[25] transition-all duration-300"
                  onClick={() => setSelectedPieSlice(slice.name)}
                />
              ))}

              {/* Category Icons pinned strictly around the border of the donut */}
              {donutSlices.map(slice => (
                <g key={`icon-${slice.id}`} className="transform rotate-90 origin-[100px_100px]">
                  <circle
                    cx={slice.iconX}
                    cy={slice.iconY}
                    r="14"
                    fill="white"
                    stroke={slice.color}
                    strokeWidth="2"
                    className="shadow-sm"
                  />
                  <text
                    x={slice.iconX}
                    y={slice.iconY + 4}
                    textAnchor="middle"
                    fontSize="13"
                    className="animate-kawaii-bounce duration-1000"
                  >
                    {slice.icon}
                  </text>
                </g>
              ))}
            </svg>

            {/* Inner Content of Donut */}
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none bg-white rounded-full w-24 h-24 shadow-inner border border-dashed border-kawaii-pink-200">
              <span className="text-[10px] font-display font-medium text-gray-400">Tổng Chi Phí</span>
              <span className="text-sm font-display font-bold text-kawaii-pink-500">
                ¥{totalExpenseAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Selected Slice Description Box */}
          <div className="w-full mt-1 mb-3 text-center">
            {selectedPieSlice ? (
              <p className="text-xs font-display text-kawaii-pink-600 bg-kawaii-pink-50 py-1.5 px-3 rounded-full border border-kawaii-pink-100">
                Danh mục đang xem: <span className="font-bold">{selectedPieSlice}</span> ✨
              </p>
            ) : (
              <p className="text-[10px] text-gray-400 italic">
                Chạm vào lát biểu đồ tròn để xem tên danh mục nhen! 🍭
              </p>
            )}
          </div>

          {/* List breakdown under pie */}
          <div className="w-full flex flex-col gap-2 mt-2">
            {categoryBreakdown.map(cat => (
              <div
                key={cat.id}
                onClick={() => setSelectedPieSlice(cat.name)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                  selectedPieSlice === cat.name
                    ? 'border-kawaii-pink-400 bg-kawaii-pink-50 scale-102 shadow-sm'
                    : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-md border"
                    style={{ backgroundColor: cat.color + '40', borderColor: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-700">{cat.name}</span>
                </div>

                <div className="text-right flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-gray-600">
                    ¥{cat.amount.toLocaleString()}
                  </span>
                  <span
                    className="text-[10px] font-display font-bold px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Helpful budgeting tips block */}
      <div className="kawaii-card bg-amber-50/80 border-amber-200 p-4 mt-4 flex items-start gap-3">
        <span className="text-2xl animate-bounce">💡</span>
        <div>
          <h4 className="text-xs font-display font-bold text-amber-900">Mẹo Tiết Kiệm từ Bé Thỏ 🐰</h4>
          <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
            Dạo này bạn đang chi tiêu nhiều cho <span className="font-bold">Ăn uống</span> đó nhen! Thử tự nấu cơm hộp bento cute tại nhà vừa ngon lại vừa tiết kiệm được ¥500 mỗi tuần nè! Chúc bạn tích luỹ mau đạt mục tiêu nhé!
          </p>
        </div>
      </div>

    </div>
  );
}
