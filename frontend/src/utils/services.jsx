import { Scissors, Wind, Sparkles } from "lucide-react";

export const SERVICE_CATEGORIES = [
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