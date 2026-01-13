import { Scissors, Sparkles, Wind, Eraser } from 'lucide-react';

import BookButton from '../components/BookButton';

export default function Pricing() {
    const serviceCategories = [
        {
            category: "Haircuts",
            icon: <Scissors className="text-[#ED1B24]" size={24} />,
            services: [
                { name: "Men's", price: "$18" },
                { name: "Women's (Short Hair)", price: "$21" },
                { name: "Women's (Medium Hair)", price: "$25" },
                { name: "Women's (Long Hair)", price: "$28+" },
                { name: "Men's (Senior)", price: "$16.50" },
                { name: "Women's (Senior)", price: "$20" },
                { name: "Kids (Under 3)", price: "$10" },
                { name: "Boys (Under 13)", price: "$14.50" },
                { name: "Girls (Under 13)", price: "$18" }
            ]
        },
        {
            category: "Styling & Perm",
            icon: <Wind className="text-[#0078c4]" size={24} />,
            services: [
                { name: "Perm", price: "$85+" },
                { name: "Straightening", price: "$180+" }
            ]
        },
        {
            category: "Color",
            icon: <Sparkles className="text-[#FEF200]" size={24} />,
            services: [
                { name: "Color", price: "$45+" },
                { name: "Highlights", price: "$55+" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F9F8F6] py-20 px-6 font-sans">
            <div className="max-w-5xl mx-auto">
                
                {/* --- HEADER --- */}
                <div className="mb-16">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-12 bg-[#FEF200]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Menu of Services</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-[#ED1B24] leading-none">
                        PRICING <br />
                        <span className="text-[#0078c4]">LIST.</span>
                    </h1>
                </div>

                {/* --- PRICING GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceCategories.map((group, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                                    {group.icon}
                                </div>
                                <h2 className="text-xl font-black italic uppercase tracking-tight">
                                    {group.category}
                                </h2>
                            </div>

                            <ul className="space-y-6">
                                {group.services.map((service, sIdx) => (
                                    <li key={sIdx} className="flex justify-between items-end gap-2 group/item">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800 group-hover/item:text-[#ED1B24] transition-colors">
                                                {service.name}
                                            </p>
                                            <div className="h-px w-full bg-gray-100 mt-1"></div>
                                        </div>
                                        <span className="font-black text-lg italic text-[#0078c4]">
                                            {service.price}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 bg-white/50 border-2 border-dashed border-gray-200 rounded-[2rem] text-center">
                    <p className="text-sm text-gray-400 font-medium italic">
                        $12 only if your request for simple cut like shave it bald or <br />
                        simple trim upon looking at your hair style <br />
                        GST Included
                    </p>
                </div>

                {/* --- CTA --- */}
                <div className="mt-12 text-center">
                    <BookButton className="inline-block px-12 py-5 bg-[#ED1B24] text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg hover:-translate-y-1 uppercase tracking-widest italic text-sm" />
                </div>
            </div>
        </div>
    );
}