import { useParams } from 'react-router-dom';

/** 영양제 등록/편집 — T15에서 구현 */
export default function SupplementEditPage() {
  const { id } = useParams<{ id?: string }>();
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>{id ? '영양제 편집' : '영양제 추가'}</h1>
      <p style={{ color: '#4B5563' }}>등록/편집 폼 — T15에서 구현 예정</p>
    </div>
  );
}
