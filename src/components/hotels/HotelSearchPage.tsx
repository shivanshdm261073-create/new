import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  HOTEL_LISTINGS,
  SEARCH_PARAMS,
  NIGHTS,
  CHECK_IN_DISPLAY,
  CHECK_OUT_DISPLAY,
  WITHIN_BUDGET,
  OVER_BUDGET,
  TOP_3_PICKS,
  getEffectiveTotal,
} from '../../data/hotelData';
import { HotelComparisonTable } from './HotelComparisonTable';
import { TopPicks } from './TopPicks';

const WEBSITES = ['All', 'MakeMyTrip', 'Goibibo', 'Cleartrip', 'Booking.com', 'Agoda', 'Airbnb'];

export const HotelSearchPage: React.FC = () => {
  const [websiteFilter, setWebsiteFilter] = useState('All');

  const cheapestId = useMemo(() => {
    if (TOP_3_PICKS.length === 0) return '';
    return [...TOP_3_PICKS].sort((a, b) => getEffectiveTotal(a) - getEffectiveTotal(b))[0].id;
  }, []);

  const filteredWithin = useMemo(() =>
    websiteFilter === 'All'
      ? WITHIN_BUDGET
      : WITHIN_BUDGET.filter((h) => h.website === websiteFilter),
    [websiteFilter]
  );

  const filteredOver = useMemo(() =>
    websiteFilter === 'All'
      ? OVER_BUDGET
      : OVER_BUDGET.filter((h) => h.website === websiteFilter),
    [websiteFilter]
  );

  return (
    <div id="hotels" className="flex flex-col gap-6">
      {/* Search Parameters Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl p-4 sm:p-6"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏖️</span>
            <div>
              <h2 className="text-lg font-bold text-white">South Goa — Private Beach Stays</h2>
              <p className="text-xs text-gray-400">
                Comparing {HOTEL_LISTINGS.length} listings across {WEBSITES.length - 1} platforms
              </p>
            </div>
          </div>

          {/* Params chips */}
          <div className="flex flex-wrap gap-2 ml-auto">
            {[
              { icon: '📅', label: `${CHECK_IN_DISPLAY} → ${CHECK_OUT_DISPLAY}` },
              { icon: '🌙', label: `${NIGHTS} nights` },
              { icon: '👥', label: `${SEARCH_PARAMS.guests} guests` },
              { icon: '💰', label: `Budget: ₹${SEARCH_PARAMS.maxBudget.toLocaleString('en-IN')} total` },
              { icon: '🏝️', label: 'Private beach only' },
            ].map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-gray-300"
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Website filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 self-center">Filter by website:</span>
          {WEBSITES.map((site) => (
            <button
              key={site}
              onClick={() => setWebsiteFilter(site)}
              className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                websiteFilter === site
                  ? 'bg-gold/20 border-gold/40 text-gold font-medium'
                  : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white'
              }`}
            >
              {site}
            </button>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-3 text-xs text-gray-500 leading-relaxed border-t border-white/[0.06] pt-3">
          ⚠️ <strong className="text-gray-400">Disclaimer:</strong> Prices are research-based estimates for March 2026 
          and may differ from live rates. Always verify the current price, availability, and private beach claim 
          directly on the booking platform before completing any reservation. All prices shown are for 4 guests 
          for 4 nights total (Mar 19–23).
        </p>
      </motion.div>

      {/* Top 3 Picks */}
      {TOP_3_PICKS.length > 0 && (
        <TopPicks picks={TOP_3_PICKS} cheapestId={cheapestId} />
      )}

      {/* Within Budget Table */}
      {filteredWithin.length > 0 ? (
        <HotelComparisonTable
          listings={filteredWithin}
          title={`✅ Within Budget (≤ ₹20,000 total incl. taxes)`}
        />
      ) : (
        websiteFilter !== 'All' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full p-6 backdrop-blur-xl bg-orange-500/5 border border-orange-500/20 rounded-2xl text-center"
          >
            <p className="text-orange-300 text-sm font-medium">
              No within-budget private beach listings found on {websiteFilter} for these dates.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Try selecting "All" to see options across all platforms.
            </p>
          </motion.div>
        )
      )}

      {/* Over Budget Table */}
      {filteredOver.length > 0 && (
        <HotelComparisonTable
          listings={filteredOver}
          title="⚠️ Over Budget — Nearest Alternatives"
          overBudget
        />
      )}

      {/* Summary note if nothing found */}
      {filteredWithin.length === 0 && filteredOver.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full p-8 backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl text-center"
        >
          <p className="text-gray-300 text-sm font-medium">
            No private beach stays match all criteria for {websiteFilter}.
          </p>
          <p className="text-gray-500 text-xs mt-1">Try clearing the website filter.</p>
        </motion.div>
      )}

      {/* Key findings note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full p-4 sm:p-6 backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl"
      >
        <h4 className="text-sm font-semibold text-gray-200 mb-3">📝 Key Research Findings</h4>
        <ul className="flex flex-col gap-2 text-xs text-gray-400 leading-relaxed">
          <li>
            <span className="text-teal font-medium">Cheapest with taxes included:</span>{' '}
            Beachfront Cottage on Airbnb (Cavelossim) at ₹14,400 for 4 nights — flexible cancellation, 
            direct private beach access confirmed in listing description.
          </li>
          <li>
            <span className="text-teal font-medium">Best hotel value:</span>{' '}
            Camelot Beach Resort via Cleartrip at ₹12,400 base (₹14,632 with GST) — cheapest hotel option; 
            verify GST applicability at checkout.
          </li>
          <li>
            <span className="text-gold font-medium">Cross-platform savings:</span>{' '}
            Camelot Beach Resort is cheapest on Cleartrip (₹3,100/night) vs MakeMyTrip (₹3,200/night); 
            Club Mahindra is cheapest on Goibibo (₹4,100/night) vs MakeMyTrip (₹4,200/night).
          </li>
          <li>
            <span className="text-gold font-medium">5-star within budget:</span>{' '}
            Alila Diwa Goa via Booking.com at ₹19,800 all-inclusive just fits — best premium option 
            with direct beach access confirmed.
          </li>
          <li>
            <span className="text-orange-400 font-medium">Nothing found under budget:</span>{' '}
            Properties like The Leela Goa, Radisson Blu Cavelossim — while they have private beaches — 
            exceed ₹20,000 for 4 guests over 4 nights.
          </li>
          <li>
            <span className="text-gray-300 font-medium">Excluded "near beach" properties:</span>{' '}
            Several South Goa hotels (e.g., La Calypso, O'Camelot) were excluded because their listings 
            only mention proximity to beach, not private or exclusive beach access.
          </li>
        </ul>
      </motion.div>
    </div>
  );
};
