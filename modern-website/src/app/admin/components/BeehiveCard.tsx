import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, MessageCircle } from 'lucide-react';
import type { BeehiveRequest } from '../lib/types';

interface BeehiveCardProps {
  request: BeehiveRequest;
  index: number;
}

export function BeehiveCard({ request, index }: BeehiveCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
            {request.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {request.description}
          </p>
        </div>
        <span className="text-lg font-bold text-gray-400 dark:text-gray-600 ml-2">
          #{index + 1}
        </span>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <ArrowUp size={14} className="text-blue-500" />
            <span className="font-semibold">{request.upvotes_count}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <MessageCircle size={14} />
            <span>{request.comments_count}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {request.country}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium ${
              statusColors[request.status as keyof typeof statusColors] || statusColors.pending
            }`}
          >
            {request.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
