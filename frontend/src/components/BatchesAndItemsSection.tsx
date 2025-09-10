import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Batch } from '../types';
import BatchesOverview from './BatchesOverview';
import BatchItemsView from './BatchItemsView';

export const BatchesAndItemsSection: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'items'>('overview');

  const handleViewItems = (batch: Batch) => {
    setSelectedBatch(batch);
    setViewMode('items');
  };

  const handleBackToOverview = () => {
    setSelectedBatch(null);
    setViewMode('overview');
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {viewMode === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BatchesOverview onViewItems={handleViewItems} />
          </motion.div>
        )}

        {viewMode === 'items' && selectedBatch && (
          <motion.div
            key="items"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <BatchItemsView 
              batch={selectedBatch} 
              onBack={handleBackToOverview} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BatchesAndItemsSection;