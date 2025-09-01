'use client';

import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';
import { useParams, useRouter } from 'next/navigation';
import { fetchNoteId } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const NotePreview = () => {
  const router = useRouter();
  const onClose = () => {
    router.back();
  };

  const { id } = useParams<{ id: string }>();
  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteId(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={onClose}>
      {note && (
        <div>
          <h2 className={css.titlePreview}>{note.title}</h2>

          <div className={css.tagPreview}>{note.tag}</div>

          <p className={css.contentPreview}>{note.content}</p>

          <div className={css.datePreview}>{note.createdAt}</div>
        </div>
      )}
      {isLoading && <p>Loading...</p>}
    </Modal>
  );
};

export default NotePreview;
