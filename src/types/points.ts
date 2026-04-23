export type PointsSource =
  | 'ad_watch'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'spend_premium_1d'
  | 'spend_premium_7d'
  | 'spend_freeze'
  | 'grant_initial';

export interface PointsTransaction {
  id: string;
  type: 'earn' | 'spend';
  source: PointsSource;
  amount: number;
  createdAt: number;
}
