"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import { ArrowUpRight, ArrowDownRight, Plus, Wallet, Activity, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { getShieldedBalance } from "@/lib/light";
import { PublicKey } from "@solana/web3.js";

interface Transaction {
    id: string;
    amount: number;
    timestamp: string;
    signature: string;
    status: string;
    is_withdrawn: boolean;
    link_id: string | null;
    link_exists?: boolean;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalReceived: 0,
        activeLinks: 0,
        poolBalance: 0,
        monthlyGrowth: 0,
        linkLimit: 10,
        tier: 'free' as 'free' | 'pro' | 'enterprise'
    });
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

    // Fetch Stats
    // Fetch Stats
    useEffect(() => {
        async function fetchStats() {
            if (!user?.id) return;

            try {
                // Get user info for tier
                const { data: userData } = await supabase
                    .from('users')
                    .select('tier')
                    .eq('id', user.id)
                    .single();

                const userTier = (userData?.tier || 'free') as 'free' | 'pro' | 'enterprise';

                // Set link limits based on tier
                const linkLimits = {
                    free: 10,
                    pro: 50,
                    enterprise: 999
                };

                // 1. Get Links from 'links' table (the actual user links)
                const { data: userLinks, error: linksError } = await supabase
                    .from('links')
                    .select('id, stealth_public_key, created_at')
                    .eq('owner_id', user.public_key);

                if (linksError) {
                }

                const links = userLinks || [];
                const activeLinksCount = links.length;

                // 2. Calculate Pool Balance (current on-chain balance)
                let livePoolBalance = 0;

                if (links.length > 0) {
                    const balancePromises = links.map(async (link) => {
                        try {
                            if (!link.stealth_public_key) return 0;
                            const pubKey = new PublicKey(link.stealth_public_key);
                            return await getShieldedBalance(pubKey);
                        } catch (err) {
                            return 0;
                        }
                    });

                    const balances = await Promise.all(balancePromises);
                    livePoolBalance = balances.reduce((acc, curr) => acc + curr, 0);
                }



                // 3. Calculate Total Cleaned (all-time volume)
                let totalWithdrawn = 0;
                let totalThisMonth = 0;
                let totalLastMonth = 0;
                let totalAllTime = 0;

                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

                // Fetch ALL transactions for this user (including from deleted links)
                const { data: allTransactions, error: txError } = await supabase
                    .from('transactions')
                    .select('amount, is_withdrawn, timestamp')
                    .eq('owner_id', user.public_key)
                    .order('timestamp', { ascending: false });

                if (txError) {
                }

                if (allTransactions && allTransactions.length > 0) {
                    allTransactions.forEach(tx => {
                        const amount = Number(tx.amount);

                        // Count ALL transactions towards total (this is total volume received)
                        totalAllTime += amount;

                        // Count all transactions towards monthly totals
                        const txDate = new Date(tx.timestamp);
                        const txMonth = txDate.getMonth();
                        const txYear = txDate.getFullYear();

                        if (tx.is_withdrawn) {
                            totalWithdrawn += amount;

                            if (txMonth === currentMonth && txYear === currentYear) {
                                totalThisMonth += amount;
                            } else if (txMonth === lastMonth && txYear === lastMonthYear) {
                                totalLastMonth += amount;
                            }
                        }
                    });
                }

                // Total Cleaned = Total Withdrawn (Unshielded to wallet)
                let totalReceived = totalWithdrawn;

                // AUTO-SYNC: If on-chain pool is empty but we have "unwithdrawn" transactions,
                // it usually means they were unshielded but the DB didn't update.
                // We show the "Cleaned" amount as Total Received - Live Pool Balance for accuracy.
                if (livePoolBalance === 0 && totalAllTime > 0 && totalWithdrawn === 0) {
                    totalReceived = totalAllTime;
                }

                // Calculate monthly growth percentage
                let monthlyGrowth = 0;
                if (totalReceived > 0) { // Only show growth if we actually have cleaned funds
                    if (totalLastMonth > 0) {
                        monthlyGrowth = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
                    } else if (totalThisMonth > 0) {
                        monthlyGrowth = 100;
                    }
                }

                setStats({
                    totalReceived: Number(totalReceived.toFixed(4)),
                    activeLinks: activeLinksCount,
                    poolBalance: Number(livePoolBalance.toFixed(4)),
                    monthlyGrowth: Number(monthlyGrowth.toFixed(1)),
                    linkLimit: linkLimits[userTier],
                    tier: userTier
                });

            } catch (error) {
            } finally {
                setIsLoadingStats(false);
            }
        }

        fetchStats();
    }, [user?.id]);

    // Fetch Recent Transactions
    useEffect(() => {
        async function fetchTransactions() {
            if (!user?.id) return;

            try {
                // Get user's links to identify active ones vs deleted ones
                const { data: userLinks } = await supabase
                    .from('links')
                    .select('id')
                    .eq('owner_id', user.public_key);

                const activeLinkIds = new Set((userLinks || []).map(l => l.id));

                // Get ALL transactions for user (recent 10)
                const { data: transactions } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('owner_id', user.public_key)
                    .order('timestamp', { ascending: false })
                    .limit(10);

                // Mark which transactions have their links still active
                const transactionsWithLinkStatus = (transactions || []).map(tx => ({
                    ...tx,
                    // If link_id is null, it's definitely deleted. 
                    // If link_id exists but not in activeLinkIds (rare race condition or DB inconsistency), count as valid or check ID. 
                    // Simplest: if link_id is null, it is deleted.
                    link_exists: tx.link_id ? activeLinkIds.has(tx.link_id) : false
                }));

                setRecentTransactions(transactionsWithLinkStatus);

            } catch (error) {
            } finally {
                setIsLoadingTransactions(false);
            }
        }

        fetchTransactions();
    }, [user?.id]);

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-5xl font-display text-white">Dash<span className="text-[#facc15]">board</span></h1>
                    <p className="text-zinc-400">Welcome back, {user?.display_name || "Ghost"}.</p>
                </div>
                <Link
                    href="/dashboard/links"
                    className="inline-flex items-center gap-2 bg-neon-pink text-white px-6 py-3 rounded-xl font-medium hover:bg-neon-pink/80 transition-colors w-fit"
                >
                    <Plus className="w-5 h-5" />
                    Create New Blink
                </Link>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-12 h-12 text-neon-pink" />
                    </div>
                    <p className="text-zinc-400 text-sm mb-1">Total Cleaned</p>
                    {isLoadingStats ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                            <span className="text-2xl font-display text-zinc-600">Loading...</span>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-4xl font-display text-white">{stats.totalReceived} SOL</h3>
                            <div className="mt-4 text-xs text-zinc-500 flex items-center gap-1">
                                {stats.monthlyGrowth >= 0 ? (
                                    <>
                                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                                        <span className="text-green-500">+{stats.monthlyGrowth}%</span>
                                    </>
                                ) : (
                                    <>
                                        <ArrowDownRight className="w-3 h-3 text-red-500" />
                                        <span className="text-red-500">{stats.monthlyGrowth}%</span>
                                    </>
                                )}
                                this month
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-12 h-12 text-cyan-400" />
                    </div>
                    <p className="text-zinc-400 text-sm mb-1">Active Links</p>
                    {isLoadingStats ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                            <span className="text-2xl font-display text-zinc-600">Loading...</span>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-4xl font-display text-white">{stats.activeLinks}/{stats.linkLimit}</h3>
                            <div className="mt-4 text-xs text-zinc-500">
                                {stats.tier === 'free' && 'Free Tier'}
                                {stats.tier === 'pro' && 'Pro Tier'}
                                {stats.tier === 'enterprise' && 'Enterprise Tier'}
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-12 h-12 text-neon-yellow" />
                    </div>
                    <p className="text-zinc-400 text-sm mb-1">Pool Balance</p>
                    {isLoadingStats ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                            <span className="text-2xl font-display text-zinc-600">Loading...</span>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-4xl font-display text-white">{stats.poolBalance} SOL</h3>
                            <div className="mt-4 text-xs text-zinc-500">
                                Available to withdraw
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display text-white">Recent Activity</h2>
                    <Link
                        href="/dashboard/pool"
                        className="text-sm text-neon-pink hover:text-neon-pink/80 transition-colors"
                    >
                        View All
                    </Link>
                </div>

                {isLoadingTransactions ? (
                    <div className="flex flex-col items-center justify-center min-h-[300px]">
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-500 mb-3" />
                        <p className="text-zinc-500">Loading transactions...</p>
                    </div>
                ) : recentTransactions.length === 0 ? (
                    <div className="text-center min-h-[300px] flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Activity className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-xl font-display text-white mb-2">No Recent Activity</h3>
                        <p className="text-zinc-400 max-w-sm mx-auto">
                            Transactions will appear here once you start receiving payments through your Blinks.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentTransactions.map((tx) => {
                            // Determine color based on link status and withdrawal status
                            const isOrphanTransaction = !tx.link_exists;
                            const accentColor = isOrphanTransaction
                                ? 'yellow' // Link was deleted
                                : 'green'; // Link still exists

                            return (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.is_withdrawn
                                            ? 'bg-orange-500/20'
                                            : accentColor === 'yellow'
                                                ? 'bg-yellow-500/20'
                                                : 'bg-green-500/20'
                                            }`}>
                                            {tx.is_withdrawn ? (
                                                <ArrowUpRight className="w-5 h-5 text-orange-400" />
                                            ) : (
                                                <ArrowDownRight className={`w-5 h-5 ${accentColor === 'yellow' ? 'text-yellow-400' : 'text-green-400'
                                                    }`} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {tx.is_withdrawn ? 'Withdrawn' : 'Received'}
                                                {isOrphanTransaction && !tx.is_withdrawn && (
                                                    <span className="ml-2 text-xs text-yellow-400">(Link Deleted)</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {new Date(tx.timestamp).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-display text-lg ${tx.is_withdrawn
                                            ? 'text-orange-400'
                                            : accentColor === 'yellow'
                                                ? 'text-yellow-400'
                                                : 'text-green-400'
                                            }`}>
                                            {tx.is_withdrawn ? '-' : '+'}{Number(tx.amount).toFixed(4)} SOL
                                        </p>
                                        <a
                                            href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-zinc-500 hover:text-neon-pink transition-colors"
                                        >
                                            View on Explorer
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}