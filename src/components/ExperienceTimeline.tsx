import React from 'react';
import { motion } from 'framer-motion';
import {
  jobTimeline,
  timelineStart,
  timelineEnd,
  assignLanes,
  renderedSpan,
  Job,
} from '../data/experience';

interface Props {
  /** Company of the row currently hovered in the list, for cross-highlighting. */
  activeCompany?: string | null;
  onHover?: (company: string | null) => void;
  className?: string;
}

const AXIS_WIDTH = 44; // px reserved for year labels
const LANE_GAP = 6; // px between concurrent-role columns

/**
 * Vertical Gantt of the career history.
 *
 * Time runs top (most recent) to bottom (earliest) so it reads in the same
 * order as the role list beside it. Concurrent roles — and there are several,
 * e.g. ModularEquity running underneath almost everything — are placed in
 * separate columns by interval partitioning rather than being allowed to
 * overlap, so no bar is ever hidden behind another.
 */
const ExperienceTimeline: React.FC<Props> = ({ activeCompany, onHover, className }) => {
  const { laneOf, laneCount } = React.useMemo(() => assignLanes(jobTimeline), []);
  const span = timelineEnd - timelineStart;

  /** Fraction from the top of the chart for a given year (recent at top). */
  const yFor = (year: number) => ((timelineEnd - year) / span) * 100;

  const years = React.useMemo(() => {
    const out: number[] = [];
    // Label every other year, always including both endpoints.
    for (let y = timelineEnd; y >= timelineStart; y -= 2) out.push(y);
    if (out[out.length - 1] !== timelineStart) out.push(timelineStart);
    return out;
  }, [span]);

  const laneWidth = `calc((100% - ${AXIS_WIDTH}px - ${(laneCount - 1) * LANE_GAP}px) / ${laneCount})`;

  const barStyle = (job: Job, lane: number): React.CSSProperties => {
    // renderedSpan applies the same minimum length that lane assignment
    // reasoned about, so a floored bar can never sit on top of its neighbour.
    const { from, to } = renderedSpan(job);
    const top = yFor(to);
    const height = yFor(from) - top;
    return {
      top: `${top}%`,
      height: `${height}%`,
      left: `calc(${AXIS_WIDTH}px + (${laneWidth} + ${LANE_GAP}px) * ${lane})`,
      width: laneWidth,
      background: job.color,
    };
  };

  return (
    // h-full + a stretched flex parent means the rail always spans exactly the
    // height of the role list beside it, however many roles there are.
    <div className={className}>
      <div className="relative h-full min-h-[420px]">
        {/* Year gridlines + labels */}
        {years.map((year) => (
          <div
            key={year}
            className="absolute inset-x-0 flex items-center"
            style={{ top: `${yFor(year)}%` }}
          >
            <span className="w-[44px] pr-2 text-right text-[10px] font-medium tabular-nums text-white/35">
              {year === timelineEnd ? 'Now' : year}
            </span>
            <span className="h-px flex-1 bg-white/[0.07]" />
          </div>
        ))}

        {/* Role bars */}
        {jobTimeline.map((job, i) => {
          const lane = laneOf.get(job.company) ?? 0;
          const isActive = activeCompany === job.company;
          const dimmed = Boolean(activeCompany) && !isActive;
          return (
            <motion.div
              key={job.company}
              className="absolute rounded-full"
              style={barStyle(job, lane)}
              initial={{ opacity: 0, scaleY: 0.4 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              animate={{ opacity: dimmed ? 0.25 : 1 }}
              onMouseEnter={() => onHover?.(job.company)}
              onMouseLeave={() => onHover?.(null)}
            >
              {/* Invisible wider hit area — the bars are deliberately slim. */}
              <span
                className="absolute -inset-x-1 inset-y-0 cursor-default"
                title={`${job.company} · ${job.period} · ${job.title}`}
              />
              {isActive && (
                <motion.span
                  layoutId="timeline-ring"
                  className="absolute -inset-[3px] rounded-full ring-2 ring-white/70"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceTimeline;
