import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSupplements } from '@/hooks/useSupplements';
import { usePremiumContext } from '@/contexts/PremiumContext';
import { catalog, searchCatalog, type CatalogItem } from '@/data/supplementCatalog';
import { findInteractions } from '@/data/interactionRules';
import { INTAKE_SLOT_LABEL, WEEKDAY_LABEL, type IntakeSlot, type Weekday } from '@/types';
import { FREE_SUPPLEMENT_LIMIT } from '@/config/premiumConstants';

const SLOTS: IntakeSlot[] = ['morning', 'lunch', 'evening', 'bedtime'];
const WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export default function SupplementEditPage() {
  const { id } = useParams<{ id?: string }>();
  const nav = useNavigate();
  const supplements = useSupplements();
  const premium = usePremiumContext();

  const editing = id ? supplements.items.find((s) => s.id === id) : undefined;

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [dose, setDose] = useState('1정');
  const [slots, setSlots] = useState<IntakeSlot[]>(['morning']);
  const [weekdays, setWeekdays] = useState<Weekday[]>([0, 1, 2, 3, 4, 5, 6]);
  const [query, setQuery] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setBrand(editing.brand ?? '');
      setDose(editing.dose);
      setSlots(editing.slots);
      setWeekdays(editing.weekdays);
      // 기존 저장된 영양제는 catalog에서 성분 복원
      const catalogMatch = catalog.find((c) => c.name === editing.name);
      if (catalogMatch) setIngredients(catalogMatch.ingredients);
    }
  }, [editing]);

  const searchResults = useMemo(() => searchCatalog(query).slice(0, 8), [query]);

  // 상호작용 경고 계산
  const warnings = useMemo(() => {
    if (ingredients.length === 0) return [];
    const allWarnings: Array<{ other: string; message: string; severity: string }> = [];
    for (const other of supplements.items) {
      if (editing && other.id === editing.id) continue;
      const otherCatalog = catalog.find((c) => c.name === other.name);
      if (!otherCatalog) continue;
      const found = findInteractions(ingredients, otherCatalog.ingredients);
      for (const w of found) {
        allWarnings.push({ other: other.name, message: w.message, severity: w.severity });
      }
    }
    return allWarnings;
  }, [ingredients, supplements.items, editing]);

  const selectFromCatalog = (item: CatalogItem) => {
    setName(item.name);
    setDose(item.commonDose);
    setIngredients(item.ingredients);
    setQuery('');
  };

  const toggleSlot = (s: IntakeSlot) => {
    setSlots((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleWeekday = (w: Weekday) => {
    setWeekdays((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]));
  };

  const onSave = async () => {
    if (!name.trim()) {
      alert('영양제 이름을 입력해주세요');
      return;
    }
    if (slots.length === 0) {
      alert('복용 시간을 최소 하나 선택해주세요');
      return;
    }
    if (weekdays.length === 0) {
      alert('요일을 최소 하나 선택해주세요');
      return;
    }

    // 무료 한도 체크 (신규 등록 시)
    if (!editing && !premium.status.active && supplements.count >= FREE_SUPPLEMENT_LIMIT) {
      nav('/paywall', { replace: true });
      return;
    }

    const base = {
      name: name.trim(),
      brand: brand.trim() || undefined,
      dose,
      slots,
      weekdays,
    };

    if (editing) {
      await supplements.update({ ...editing, ...base });
    } else {
      await supplements.add({
        id: crypto.randomUUID(),
        ...base,
        createdAt: Date.now(),
      });
    }
    nav('/supplements', { replace: true });
  };

  const onDelete = async () => {
    if (!editing) return;
    if (!confirm(`${editing.name}을(를) 삭제할까요?`)) return;
    await supplements.remove(editing.id);
    nav('/supplements', { replace: true });
  };

  return (
    <div style={{ padding: '16px 20px 96px', background: '#FFFFFF', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#191F28', margin: '0 0 20px' }}>
        {editing ? '영양제 편집' : '영양제 추가'}
      </h1>

      {/* 검색 */}
      {!editing && (
        <section style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>검색으로 빠르게 추가</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="종합비타민, 오메가3…"
            style={{
              width: '100%',
              padding: '12px 14px',
              marginTop: 8,
              border: '1px solid #E5E7EB',
              borderRadius: 10,
              fontSize: 15,
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          {searchResults.length > 0 && (
            <div style={{ marginTop: 8, border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectFromCatalog(item)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    border: 'none',
                    borderBottom: '1px solid #F3F4F6',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ fontSize: 15, color: '#191F28' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{item.category} · {item.commonDose}</div>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 이름 */}
      <section style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>이름 *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 종합비타민"
          style={{ width: '100%', padding: '12px 14px', marginTop: 8, border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 15, boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
      </section>

      {/* 브랜드 */}
      <section style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>브랜드 (선택)</label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="예: 센트룸"
          style={{ width: '100%', padding: '12px 14px', marginTop: 8, border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 15, boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
      </section>

      {/* 용량 */}
      <section style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>용량 *</label>
        <input
          type="text"
          value={dose}
          onChange={(e) => setDose(e.target.value)}
          placeholder="예: 1정, 1포"
          style={{ width: '100%', padding: '12px 14px', marginTop: 8, border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 15, boxSizing: 'border-box', fontFamily: 'inherit' }}
        />
      </section>

      {/* 복용 시간 */}
      <section style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>복용 시간 *</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          {SLOTS.map((s) => {
            const on = slots.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleSlot(s)}
                style={{
                  padding: '12px',
                  border: '1px solid ' + (on ? '#3182F6' : '#E5E7EB'),
                  background: on ? '#E8F3FF' : '#FFFFFF',
                  color: on ? '#1649B8' : '#4B5563',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: on ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {INTAKE_SLOT_LABEL[s]}
              </button>
            );
          })}
        </div>
      </section>

      {/* 요일 */}
      <section style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>반복 요일 *</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginTop: 8 }}>
          {WEEKDAYS.map((w) => {
            const on = weekdays.includes(w);
            return (
              <button
                key={w}
                onClick={() => toggleWeekday(w)}
                style={{
                  padding: '10px 0',
                  border: '1px solid ' + (on ? '#3182F6' : '#E5E7EB'),
                  background: on ? '#E8F3FF' : '#FFFFFF',
                  color: on ? '#1649B8' : '#4B5563',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: on ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {WEEKDAY_LABEL[w]}
              </button>
            );
          })}
        </div>
      </section>

      {/* 상호작용 경고 */}
      {warnings.length > 0 && (
        <section style={{ marginBottom: 16, padding: 16, background: '#FFF3E0', border: '1px solid #FF9800', borderRadius: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#E45600', marginBottom: 8 }}>
            ⚠️ 성분 상호작용 주의
          </div>
          {warnings.slice(0, 3).map((w, idx) => (
            <div key={idx} style={{ fontSize: 13, color: '#4B5563', marginTop: 4 }}>
              · <strong>{w.other}</strong>: {w.message}
            </div>
          ))}
        </section>
      )}

      {/* 저장 / 삭제 */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        {editing && (
          <button
            onClick={onDelete}
            style={{
              flex: 0.4,
              height: 56,
              borderRadius: 12,
              background: '#FFEEEE',
              color: '#E63333',
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            삭제
          </button>
        )}
        <button
          onClick={onSave}
          style={{
            flex: 1,
            height: 56,
            borderRadius: 12,
            background: '#3182F6',
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {editing ? '수정하기' : '저장하기'}
        </button>
      </div>
    </div>
  );
}
