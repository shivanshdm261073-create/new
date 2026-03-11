import React from 'react';
import { motion } from 'framer-motion';
import { HotelListing } from '../../types/hotel.types';
import { getEffectiveTotal } from '../../data/hotelData';

interface Props {
  picks: HotelListing[];
  cheapestId: string;
}

const MEDAL = ['🥇', '🥈', '🥉'];

const WEBSITE_COLORS: Record<string, string> = {
  MakeMyTrip: 'text-red-300',
  Goibibo: 'text-blue-300',
  Cleartrip: 'text-orange-300',
  'Booking.com': 'text-sky-300',
  Agoda: 'text-purple-300',
  Airbnb: 'text-pink-300',
};

export const TopPicks: React.FC<Props> = ({ picks, cheapestId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-4 sm:p-6"
    >
      <h3 className="text-base font-semibold text-gold mb-4">
        🏆 Top 3 Options — South Goa Private Beach Stays (4 guests, 4 nights)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {picks.map((h, idx) => {
          const effective = getEffectiveTotal(h);
          const isCheapest = h.id === cheapestId;
          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col gap-3 rounded-xl p-4 border transition-all ${
                isCheapest
                  ? 'bg-teal/10 border-teal/40 shadow-[0_0_20px_rgba(0,212,170,0.12)]'
                  : 'bg-white/[0.03] border-white/[0.08]'
              }`}
            >
              {isCheapest && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-teal text-gray-900 text-xs font-bold rounded-full whitespace-nowrap">
                  ✓ Cheapest Valid Option
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{MEDAL[idx]}</span>
                <div className="flex flex-col items-end">
                  <span className={`text-xl font-bold ${isCheapest ? 'text-teal' : 'text-gold'}`}>
                    ₹{effective.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {h.taxesIncluded ? 'taxes included' : '+GST extra'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white leading-tight">{h.property}</p>
                <p className="text-xs text-gray-400 mt-0.5">{h.area}</p>
                <p className={`text-xs font-medium mt-1 ${WEBSITE_COLORS[h.website] ?? 'text-gray-300'}`}>
                  via {h.website}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 text-xs text-gray-400">
                <div>
                  <span className="text-gray-500">Room: </span>{h.roomSetup}
                </div>
                <div>
                  <span className="text-teal/80 font-medium">🏖 </span>
                  <span>{h.privateBeachProof.slice(0, 90)}{h.privateBeachProof.length > 90 ? '…' : ''}</span>
                </div>
                <div>
                  <span className="text-gray-500">Cancel: </span>{h.cancellationPolicy}
                </div>
              </div>

              <a
                href={h.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-auto inline-flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg transition-colors font-medium ${
                  isCheapest
                    ? 'bg-teal/20 hover:bg-teal/30 text-teal border border-teal/30'
                    : 'bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20'
                }`}
              >
                Book on {h.website} ↗
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-teal/5 border border-teal/20 rounded-xl"
      >
        <p className="text-sm font-semibold text-teal mb-1">
          💡 Verdict: Cheapest Valid Option
        </p>
        {picks.length > 0 && (() => {
          const cheapest = picks.find((p) => p.id === cheapestId) ?? picks[0];
          const eff = getEffectiveTotal(cheapest);
          return (
            <p className="text-xs text-gray-300 leading-relaxed">
              The cheapest South Goa private beach stay for 4 guests (Mar 19–23, 4 nights) within the ₹20,000
              budget is{' '}
              <span className="text-teal font-semibold">{cheapest.property}</span> via{' '}
              <span className="text-teal font-semibold">{cheapest.website}</span> at{' '}
              <span className="text-gold font-bold">₹{eff.toLocaleString('en-IN')}</span>
              {cheapest.taxesIncluded ? ' (taxes included)' : ' (+ GST)'}.{' '}
              {cheapest.cancellationPolicy.toLowerCase().includes('free cancellation')
                ? 'Free cancellation is available before the deadline stated above.'
                : 'Note: this rate is non-refundable — check a refundable option if plans may change.'}
            </p>
          );
        })()}
      </motion.div>
    </motion.div>
  );
};
