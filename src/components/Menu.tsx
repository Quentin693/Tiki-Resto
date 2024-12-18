"use client"

export default function Menu() {

  const specialMenus = [
    {
      name: "Menu Grenouilles à Volonté",
      price: "35€",
      items: [
        "Entrée au choix parmi la carte",
        "Grenouilles à volonté persillées ou sauce crémeuse",
        "Dessert au choix parmi la carte"
      ],
      info: "les soirs uniquement",
      highlight: true // Pour le mettre en évidence
    },
    {
      name: "Menu Affaires",
      price: "24€",
      items: [
        "Entrée au choix parmi la carte",
        "Plat au choix parmi la carte",
        "Dessert au choix parmi la carte"
      ],
      info: "Du lundi au vendredi midi uniquement"
    }
  ];

  return (
    <section className="mb-20">
        <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Nos Menus</h2>
        <div className="w-24 h-1 bg-[#C4B5A2] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {specialMenus.map((menu, index) => (
            <div 
            key={index}
            className={`
                bg-[#2a2a2a] rounded-xl p-8 border-2
                ${menu.highlight 
                ? 'border-[#C4B5A2] shadow-lg shadow-[#C4B5A2]/10' 
                : 'border-gray-800'
                }
            `}
            >
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">{menu.name}</h3>
                <span className="text-2xl font-bold text-[#C4B5A2]">{menu.price}</span>
            </div>
            
            <ul className="space-y-3 mb-6">
                {menu.items.map((item, idx) => (
                <li key={idx} className="flex items-baseline gap-2">
                    <span className="text-[#C4B5A2]">•</span>
                    <span className="text-gray-300">{item}</span>
                </li>
                ))}
            </ul>

            {menu.info && (
                <p className="text-sm text-gray-400 italic mt-4 border-t border-#C4B5A2 pt-4">
                {menu.info}
                </p>
            )}
            </div>
        ))}
        </div>
    </section>
  );
}