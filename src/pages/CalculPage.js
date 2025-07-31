import React, { useState } from 'react';
import { Ship, Calculator, MapPin } from 'lucide-react';
import '../assets/styles/CalculPage.css';

const CalculPage = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    carrier: '',
    oceanFreight: ''
  });

  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [showCalculations, setShowCalculations] = useState(false);

  const freightData = [
{ origin: 'Antwerp', destination: 'Algier', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Rotterdam', destination: 'Algier', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Hamburg', destination: 'Algier', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Antwerp', destination: 'Annaba', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Antwerp', destination: 'Annaba', carrier: 'MC', oceanFreight: 1550 },//test
{ origin: 'Rotterdam', destination: 'Annaba', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Hamburg', destination: 'Annaba', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Antwerp', destination: 'Skikda', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Rotterdam', destination: 'Skikda', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Hamburg', destination: 'Skikda', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Antwerp', destination: 'Oran', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Rotterdam', destination: 'Oran', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Hamburg', destination: 'Oran', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Antwerp', destination: 'Bejaia', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Rotterdam', destination: 'Bejaia', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Hamburg', destination: 'Bejaia', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Antwerp', destination: 'Djen Djen', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Rotterdam', destination: 'Djen Djen', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Hamburg', destination: 'Djen Djen', carrier: 'MSC', oceanFreight: 1650 },
{ origin: 'Antwerp', destination: 'Tunis', carrier: 'MSC', oceanFreight: 1375 },
{ origin: 'Rotterdam', destination: 'Tunis', carrier: 'MSC', oceanFreight: 1375 },
{ origin: 'Hamburg', destination: 'Tunis', carrier: 'MSC', oceanFreight: 1500 },
{ origin: 'Antwerp', destination: 'Algier', carrier: 'CMA CGM', oceanFreight: 1125 },
{ origin: 'Rotterdam', destination: 'Algier', carrier: 'CMA CGM', oceanFreight: 1125 },
{ origin: 'Hamburg', destination: 'Algier', carrier: 'CMA CGM', oceanFreight: 1125 },
{ origin: 'Antwerp', destination: 'Annaba', carrier: 'CMA CGM', oceanFreight: 1125 },
{ origin: 'Rotterdam', destination: 'Annaba', carrier: 'CMA CGM', oceanFreight: 1125 },
{ origin: 'Hamburg', destination: 'Annaba', carrier: 'CMA CGM', oceanFreight: 1125 },
{ origin: 'Antwerp', destination: 'Skikda', carrier: 'CMA CGM', oceanFreight: 1125 },
{ origin: 'Rotterdam', destination: 'Skikda', carrier: 'CMA CGM', oceanFreight: 1125 },
{ origin: 'Hamburg', destination: 'Skikda', carrier: 'CMA CGM', oceanFreight: 1125 },
{ origin: 'Antwerp', destination: 'Sfax', carrier: 'CMA CGM', oceanFreight: 1500 },
{ origin: 'Rotterdam', destination: 'Sfax', carrier: 'CMA CGM', oceanFreight: 1500 },
{ origin: 'Hamburg', destination: 'Sfax', carrier: 'CMA CGM', oceanFreight: 1500 },
{ origin: 'Antwerp', destination: 'Sousse', carrier: 'CMA CGM', oceanFreight: 1500 },
{ origin: 'Rotterdam', destination: 'Sousse', carrier: 'CMA CGM', oceanFreight: 1500 },
{ origin: 'Hamburg', destination: 'Sousse', carrier: 'CMA CGM', oceanFreight: 1500 },
{ origin: 'Antwerp', destination: 'Casablanca', carrier: 'CMA CGM', oceanFreight: 825 },
{ origin: 'Rotterdam', destination: 'Casablanca', carrier: 'CMA CGM', oceanFreight: 825 },
{ origin: 'Hamburg', destination: 'Casablanca', carrier: 'CMA CGM', oceanFreight: 825 },
{ origin: 'Antwerp', destination: 'Misuratra', carrier: 'MSC', oceanFreight: 2050 },
{ origin: 'Rotterdam', destination: 'Misuratra', carrier: 'MSC', oceanFreight: 2050 },
{ origin: 'Hamburg', destination: 'Misuratra', carrier: 'CMA CGM', oceanFreight: 1900 },
{ origin: 'Antwerp', destination: 'Ghazaouet', carrier: 'CMA CGM', oceanFreight: 2000 },
{ origin: 'Hamburg', destination: 'Ghazaouet', carrier: 'CMA CGM', oceanFreight: 2000 },
{ origin: 'Antwerp', destination: 'Mombasa', carrier: 'MSC', oceanFreight: 1600 },
{ origin: 'Rotterdam', destination: 'Mombasa', carrier: 'MSC', oceanFreight: 1600 },
{ origin: 'Hamburg', destination: 'Mombasa', carrier: 'MSC', oceanFreight: 1600 },
{ origin: 'Antwerp', destination: 'Dar es Salam', carrier: 'MSC', oceanFreight: 1600 },
{ origin: 'Rotterdam', destination: 'Dar es Salam', carrier: 'MSC', oceanFreight: 1600 },
{ origin: 'Hamburg', destination: 'Dar es Salam', carrier: 'MSC', oceanFreight: 1600 },
{ origin: 'Antwerp', destination: 'Tema', carrier: 'CMA CGM', oceanFreight: 1385 },
{ origin: 'Rotterdam', destination: 'Tema', carrier: 'CMA CGM', oceanFreight: 1385 },
{ origin: 'Hamburg', destination: 'Tema', carrier: 'CMA CGM', oceanFreight: 1385 },
{ origin: 'Antwerp', destination: 'Abidjan', carrier: 'CMA CGM', oceanFreight: 1385 },
{ origin: 'Rotterdam', destination: 'Abidjan', carrier: 'CMA CGM', oceanFreight: 1385 },
{ origin: 'Hamburg', destination: 'Abidjan', carrier: 'CMA CGM', oceanFreight: 1385 },
{ origin: 'Antwerp', destination: 'Dakar', carrier: 'CMA CGM', oceanFreight: 1600 },
{ origin: 'Rotterdam', destination: 'Dakar', carrier: 'CMA CGM', oceanFreight: 1600 },
{ origin: 'Hamburg', destination: 'Dakar', carrier: 'CMA CGM', oceanFreight: 1600 },
{ origin: 'Antwerp', destination: 'Lome', carrier: 'MSC', oceanFreight: 2525 },
{ origin: 'Rotterdam', destination: 'Lome', carrier: 'Grimaldi', oceanFreight: 2925 },
{ origin: 'Hamburg', destination: 'Lome', carrier: 'Grimaldi', oceanFreight: 2925 },
{ origin: 'Antwerp', destination: 'Douala', carrier: 'MSC', oceanFreight: 2400 },
{ origin: 'Rotterdam', destination: 'Douala', carrier: 'MSC', oceanFreight: 2400 },
{ origin: 'Hamburg', destination: 'Douala', carrier: 'MSC', oceanFreight: 2450 },
{ origin: 'Antwerp', destination: 'Lagos/Tincan', carrier: 'MSC', oceanFreight: 1800 },
{ origin: 'Rotterdam', destination: 'Lagos/Tincan', carrier: 'MSC', oceanFreight: 1800 },
{ origin: 'Hamburg', destination: 'Lagos/Tincan', carrier: 'MSC', oceanFreight: 1835 },
{ origin: 'Antwerp', destination: 'Lekki', carrier: 'CMA CGM', oceanFreight: 1575 },
{ origin: 'Rotterdam', destination: 'Lekki', carrier: 'CMA CGM', oceanFreight: 1575 },
{ origin: 'Hamburg', destination: 'Lekki', carrier: 'CMA CGM', oceanFreight: 1575 },
{ origin: 'Antwerp', destination: 'Apapa', carrier: 'CMA CGM', oceanFreight: 1625 },
{ origin: 'Rotterdam', destination: 'Apapa', carrier: 'CMA CGM', oceanFreight: 1625 },
{ origin: 'Hamburg', destination: 'Apapa', carrier: 'CMA CGM', oceanFreight: 1625 },
{ origin: 'Antwerp', destination: 'Luanda', carrier: 'CMA CGM', oceanFreight: 1675 },
{ origin: 'Rotterdam', destination: 'Luanda', carrier: 'CMA CGM', oceanFreight: 1675 },
{ origin: 'Hamburg', destination: 'Luanda', carrier: 'CMA CGM', oceanFreight: 1675 },
{ origin: 'Antwerp', destination: 'Monrovia', carrier: 'Grimaldi', oceanFreight: 3700 },
{ origin: 'Rotterdam', destination: 'Monrovia', carrier: 'Grimaldi', oceanFreight: 3700 },
{ origin: 'Hamburg', destination: 'Monrovia', carrier: 'Grimaldi', oceanFreight: 3700 },
{ origin: 'Antwerp', destination: 'Durban', carrier: 'MSC', oceanFreight: 1000 },
{ origin: 'Rotterdam', destination: 'Durban', carrier: 'MSC', oceanFreight: 1000 },
{ origin: 'Hamburg', destination: 'Durban', carrier: 'MSC', oceanFreight: 1125 },
{ origin: 'Antwerp', destination: 'Cape Town', carrier: 'MSC', oceanFreight: 1000 },
{ origin: 'Rotterdam', destination: 'Cape Town', carrier: 'MSC', oceanFreight: 1000 },
{ origin: 'Hamburg', destination: 'Cape Town', carrier: 'MSC', oceanFreight: 1125 },
{ origin: 'Antwerp', destination: 'Port Elisabeth', carrier: 'MSC', oceanFreight: 1000 },
{ origin: 'Rotterdam', destination: 'Port Elisabeth', carrier: 'MSC', oceanFreight: 1000 },
{ origin: 'Hamburg', destination: 'Port Elisabeth', carrier: 'MSC', oceanFreight: 1125 },
{ origin: 'Antwerp', destination: 'Agadir', carrier: 'Maersk', oceanFreight: 1100 },
{ origin: 'Rotterdam', destination: 'Agadir', carrier: 'Maersk', oceanFreight: 1100 },
{ origin: 'Hamburg', destination: 'Agadir', carrier: 'Maersk', oceanFreight: 1100 },
{ origin: 'Antwerp', destination: 'Tanger', carrier: 'CMA CGM', oceanFreight: 900 },
{ origin: 'Rotterdam', destination: 'Tanger', carrier: 'CMA CGM', oceanFreight: 900 },
{ origin: 'Hamburg', destination: 'Tanger', carrier: 'CMA CGM', oceanFreight: 900 },
{ origin: 'Hamburg', destination: 'Tanger', carrier: 'MSC', oceanFreight: 800 }

  ];

  const fixedRatesAntwerp = {
    thcOrigin: 200.00,
    containerPreCollection: 255.00,
    dischCost: 118.75,
    stowage: 118.75,
    tonWeight: 25 ////
  };

  const fixedRatesHamburg = {
  thcOrigin: 250.00,
  stowage: 650.00,
  tonWeight: 25 ////
};

  // Extraire les valeurs uniques
  const origins = [...new Set(freightData.map(item => item.origin))];
  const destinations = [...new Set(freightData.map(item => item.destination))];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setShowCalculations(false);
  };

  const searchRoutes = () => {
    if (!formData.origin || !formData.destination) return;
    
    const matchingRoutes = freightData.filter(route => 
      route.origin === formData.origin &&
      route.destination === formData.destination
    );
    
    setAvailableRoutes(matchingRoutes);
    setShowCalculations(true);
  };

 const calculateTotal = (oceanFreight, origin) => {
  const isHamburg = origin === 'Hamburg';

  const thcOrigin = isHamburg ? fixedRatesHamburg.thcOrigin : fixedRatesAntwerp.thcOrigin;
  const stowage = isHamburg ? fixedRatesHamburg.stowage : fixedRatesAntwerp.stowage;
  const containerPreCollection = isHamburg ? 0 : fixedRatesAntwerp.containerPreCollection;
  const dischCost = isHamburg ? 0 : fixedRatesAntwerp.dischCost;
  const tonWeight = isHamburg ? fixedRatesHamburg.tonWeight : fixedRatesAntwerp.tonWeight;

  const allInByContainer = isHamburg
    ? oceanFreight + thcOrigin + stowage
    : oceanFreight + thcOrigin + containerPreCollection + dischCost + stowage;

  const allInByTon = allInByContainer / tonWeight;

  return {
    oceanFreight,
    thcOrigin,
    containerPreCollection: isHamburg ? null : containerPreCollection,
    dischCost: isHamburg ? null : dischCost,
    stowage,
    allInByContainer,
    allInByTon
  };
};


  const isFormValid = () => {
    return formData.origin && formData.destination;
  };

  const CarrierProposal = ({ route, index }) => {
    const calculation = calculateTotal(route.oceanFreight, route.origin);
    
    return (
      <div className="proposal-card">
        <div className="proposal-header">
          <h3 className="proposal-title">
            <Ship className="title-icon" />
            {/* Proposition {index + 1} - {route.carrier} */}
            Proposition {index + 1}
          </h3>
          <div className="carrier-badge">
            {route.carrier}
          </div>
        </div>

        {/* Tableau de calcul */}
        <div className="calculation-table">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="table-label">Ocean freight</td>
              <td className="table-value">
                {calculation.oceanFreight.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </td>
            </tr>
            <tr>
              <td className="table-label">THC Origin</td>
              <td className="table-value">
                {calculation.thcOrigin.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </td>
            </tr>
            {calculation.containerPreCollection !== null && (
              <tr>
                <td className="table-label">Container Pre-collection</td>
                <td className="table-value">
                  {calculation.containerPreCollection.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </td>
              </tr>
            )}
            {calculation.dischCost !== null && (
              <tr>
                <td className="table-label">Disch. Cost</td>
                <td className="table-value">
                  {calculation.dischCost.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </td>
              </tr>
            )}
            <tr>
              <td className="table-label">Stowage</td>
              <td className="table-value">
                {calculation.stowage.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </td>
            </tr>
            <tr className="table-total-container">
              <td className="table-total-label">ALL IN BY CONTAINER</td>
              <td className="table-total-value">
                {calculation.allInByContainer.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </td>
            </tr>
            <tr className="table-ton-container">
              <td className="table-ton-label">ALL IN BY TON</td>
              <td className="table-ton-value">
                {calculation.allInByTon.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </td>
            </tr>
          </tbody>
        </table>
      </div>


        {/* Prix total en évidence */}
        <div className="final-price">
          <div className="text-center">
            <p className="green-label">PRIX TOTAL PAR CONTENEUR</p>
            <p className="text-3xl font-bold text-green-700">
              {calculation.allInByContainer.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </p>
            <p className="text-sm text-green-600 mt-1">
              Soit {calculation.allInByTon.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € par tonne
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Trouver la meilleure offre
  const bestOffer = availableRoutes.length > 0
  ? availableRoutes.reduce((best, current) => {
      const currentCalc = calculateTotal(current.oceanFreight, current.origin);
      const bestCalc = calculateTotal(best.oceanFreight, best.origin);
      return currentCalc.allInByContainer < bestCalc.allInByContainer ? current : best;
    })
  : null;

  return (
    <div className="main-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="header mb-8">
          <div className="header-title">
            <Ship className="ship-icon" />
            <h1>Calculateur de Fret Maritime</h1>
          </div>
        <p className="header-subtitle">Comparez les offres de plusieurs transporteurs</p>
        </div>
        {/* Formulaire de recherche */}
        <div className="form-section">
          <h2 className="proposal-title">
            <Calculator className="card-title-icon" />
            Rechercher des offres
          </h2>

          {/* <div className="grid-custom"> */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Origine */}
            <div>
              <label className="form-label">
                <MapPin className="mappin-icon" />
                Port d'origine
              </label>
              <select 
                className="form-select"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
              >
                <option value="">Sélectionnez le port d'origine</option>
                {origins.map(origin => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="form-label">
                <MapPin className="inline h-4 w-4 mr-1" />
                Port de destination
              </label>
              <select 
                className="form-select"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
              >
                <option value="">Sélectionnez le port de destination</option>
                {destinations.map(destination => (
                  <option key={destination} value={destination}>{destination}</option>
                ))}
              </select>
            </div>

            {/* Bouton Rechercher */}
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
           <button
             onClick={searchRoutes}
             disabled={!isFormValid()}
             className={`btn ${isFormValid() ? 'btn-primary' : ''}`}
           >
             <Calculator className="icon" />
             Valider
             </button>
            </div>
          </div>
        </div>

        {/* Résultats */}
        {showCalculations && (
          <div className="space-y-6">
            {availableRoutes.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="text-orange-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-orange-800 mb-2">Aucune route disponible</h3>
                <p className="text-orange-700">
                  Aucune offre trouvée pour cette combinaison origine/destination.
                </p>
              </div>
            )}

            {availableRoutes.length > 0 && (
              <>
                {/* En-tête des résultats */}
                <div className="results-header">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {formData.origin} → {formData.destination}
                      </h2>
                      <p className="text-gray-600">
                        {availableRoutes.length} offre{availableRoutes.length > 1 ? 's' : ''} disponible{availableRoutes.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    {bestOffer && (
                      <div className="text-right">
                        <p className="text-sm text-green-600">Meilleure offre</p>
                        <p className="text-2xl font-bold text-green-700">
                          {calculateTotal(bestOffer.oceanFreight, bestOffer.origin).allInByContainer.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                        <p className="text-sm text-green-600">{bestOffer.carrier}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Propositions */}
                <div className="grid gap-6">
                  {availableRoutes
                    .sort((a, b) => calculateTotal(a).allInByContainer - calculateTotal(b).allInByContainer)
                    .map((route, index) => (
                      <CarrierProposal key={`${route.carrier}-${index}`} route={route} index={index} />
                    ))
                  }
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
  
export default CalculPage;


