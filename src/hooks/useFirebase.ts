"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  DocumentData,
  where,
  orderBy,
  limit,
  Firestore,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UseFirebaseOptions {
  limit?: number;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  whereField?: string;
  whereOperator?: "==" | "!=" | ">" | ">=" | "<" | "<=";
  whereValue?: any;
}

export function useFirebase<T = DocumentData>(
  collectionName: string,
  options: UseFirebaseOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Build query with optional filters
        let queryRef = collection(db as Firestore, collectionName);
        let queryConstraints = [];
        
        // Add where clause if provided
        if (options.whereField && options.whereOperator && options.whereValue !== undefined) {
          queryConstraints.push(
            where(options.whereField, options.whereOperator, options.whereValue)
          );
        }
        
        // Add orderBy if provided
        if (options.orderByField) {
          queryConstraints.push(
            orderBy(options.orderByField, options.orderDirection || "asc")
          );
        }
        
        // Add limit if provided
        if (options.limit) {
          queryConstraints.push(limit(options.limit));
        }
        
        // Execute query with all constraints
        const q = query(queryRef, ...queryConstraints);
        const querySnapshot = await getDocs(q);
        
        // Map documents to data with ID
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        
        setData(fetchedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching from Firestore:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, options.limit, options.orderByField, options.orderDirection, options.whereField, options.whereOperator, options.whereValue]);

  return { data, loading, error };
}

export default useFirebase; 