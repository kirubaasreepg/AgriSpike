import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const DISEASE_DB = {
  turmeric: {
    cropName: 'Turmeric (மஞ்சள்)',
    aliases: ['turmeric', 'haldi', 'மஞ்சள்'],
    diseases: [
      {
        name: 'Rhizome Rot (விரல் அழுகல் / கிழங்கு அழுகல்)',
        symptoms: 'Yellowing of lower leaves progressing upwards, water-soaked brown lesions at the pseudostem collar, rotting rhizomes emitting foul odor.',
        prevention: 'Ensure excellent drainage, raise bed planting, avoid waterlogging, and select certified disease-free rhizomes.',
        solution: 'Drench the root zone with Trichoderma viride or spray Copper Oxychloride (0.25%) at the first sign of collar rotting.',
      },
      {
        name: 'Leaf Blotch / Leaf Spot (இலைப்புள்ளி நோய்)',
        symptoms: 'Small rectangular brown spots with yellow halos across older leaves, coalescing into necrotic dry patches.',
        prevention: 'Maintain adequate plant spacing for ventilation and avoid overhead sprinkler splash.',
        solution: 'Foliar spray of Mancozeb (0.2%) or Carbendazim (0.1%) upon early symptom manifestation.',
      },
    ],
  },
  paddy: {
    cropName: 'Paddy / Rice (நெல்)',
    aliases: ['paddy', 'rice', 'நெல்', 'அரிசி'],
    diseases: [
      {
        name: 'Blast Disease (குலை நோய்)',
        symptoms: 'Spindle-shaped lesions with gray-white centers and reddish-brown borders on leaves, rotting of the neck node causing chaffy panicles.',
        prevention: 'Use blast-resistant cultivars (e.g., ADT-43, CO-51), avoid excessive nitrogenous top-dressing.',
        solution: 'Spray Tricyclazole 75% WP @ 0.6 g/L or Kasugamycin @ 1.5 mL/L at the tillering and panicle emergence stages.',
      },
      {
        name: 'Bacterial Leaf Blight (பாக்டீரியா இலைக்கருகல்)',
        symptoms: 'Water-soaked wavy lesions starting from leaf tips down the margins, turning straw-colored.',
        prevention: 'Avoid deep standing water during high humidity, clip seedling tips before transplanting.',
        solution: 'Spray Copper Hydroxide @ 2.5 g/L mixed with Streptomycin sulphate @ 100 mg/L.',
      },
    ],
  },
  banana: {
    cropName: 'Banana (வாழை)',
    aliases: ['banana', 'plantain', 'வாழை', 'வாழைமரம்'],
    diseases: [
      {
        name: 'Panama Wilt / Fusarium Wilt (பனாமா வாடல் நோய்)',
        symptoms: 'Progressive yellowing of lower leaf margins, buckle and collapse of petioles around pseudostem, vascular browning inside trunk.',
        prevention: 'Plant tissue-culture suckers, practice crop rotation with paddy, apply neem cake at planting.',
        solution: 'Uproot and destroy heavily infected clumps. Apply bio-control agent Trichoderma harzianum enriched in farmyard manure.',
      },
    ],
  },
  groundnut: {
    cropName: 'Groundnut (நிலக்கடலை)',
    aliases: ['groundnut', 'peanut', 'நிலக்கடலை', 'வேர்க்கடலை'],
    diseases: [
      {
        name: 'Tikka Leaf Spot (டிக்கா இலைப்புள்ளி நோய்)',
        symptoms: 'Circular dark brown to black spots surrounded by a bright yellow halo on upper leaf surfaces, leading to severe defoliation.',
        prevention: 'Deep summer ploughing, crop rotation with millets, treat seeds with Trichoderma before sowing.',
        solution: 'Foliar spray with Chlorothalonil 75% WP @ 2 g/L or Hexaconazole 5% EC @ 2 mL/L at 15-day intervals.',
      },
    ],
  },
  millets: {
    cropName: 'Millets (சிறுதானியங்கள்)',
    aliases: ['millets', 'millet', 'ragi', 'bajra', 'சிறுதானியங்கள்', 'கேழ்வரகு', 'கம்பு', 'திணை'],
    diseases: [
      {
        name: 'Downy Mildew / Green Ear (அடிச்சாம்பல் நோய்)',
        symptoms: 'Chlorotic striping on upper leaves, whitish downy fungal growth on undersides, transformation of floral head into leafy shoots (green ear).',
        prevention: 'Hot water seed treatment or fungicide seed dressing, rogue out infected plants early.',
        solution: 'Foliar spray of Metalaxyl-Mancozeb @ 2 g/L during vegetative growth.',
      },
    ],
  },
};

export default function Disease() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeResult, setActiveResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    const cleanQuery = searchTerm.trim().toLowerCase();

    if (!cleanQuery) return;

    setHasSearched(true);

    // Search against crop keys and aliases
    const matchedEntry = Object.values(DISEASE_DB).find(crop =>
      crop.aliases.some(alias => cleanQuery.includes(alias) || alias.includes(cleanQuery))
    );

    setActiveResult(matchedEntry || null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>
          {t('diseaseTitle')}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          {t('diseaseSubtitle')}
        </div>
      </div>

      {/* Search Bar Interface */}
      <div className="card" style={{ padding: 20 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={t('searchCropPlaceholder') || 'e.g. Turmeric, Paddy, Banana...'}
            className="input-field"
            style={{ flex: 1, padding: '12px 16px', fontSize: 15 }}
            aria-label="Crop search input"
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0 24px', fontSize: 15, fontWeight: 600 }}
          >
            🔍 {t('searchBtn') || 'Search'}
          </button>
        </form>
      </div>

      {/* Search Results Area */}
      {hasSearched && (
        <div>
          {activeResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
                  {activeResult.cropName} — Disease Profiles
                </h2>
                <span className="badge badge-warning">
                  {activeResult.diseases.length} Diseases Identified
                </span>
              </div>

              {activeResult.diseases.map((d, index) => (
                <div key={index} className="card" style={{ padding: 22, borderLeft: '4px solid var(--accent)' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
                    {d.name}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-fault)' }}>
                        🚨 {t('symptoms')}:{' '}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {d.symptoms}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-warning)' }}>
                        🛡️ {t('prevention')}:{' '}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {d.prevention}
                      </span>
                    </div>

                    <div style={{
                      background: 'var(--bg)',
                      padding: 14,
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      marginTop: 6,
                    }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-online)' }}>
                        💊 {t('recommendedSolution')}:{' '}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                        {d.solution}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{
              textAlign: 'center',
              padding: 36,
              background: 'var(--bg-panel)',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                {t('noDiseaseFound')}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                Please try searching for crops such as Turmeric, Paddy (Rice), Banana, Groundnut, or Millets.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
