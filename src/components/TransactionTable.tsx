import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';
import { Search, ArrowDownLeft, ArrowUpRight, Filter, Download, ChevronRight } from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { useAccessibility } from '../context/AccessibilityContext';

interface TransactionTableProps {
  limit?: number;
  showFilters?: boolean;
  title?: string;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  limit,
  showFilters = true,
  title = 'Recent Transactions',
}) => {
  const { transactions, formatCurrency } = useBanking();
  const { announce } = useAccessibility();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(limit || 10);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.recipientOrSender && tx.recipientOrSender.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = typeFilter === 'ALL' || tx.type === typeFilter;
      const matchStatus = statusFilter === 'ALL' || tx.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter]);

  const displayed = useMemo(() => {
    return limit ? filtered.slice(0, visibleCount) : filtered.slice(0, visibleCount);
  }, [filtered, limit, visibleCount]);

  const handleDownloadCsv = () => {
    announce('Exported transactions list to CSV');
    const headers = ['Date', 'Time', 'Description', 'Type', 'Amount', 'Status', 'Reference'];
    const rows = filtered.map(t => [t.date, t.time, `"${t.description}"`, t.type, t.amount, t.status, t.referenceId]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SBI_NETRA_Statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DCE8FA] shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-[#DCE8FA] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#102451]">{title}</h3>
          <p className="text-xs text-[#64748B]">
            Showing {displayed.length} of {filtered.length} entries with instant audit trail
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="pl-9 pr-3 py-1.5 text-xs bg-[#F5F8FF] border border-[#DCE8FA] rounded-lg text-[#102451] placeholder:text-[#64748B] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5] w-48 sm:w-60"
                aria-label="Filter transactions by text"
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-[#F5F8FF] rounded-lg border border-[#DCE8FA]">
              <button
                type="button"
                onClick={() => setTypeFilter('ALL')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  typeFilter === 'ALL'
                    ? 'bg-white text-[#1458F5] shadow-xs'
                    : 'text-[#64748B] hover:text-[#102451]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('CREDIT')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  typeFilter === 'CREDIT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-[#64748B] hover:text-emerald-700'
                }`}
              >
                Credits
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('DEBIT')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  typeFilter === 'DEBIT'
                    ? 'bg-[#082B78] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#082B78]'
                }`}
              >
                Debits
              </button>
            </div>

            {/* Export CSV button */}
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="p-1.5 text-[#1458F5] hover:bg-[#EDF5FF] rounded-lg border border-[#DCE8FA] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download CSV Statement"
              aria-label="Download transactions CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        )}
      </div>

      {/* Transactions Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs" aria-label="Transactions Table">
          <thead>
            <tr className="bg-[#F5F8FF] border-b border-[#DCE8FA] text-[#64748B] font-semibold">
              <th scope="col" className="py-3 px-4">Transaction / Date</th>
              <th scope="col" className="py-3 px-4 hidden sm:table-cell">Reference ID</th>
              <th scope="col" className="py-3 px-4 hidden md:table-cell">Category</th>
              <th scope="col" className="py-3 px-4 text-right">Amount</th>
              <th scope="col" className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE8FA]">
            {displayed.length > 0 ? (
              displayed.map((tx) => {
                const isCredit = tx.type === 'CREDIT';
                return (
                  <tr key={tx.id} className="hover:bg-[#F5F8FF]/80 transition-colors group">
                    {/* Description & Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isCredit
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-[#1458F5] border border-blue-200'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#102451] group-hover:text-[#1458F5] transition-colors line-clamp-1">
                            {tx.description}
                          </div>
                          <div className="text-[11px] text-[#64748B]">
                            {tx.date} · {tx.time}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Reference ID */}
                    <td className="py-3.5 px-4 hidden sm:table-cell font-mono text-[11px] text-[#64748B]">
                      {tx.referenceId}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-[11px] font-semibold text-[#64748B] bg-[#F5F8FF] px-2 py-0.5 rounded border border-[#DCE8FA]">
                        {tx.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right">
                      <div
                        className={`font-mono text-sm font-bold tabular-nums ${
                          isCredit ? 'text-emerald-700' : 'text-[#102451]'
                        }`}
                      >
                        {isCredit ? '+ ' : '- '}
                        {formatCurrency(tx.amount)}
                      </div>
                      <div className="text-[10px] text-[#64748B] tabular-nums">
                        Bal: {formatCurrency(tx.balanceAfter)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#64748B]">
                  <p className="text-sm font-semibold">No transactions found</p>
                  <p className="text-xs mt-1">Try adjusting your search terms or filter selection.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('ALL');
                      setStatusFilter('ALL');
                    }}
                    className="mt-3 text-xs text-[#1458F5] hover:underline font-bold"
                  >
                    Reset Filters
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Load More / Footer Bar */}
      {filtered.length > visibleCount && (
        <div className="p-3 border-t border-[#DCE8FA] bg-[#F5F8FF] text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="text-xs font-bold text-[#1458F5] hover:text-[#082B78] py-1 px-3 rounded-lg hover:bg-[#EDF5FF] transition-colors"
          >
            Load More Transactions ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
