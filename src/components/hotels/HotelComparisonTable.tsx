import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HotelListing } from '../../types/hotel.types';
import { getEffectiveTotal } from '../../data/hotelData';

interface Props {
  listings: HotelListing[];
  title: string;
  overBudget?: boolean;
}

const WEBSITE_COLORS: Record<string, string> = {
  MakeMyTrip: 'bg-red-500/20 text-red-300 border-red-500/30',
  Goibibo: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Cleartrip: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Booking.com': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Agoda: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Airbnb: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

const STAR_COLORS = ['', '', 'text-yellow-600', 'text-yellow-500', 'text-yellow-400', 'text-gold'];

function Stars({ count }: { count?: number }) {
  if (!count) return <span className="text-xs text-gray-500">Unrated</span>;
  return (
    <span className={`text-sm ${STAR_COLORS[count] ?? 'text-gold'}`}>
      {'★'.repeat(count)}
      {'☆'.repeat(5 - count)}
    </span>
  );
}

export const HotelComparisonTable: React.FC<Props> = ({ listings, title, overBudget = false }) => {
  const [sortBy, setSortBy] = useState<'price' | 'property' | 'area'>('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...listings].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'price') cmp = getEffectiveTotal(a) - getEffectiveTotal(b);
    else if (sortBy === 'property') cmp = a.property.localeCompare(b.property);
    else if (sortBy === 'area') cmp = a.area.localeCompare(b.area);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: typeof sortBy }) => (
    <span className="ml-1 text-gray-500">
      {sortBy === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full backdrop-blur-xl bg-white/5 border border-white/[0.08] rounded-2xl overflow-hidden"
    >
      {/* Table Header */}
      <div className={`px-4 sm:px-6 py-4 border-b border-white/[0.08] ${overBudget ? 'bg-orange-500/5' : 'bg-teal/5'}`}>
        <h3 className={`text-base font-semibold ${overBudget ? 'text-orange-300' : 'text-teal'}`}>
          {title}
          <span className="ml-2 text-sm font-normal text-gray-400">({listings.length} listings)</span>
        </h3>
        {overBudget && (
          <p className="text-xs text-orange-400/80 mt-1">
            ⚠️ These properties exceed the ₹20,000 total budget — shown as nearest alternatives
          </p>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-gray-400 text-xs uppercase tracking-wider">
              <th
                className="text-left px-4 py-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('property')}
              >
                Property <SortIcon field="property" />
              </th>
              <th className="text-left px-4 py-3">Website</th>
              <th
                className="text-left px-4 py-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('area')}
              >
                Area <SortIcon field="area" />
              </th>
              <th className="text-left px-4 py-3">Room Setup</th>
              <th
                className="text-right px-4 py-3 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('price')}
              >
                Total Price <SortIcon field="price" />
              </th>
              <th className="text-center px-4 py-3">Taxes</th>
              <th className="text-left px-4 py-3 max-w-[180px]">Private Beach Proof</th>
              <th className="text-left px-4 py-3">Cancellation</th>
              <th className="text-center px-4 py-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h, idx) => {
              const effective = getEffectiveTotal(h);
              const isOverBudget = effective > 20000;
              return (
                <motion.tr
                  key={h.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${
                    isOverBudget ? 'opacity-70' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-white text-xs leading-tight">{h.property}</span>
                      <Stars count={h.starRating} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${WEBSITE_COLORS[h.website] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                      {h.website}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">{h.area}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px]">{h.roomSetup}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className={`font-bold text-sm ${isOverBudget ? 'text-orange-400' : 'text-gold'}`}>
                        ₹{effective.toLocaleString('en-IN')}
                      </span>
                      {!h.taxesIncluded && h.taxAmount && (
                        <span className="text-xs text-gray-500">
                          Base ₹{h.totalPrice.toLocaleString('en-IN')} + tax
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {h.taxesIncluded ? (
                      <span className="text-teal text-xs font-medium">✓ Incl.</span>
                    ) : (
                      <span className="text-orange-400 text-xs">+18% GST</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 max-w-[180px]">
                    <span className="text-teal/80 font-medium">✓ </span>
                    {h.privateBeachProof}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 max-w-[140px]">{h.cancellationPolicy}</td>
                  <td className="px-4 py-3 text-center">
                    <a
                      href={h.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 rounded-lg transition-colors"
                    >
                      Book ↗
                    </a>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden flex flex-col divide-y divide-white/[0.04]">
        {sorted.map((h) => {
          const effective = getEffectiveTotal(h);
          const isOverBudget = effective > 20000;
          const isExpanded = expandedId === h.id;
          return (
            <div key={h.id} className={`px-4 py-4 ${isOverBudget ? 'opacity-70' : ''}`}>
              <button
                className="w-full text-left"
                onClick={() => setExpandedId(isExpanded ? null : h.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm leading-tight truncate">{h.property}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{h.area}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded border ${WEBSITE_COLORS[h.website] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                        {h.website}
                      </span>
                      <Stars count={h.starRating} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`font-bold text-base ${isOverBudget ? 'text-orange-400' : 'text-gold'}`}>
                      ₹{effective.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {h.taxesIncluded ? 'taxes incl.' : '+GST'}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">{isExpanded ? '▲' : '▼'} details</span>
                  </div>
                </div>
              </button>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex flex-col gap-2 text-xs text-gray-400"
                >
                  <div><span className="text-gray-500">Room Setup:</span> {h.roomSetup}</div>
                  <div>
                    <span className="text-gray-500">Private Beach: </span>
                    <span className="text-teal/80">✓ </span>{h.privateBeachProof}
                  </div>
                  <div><span className="text-gray-500">Cancellation:</span> {h.cancellationPolicy}</div>
                  {h.notes && <div><span className="text-gray-500">Notes:</span> {h.notes}</div>}
                  <a
                    href={h.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex w-fit items-center gap-1 text-xs px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 rounded-lg transition-colors"
                  >
                    Book on {h.website} ↗
                  </a>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
