import { useCallback, useEffect, useState } from 'react';
import { supplementRepo } from '@/storage/supplementRepository';
import type { Supplement } from '@/types';

export function useSupplements() {
  const [items, setItems] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await supplementRepo.list();
    setItems(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (s: Supplement) => {
    await supplementRepo.create(s);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (s: Supplement) => {
    await supplementRepo.update(s);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await supplementRepo.remove(id);
    await refresh();
  }, [refresh]);

  return {
    items,
    loading,
    add,
    update,
    remove,
    refresh,
    count: items.length,
  };
}
