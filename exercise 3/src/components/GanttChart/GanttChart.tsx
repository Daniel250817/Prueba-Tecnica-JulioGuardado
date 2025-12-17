import { useMemo } from 'react';
import type { DateRange } from '../../types/Range';
import GanttService from '../../services/GanttService';
import { formatDate, daysBetween } from '../../utils/dateUtils';
import './GanttChart.css';

interface GanttChartProps {
  ranges: DateRange[];
  dateRange: { min: Date; max: Date };
}

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 100;
const MIN_DAY_WIDTH = 3;

export const GanttChart = ({ ranges, dateRange }: GanttChartProps) => {
  const ganttService = GanttService.getInstance();

  const { timelineWidth, visibleDays } = useMemo(() => {
    const totalDays = daysBetween(dateRange.min, dateRange.max) || 1;
    const dayWidth = Math.max(MIN_DAY_WIDTH, Math.min(8, 1200 / totalDays));
    const width = Math.max(totalDays * dayWidth, 800);
    const visibleDays: Array<{ date: Date; position: number }> = [];
    
    const interval = Math.max(1, Math.floor(totalDays / 20));
    const currentDate = new Date(dateRange.min);
    
    for (let i = 0; i <= totalDays; i += interval) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      
      if (date.getTime() <= dateRange.max.getTime()) {
        const position = ganttService.calculatePosition(
          date,
          dateRange.min,
          dateRange.max,
          width
        );
        visibleDays.push({ date, position });
      }
    }
    
    if (visibleDays.length === 0 || visibleDays[visibleDays.length - 1].date.getTime() < dateRange.max.getTime()) {
      const position = ganttService.calculatePosition(
        dateRange.max,
        dateRange.min,
        dateRange.max,
        width
      );
      visibleDays.push({ date: new Date(dateRange.max), position });
    }

    return {
      timelineWidth: width,
      visibleDays,
      dayPositions: visibleDays.map(d => d.position),
    };
  }, [dateRange, ganttService]);

  const chartHeight = ranges.length * ROW_HEIGHT + HEADER_HEIGHT;

  return (
    <div className="gantt-chart">
      <div className="gantt-chart__scroll-container">
        <div className="gantt-chart__header">
          <div className="gantt-chart__header-label">
            <span>Rangos</span>
          </div>
          <div className="gantt-chart__timeline-header" style={{ width: timelineWidth }}>
            {visibleDays.map(({ date, position }, index) => (
              <div
                key={index}
                className="gantt-chart__day-marker"
                style={{ left: position }}
              >
                <div className="gantt-chart__day-label">{formatDate(date)}</div>
                <div className="gantt-chart__day-line"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="gantt-chart__body" style={{ height: chartHeight }}>
          <div className="gantt-chart__rows">
            {ranges.map((range) => {
              const yLevel = 9;
              const xPosition = ganttService.calculatePosition(
                range.start,
                dateRange.min,
                dateRange.max,
                timelineWidth
              );
              const barWidth = ganttService.calculateBarWidth(
                range,
                dateRange.min,
                dateRange.max,
                timelineWidth
              );

              return (
                <div key={range.id} className="gantt-chart__row">
                  <div className="gantt-chart__row-label">
                    <span className="gantt-chart__range-info">
                      {formatDate(range.start)} - {formatDate(range.end)}
                    </span>
                  </div>
                  <div className="gantt-chart__timeline-row" style={{ width: timelineWidth }}>
                    <div
                      className={`gantt-chart__bar ${range.isContained ? 'gantt-chart__bar--contained' : 'gantt-chart__bar--original'}`}
                      style={{
                        left: xPosition,
                        width: barWidth,
                        top: yLevel,
                      }}
                      title={`${formatDate(range.start)} - ${formatDate(range.end)}${range.isContained ? ' (No reemplaza)' : ''}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
