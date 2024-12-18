"use client"

export default function Wine () {
    const wines = {
        rouges: [
          {
            name: "Côtes du Rhône",
            region: "Vallée du Rhône",
            price: {
              bottle: "28€",
              glass: "6€"
            }
          },
          {
            name: "Saint-Joseph",
            region: "Vallée du Rhône",
            price: {
              bottle: "45€",
              glass: "8€"
            }
          },
          {
            name: "Brouilly",
            region: "Beaujolais",
            price: {
              bottle: "32€",
              glass: "7€"
            }
          }
        ],
        blancs: [
          {
            name: "Pouilly-Fuissé",
            region: "Bourgogne",
            price: {
              bottle: "42€",
              glass: "8€"
            }
          },
          {
            name: "Viognier",
            region: "Vallée du Rhône",
            price: {
              bottle: "34€",
              glass: "7€"
            }
          },
          {
            name: "Chablis",
            region: "Bourgogne",
            price: {
              bottle: "38€",
              glass: "7€"
            }
          }
        ],
        roses: [
          {
            name: "Côtes de Provence",
            region: "Provence",
            price: {
              bottle: "32€",
              glass: "6€"
            }
          },
          {
            name: "Tavel",
            region: "Vallée du Rhône",
            price: {
              bottle: "36€",
              glass: "7€"
            }
          }
        ],
        champagnes: [
          {
            name: "Moët & Chandon",
            region: "Champagne",
            price: {
              bottle: "85€",
              glass: "12€"
            }
          },
          {
            name: "Veuve Clicquot",
            region: "Champagne",
            price: {
              bottle: "95€"
            }
          }
        ]
      };
    return (
        <section className="mb-20">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">Notre Carte des Vins</h2>
                <div className="w-24 h-1 bg-[#C4B5A2] mx-auto mb-8"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Vins Rouges */}
                <div>
                <h3 className="text-2xl font-bold mb-6 text-[#C4B5A2]">Vins Rouges</h3>
                <div className="space-y-6">
                    {wines.rouges.map((wine, index) => (
                    <div key={index} className="border-b border-[#C4B5A2]/20 pb-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-lg font-semibold">{wine.name}</h4>
                            <p className="text-gray-400 text-sm">{wine.region}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#C4B5A2]">{wine.price.bottle}</p>
                            {wine.price.glass && (
                            <p className="text-sm text-gray-400">Verre : {wine.price.glass}</p>
                            )}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {/* Vins Blancs */}
                <div>
                <h3 className="text-2xl font-bold mb-6 text-[#C4B5A2]">Vins Blancs</h3>
                <div className="space-y-6">
                    {wines.blancs.map((wine, index) => (
                    <div key={index} className="border-b border-[#C4B5A2]/20 pb-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-lg font-semibold">{wine.name}</h4>
                            <p className="text-gray-400 text-sm">{wine.region}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#C4B5A2]">{wine.price.bottle}</p>
                            {wine.price.glass && (
                            <p className="text-sm text-gray-400">Verre : {wine.price.glass}</p>
                            )}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {/* Vins Rosés */}
                <div>
                <h3 className="text-2xl font-bold mb-6 text-[#C4B5A2]">Vins Rosés</h3>
                <div className="space-y-6">
                    {wines.roses.map((wine, index) => (
                    <div key={index} className="border-b border-[#C4B5A2]/20 pb-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-lg font-semibold">{wine.name}</h4>
                            <p className="text-gray-400 text-sm">{wine.region}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#C4B5A2]">{wine.price.bottle}</p>
                            {wine.price.glass && (
                            <p className="text-sm text-gray-400">Verre : {wine.price.glass}</p>
                            )}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {/* Champagnes */}
                <div>
                <h3 className="text-2xl font-bold mb-6 text-[#C4B5A2]">Champagnes</h3>
                <div className="space-y-6">
                    {wines.champagnes.map((wine, index) => (
                    <div key={index} className="border-b border-[#C4B5A2]/20 pb-4">
                        <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-lg font-semibold">{wine.name}</h4>
                            <p className="text-gray-400 text-sm">{wine.region}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[#C4B5A2]">{wine.price.bottle}</p>
                            {wine.price.glass && (
                            <p className="text-sm text-gray-400">Verre : {wine.price.glass}</p>
                            )}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
        </section>
    );
}