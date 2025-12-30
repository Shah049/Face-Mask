
import React from 'react';

export enum MaskStatus {
  MASK = 'Mask',
  NO_MASK = 'No Mask',
  UNKNOWN = 'Detecting...'
}

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface FaceDetection {
  status: MaskStatus;
  confidence: number;
  box: BoundingBox;
}

export interface DetectionResult {
  faces: FaceDetection[];
  timestamp: number;
  message?: string;
}

export interface FeedbackEntry {
  id: string;
  imageData: string;
  detectedStatus: string;
  userCorrection: 'false_positive' | 'false_negative';
  timestamp: number;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}
