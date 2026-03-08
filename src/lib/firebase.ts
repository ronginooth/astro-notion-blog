import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, increment } from 'firebase/database';

// ユーザーから提供された設定
const firebaseConfig = {
  apiKey: "AIzaSyD4gb6Ge41lEn92C0W-UxaQIl0xjGqvSAE",
  authDomain: "astro-notion-stats.firebaseapp.com",
  projectId: "astro-notion-stats",
  storageBucket: "astro-notion-stats.firebasestorage.app",
  messagingSenderId: "380122423196",
  appId: "1:380122423196:web:b7244a1373856dc63eb259",
  measurementId: "G-HSEED4JHBF",
  // Realtime Database用のURL（デフォルト形式）を明示的に指定
  databaseURL: "https://astro-notion-stats-default-rtdb.firebaseio.com",
};

// 重複初期化を防ぐ
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

// ----- 共通関数群 -----

// 指定された記事スラッグのPVを増やす
export const incrementPageView = async (slug: string) => {
  if (!slug) return;
  const pvRef = ref(database, `stats/${slug}/views`);
  await set(pvRef, increment(1));
};

// 指定された記事スラッグの「いいね」を増やす
export const incrementLike = async (slug: string) => {
  if (!slug) return;
  const likeRef = ref(database, `stats/${slug}/likes`);
  await set(likeRef, increment(1));
};

// 指定された単一記事の統計情報を取得する
export const getStats = async (slug: string) => {
  if (!slug) return { views: 0, likes: 0 };
  const statsRef = ref(database, `stats/${slug}`);
  const snapshot = await get(statsRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      views: data.views || 0,
      likes: data.likes || 0,
    };
  }
  return { views: 0, likes: 0 };
};
