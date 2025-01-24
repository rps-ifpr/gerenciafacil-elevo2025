import { useState, useEffect } from 'react';
import { DashboardStats } from '../dashboard/DashboardStats';
import { OngoingActionsTable } from '../dashboard/OngoingActionsTable';
import { TVFooter } from './TVFooter';
import { TVHeader } from './TVHeader';

const SLIDE_DURATION = 30000; // 30 segundos

export function TVSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, SLIDE_DURATION);

    const updateInterval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5 * 60 * 1000); // Atualiza a cada 5 minutos

    return () => {
      clearInterval(slideInterval);
      clearInterval(updateInterval);
    };
  }, []);

  const slides = [
    // Slide 1: Estatísticas Gerais
    <div key="stats" className="space-y-8 animate-fade-in">
      <TVHeader lastUpdate={lastUpdate} />
      <DashboardStats />
    </div>,

    // Slide 2: Ações em Andamento
    <div key="actions" className="space-y-8 animate-fade-in">
      <TVHeader lastUpdate={lastUpdate} />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Ações em Andamento
        </h2>
        <OngoingActionsTable />
      </div>
    </div>,

    // Slide 3: Status das Atividades
    <div key="status" className="space-y-8 animate-fade-in">
      <TVHeader lastUpdate={lastUpdate} />
      <TVFooter />
    </div>
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {slides[currentSlide]}
        
        {/* Indicadores de slide */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                currentSlide === index
                  ? 'bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}