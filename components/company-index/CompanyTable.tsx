'use client';

import React from 'react';
import { Company } from '@/types/company';
import { Building2, Phone, Mail, Globe, MapPin, Download, FileText } from 'lucide-react';

interface CompanyTableProps {
    companies: Company[];
    onGenerateCallSheet: () => void;
    onExportCSV: () => void;
}

export default function CompanyTable({ companies, onGenerateCallSheet, onExportCSV }: CompanyTableProps) {
    return (
        <div className="bg-white dark:bg-[#0d0d0d] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Market Index</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {companies.length} companies matched in your area
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onExportCSV}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                        <Download size={14} /> Export CSV
                    </button>
                    <button
                        onClick={onGenerateCallSheet}
                        className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                    >
                        <FileText size={14} /> Generate Call Sheet
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-800">
                            <th className="pb-4 pr-4">Company</th>
                            <th className="pb-4 pr-4">Distance</th>
                            <th className="pb-4 pr-4">Phone</th>
                            <th className="pb-4 pr-4">Email</th>
                            <th className="pb-4 pr-4">Website</th>
                            <th className="pb-4 pr-4 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(company => (
                            <tr key={company.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-black/20 transition-colors group">
                                <td className="py-4 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                            <Building2 size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm leading-tight">{company.name}</div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">{company.city}, {company.zip}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 pr-4">
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-400">
                                        <MapPin size={12} className="text-gray-400" />
                                        {company.distance} mi
                                    </div>
                                </td>
                                <td className="py-4 pr-4 text-xs font-medium text-gray-500">
                                    {company.phone}
                                </td>
                                <td className="py-4 pr-4 text-xs italic text-gray-400 underline decoration-gray-200 underline-offset-4">
                                    {company.email}
                                </td>
                                <td className="py-4 pr-4">
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                                        <Globe size={16} />
                                    </a>
                                </td>
                                <td className="py-4 text-right">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black ${company.score >= 90 ? 'bg-green-100 text-green-700' :
                                            company.score >= 80 ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {company.score}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
