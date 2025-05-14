import { useState, useEffect } from 'react';
import { Collection } from 'framer-plugin';
import { framer } from 'framer-plugin';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    const loadCollections = async () => {
      const [allCollections, activeCollection] = await Promise.all([
        framer.getCollections(),
        framer.getActiveCollection()
      ]);
      
      setCollections(allCollections);
      setSelectedCollection(activeCollection);
    };

    loadCollections();
  }, []);

  const selectCollection = (collectionId: string) => {
    const collection = collections.find(collection => collection.id === collectionId);
    if (collection) {
      setSelectedCollection(collection);
    }
  };

  return {
    collections,
    selectedCollection,
    selectCollection
  };
} 