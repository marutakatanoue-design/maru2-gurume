import React, { useState, useMemo } from 'react';
import { Utensils, MapPin, MessageCircle, Info, Search, ChefHat, Fish, BookOpen, Soup, Store, X, Map, ChevronDown, ChevronUp } from 'lucide-react';
import { gourmetData } from './data';

const categoryIcons = {
  '麺類': <Soup size={14} />,
  '肉料理': <Utensils size={14} />,
  '和食': <Fish size={14} />,
  '中華・洋食・バー': <ChefHat size={14} />,
  'スイーツ・その他': <Store size={14} />,
};

const categoryColors = {
  '麺類': 'bg-amber-50 text-amber-700 border-amber-200',
  '肉料理': 'bg-red-50 text-red-700 border-red-200',
  '和食': 'bg-blue-50 text-blue-700 border-blue-200',
  '中華・洋食・バー': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'スイーツ・その他': 'bg-pink-50 text-pink-700 border-pink-200',
};

const gourmets = gourmetData.map(item => ({
  ...item,
  icon: categoryIcons[item.category] || <Utensils size={14} />,
  colorClass: categoryColors[item.category] || 'bg-gray-50 text-gray-700 border-gray-200',
}));

const categories = ['すべて', '麺類', '肉料理', '和食', '中華・洋食・バー', 'スイーツ・その他'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeMapQuery, setActiveMapQuery] = useState('日本');

  // Keyboard: Escape to close modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedItem(null);
    };
    if (selectedItem) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedItem]);

  const filteredGourmets = gourmets.filter(item => {
    const isSearching = searchQuery.trim() !== '';
    const matchCategory = isSearching ? true : (selectedCategory === 'すべて' || item.category === selectedCategory);
    const matchSearch = !isSearching || Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchCategory && matchSearch;
  });

  const categoryCounts = useMemo(() => {
    const counts = {};
    gourmets.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    counts['すべて'] = gourmets.length;
    return counts;
  }, []);

  const getTabelogUrl = (name) => `https://tabelog.com/rstLst/?sw=${encodeURIComponent(name)}`;
  const getMapsUrl = (name, location) => {
    const query = location !== '所在地不明' && location !== '市販品' && location !== '所在地記載なし'
      && !location.includes('詳細不明') && !location.includes('設置場所変動')
      ? `${location} ${name}`
      : name;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const mapAreas = [
    { name: '北海道・東北', query: '東北地方', search: '北海道' },
    { name: '関東', query: '関東地方', search: '東京' },
    { name: '中部・静岡', query: '静岡県', search: '静岡' },
    { name: '近畿・大阪', query: '近畿地方', search: '大阪' },
    { name: '中国・四国', query: '中国地方', search: '広島' },
    { name: '九州・福岡', query: '九州地方', search: '福岡' },
  ];

  const modalIcon = selectedItem ? (categoryIcons[selectedItem.category] || <Utensils size={14} />) : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#B85E3C] to-[#9a4e31] text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen size={22} className="opacity-80" />
            <h1 className="text-lg md:text-xl font-bold tracking-wide">マルタカ通信 厳選グルメガイド</h1>
          </div>
          <div className="relative w-48 md:w-72 text-gray-800">
            <input
              type="text"
              placeholder={`${gourmets.length}件から検索...`}
              aria-label="店舗を検索"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-full border-none focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-inner bg-white/95"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2 text-gray-400" size={16} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-5 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-800 mb-1">
            社員の足と舌が選んだ、<span className="text-[#B85E3C]">間違いのない名店</span>たち。
          </h2>
          <p className="text-gray-500 text-xs max-w-xl mx-auto mb-3 hidden sm:block">
            マルタカ通信バックナンバーから厳選。全国各地の出張先やオフィス近くの美味しいお店を網羅。
          </p>
          <button
            onClick={() => setIsMapOpen(!isMapOpen)}
            className="inline-flex items-center bg-white hover:bg-gray-50 text-[#B85E3C] border border-[#B85E3C]/30 text-xs font-bold py-2 px-4 rounded-full cursor-pointer transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85E3C]/50 active:scale-95"
          >
            <Map size={14} className="mr-1.5" />
            地図から探す
            {isMapOpen ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
          </button>
        </div>
      </section>

      {/* Sticky Map Section */}
      {isMapOpen && (
        <div className="sticky top-20 sm:top-[53px] z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm animate-in">
          <div className="max-w-4xl mx-auto px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1 justify-center">
              <button
                onClick={() => { setSearchQuery(''); setActiveMapQuery('日本'); setSelectedCategory('すべて'); }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors border ${
                  activeMapQuery === '日本' ? 'bg-[#B85E3C] text-white border-[#B85E3C]' : 'bg-white text-gray-600 border-gray-300 hover:bg-[#B85E3C]/10'
                }`}
              >全国</button>
              {mapAreas.map(area => (
                <button
                  key={area.name}
                  onClick={() => { setSearchQuery(area.search); setActiveMapQuery(area.query); }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border flex items-center ${
                    activeMapQuery === area.query ? 'bg-[#B85E3C] text-white border-[#B85E3C]' : 'bg-white text-gray-600 border-gray-300 hover:bg-[#B85E3C]/10'
                  }`}
                >
                  <MapPin size={10} className="mr-0.5" />{area.name}
                </button>
              ))}
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-300 shadow-inner bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                <Map size={14} className="mr-1" /> 地図を読み込み中...
              </div>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(activeMapQuery)}&t=&z=${activeMapQuery === '日本' ? 5 : 12}&ie=UTF8&iwloc=&output=embed`}
                width="100%" style={{ border: 0 }}
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="グルメマップ" className="w-full relative z-10 h-[120px] sm:h-[180px]"
              ></iframe>
            </div>
            <p className="mt-1 text-[10px] text-gray-400 hidden sm:flex items-center justify-center">
              <Info size={11} className="mr-1" />
              カードにマウスを合わせると地図が移動します
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* Category Filter + Count */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category); setSearchQuery(''); }}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B85E3C]/50 active:scale-95 ${
                  selectedCategory === category && searchQuery === ''
                    ? 'bg-[#B85E3C] text-white shadow-md scale-[1.02]'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-[#B85E3C]/5 hover:border-[#B85E3C]/30'
                }`}
              >
                {category !== 'すべて' && <span className="opacity-70">{categoryIcons[category] && React.cloneElement(categoryIcons[category], { size: 12 })}</span>}
                {category}
                <span className={`text-[10px] ml-0.5 ${selectedCategory === category && searchQuery === '' ? 'text-white/70' : 'text-gray-400'}`}>
                  {categoryCounts[category]}
                </span>
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 font-medium whitespace-nowrap">
            {searchQuery ? '検索結果' : '表示中'}: <span className="text-[#B85E3C] font-bold text-sm">{filteredGourmets.length}</span> 件
          </div>
        </div>

        {/* Compact Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {filteredGourmets.length > 0 ? (
            filteredGourmets.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                onMouseEnter={() => {
                  if (isMapOpen) {
                    const locationQuery = item.location !== '所在地不明' && item.location !== '市販品'
                      && !item.location.includes('詳細不明') && !item.location.includes('設置場所変動')
                      ? `${item.location} ${item.name}` : item.name;
                    setActiveMapQuery(locationQuery);
                  }
                }}
                className="relative bg-white rounded-lg border border-gray-200 hover:border-[#B85E3C]/30 hover:shadow-md transition-all duration-200 cursor-pointer group active:scale-[0.98] p-2 sm:p-2.5"
              >
                {/* Category icon + Name */}
                <div className="flex items-center gap-1 mb-1">
                  <span className={`inline-flex items-center text-[10px] font-bold p-1 rounded border flex-shrink-0 ${item.colorClass}`} aria-label={item.category}>
                    {item.icon}
                  </span>
                  <h3 className="font-bold text-[13px] text-gray-800 leading-tight line-clamp-1">{item.name}</h3>
                </div>

                {/* Location */}
                <div className="flex items-center text-[11px] text-gray-500 truncate">
                  <MapPin size={10} className="mr-0.5 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{item.location}</span>
                </div>

                {/* Menu */}
                {item.menu !== '-' && (
                  <div className="text-[10px] font-medium text-[#B85E3C]/70 truncate mt-0.5">
                    {item.menu}
                  </div>
                )}

                {/* Hover tooltip - hidden on touch devices via CSS */}
                <div className="tooltip-hover absolute z-30 left-0 right-0 bottom-full mb-1.5 bg-gray-900/95 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none backdrop-blur-sm">
                  <p className="font-bold text-white/90 mb-1 text-[13px]">{item.name}</p>
                  <p className="leading-relaxed text-gray-200">{item.comment}</p>
                  {item.contributor && (
                    <p className="mt-1.5 text-gray-400 text-[10px]">— {item.contributor}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
              <Utensils size={28} className="mx-auto mb-2 text-gray-200" />
              <p className="text-sm">条件に一致するお店が見つかりませんでした。</p>
              <p className="text-xs mt-1">検索キーワードやカテゴリを変更してお試しください。</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center mt-8 text-xs">
        <p>&copy; 2026 丸高興業株式会社 - マルタカ通信アーカイブス</p>
        <p className="mt-1.5 px-4 text-gray-500">※ 掲載情報はマルタカ通信発行当時のものです。営業時間やメニューは変更されている場合があります。</p>
      </footer>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#B85E3C] to-[#9a4e31] px-5 py-3 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <BookOpen size={16} />
                <span className="font-bold text-sm">マルタカ通信 （{selectedItem.source}）</span>
              </div>
              <button onClick={() => setSelectedItem(null)} aria-label="閉じる" className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {/* Title area */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border mb-2 ${selectedItem.colorClass || categoryColors[selectedItem.category] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                  {modalIcon}
                  {selectedItem.category}
                </span>
                <h2 className="text-xl font-extrabold text-gray-800">{selectedItem.name}</h2>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-5">
                <div className="flex items-start">
                  <MapPin className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" size={16} />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">所在地</p>
                    <a href={getMapsUrl(selectedItem.name, selectedItem.location)} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-blue-600 hover:underline flex items-center font-medium transition-colors">
                      {selectedItem.location}
                      <Map size={12} className="ml-1.5 text-gray-400" />
                    </a>
                  </div>
                </div>
                {selectedItem.menu !== '-' && (
                  <div className="flex items-start">
                    <Utensils className="text-[#B85E3C] mt-0.5 mr-2 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">おすすめメニュー</p>
                      <p className="text-sm font-medium text-gray-800">{selectedItem.menu}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Comment Box */}
              <div className="bg-[#fdfaf8] border border-[#eed7ce] rounded-xl p-4 relative">
                <div className="absolute -top-2.5 left-4 bg-[#fdfaf8] px-2 text-[10px] font-bold text-[#B85E3C] flex items-center">
                  <MessageCircle size={12} className="mr-1" />
                  コメント
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line mt-1">
                  {selectedItem.comment}
                </p>
                {selectedItem.contributor && (
                  <div className="mt-3 pt-2 border-t border-[#eed7ce]/50 flex justify-end">
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[11px] text-gray-500">
                      投稿者: <span className="text-gray-700 font-bold">{selectedItem.contributor}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex gap-3">
                <a
                  href={getTabelogUrl(selectedItem.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#B85E3C] hover:bg-[#9a4e31] text-white py-2.5 px-3 rounded-xl text-sm font-bold flex justify-center items-center transition-colors shadow-md"
                >
                  <Search size={14} className="mr-1.5" />食べログで検索
                </a>
                <a
                  href={getMapsUrl(selectedItem.name, selectedItem.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 hover:text-blue-700 py-2.5 px-3 rounded-xl text-sm font-bold flex justify-center items-center transition-colors"
                >
                  <MapPin size={14} className="mr-1.5" />Googleマップ
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
